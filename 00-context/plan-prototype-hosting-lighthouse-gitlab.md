# Plan: Deploy Multiple Vite/Vue Prototypes To Tencent Cloud Lighthouse (1Panel) + GitLab

## TL;DR
> Deploy two existing Vue/Vite SPA prototypes (and future ones) to your Tencent Cloud Lighthouse (Tokyo) behind a single domain `prototype.ricelove.cc`, served under path prefixes like `/name_01/`, `/name_02/`.
>
> Default approach: GitLab monorepo + GitLab CI builds `dist/` + SSH/rsync deploy to Lighthouse + Nginx serves static files with SPA history fallback + Let's Encrypt TLS.

## Context
### Original Request
- Projects:
  - `Product-SDD-Workbench/projects/chapter-list-redesign`
  - `Product-SDD-Workbench/projects/培优课章节列表迭代`
- Target hosting: Tencent Cloud Lighthouse (轻应用服务器), Tokyo, 2C4G, 60G, managed via 1Panel
- Domain strategy: `prototype.ricelove.cc/name_01`, `prototype.ricelove.cc/name_02`, … (future projects)
- Git remote: company GitLab

### Repo/Prototype Facts (from exploration)
- App A (chapter list): `Product-SDD-Workbench/projects/chapter-list-redesign/02-prototypes/vue-apps/chapter-list-redesign`
  - Vue 3 + Vite 5; build outputs `dist/`
  - `vite.config.ts` currently uses `base: './'`
  - lockfile: `package-lock.json`
- App B (premium course list): `Product-SDD-Workbench/projects/培优课章节列表迭代/02-prototypes/vue-apps/premium-course-list`
  - Vue 3 + Vite 7 + vue-router history; build outputs `dist/`
  - `vite.config.ts` currently has no `base`
  - lockfile: `pnpm-lock.yaml`
  - local `node_modules/` exists (must not be committed)

### Decisions (locked for this plan)
- URL contract: ONE domain + MANY path prefixes, canonical form `/${SITE_PREFIX}/` (trailing slash required)
- Git strategy: ONE GitLab monorepo for all prototypes (`prototype-sites`) with `apps/<site_prefix>/...`
- Deployment: GitLab CI builds on runner; server only serves static + receives rsync; no Node required on Lighthouse
- TLS: Let's Encrypt via Certbot (preferred) OR 1Panel-managed certificate (fallback)

## Work Objectives
### Core Objective
Make `prototype.ricelove.cc` serve multiple SPAs at stable paths (e.g. `/chapter-list/`, `/premium-course/`) with HTTPS and a repeatable git-driven deployment workflow.

### Deliverables
- A GitLab repo `prototype-sites` containing:
  - `apps/chapter-list/` (from App A)
  - `apps/premium-course/` (from App B)
  - `infra/nginx/prototype.ricelove.cc.conf` (vhost config template)
  - `infra/scripts/deploy.sh` (optional local deploy helper)
  - `root/sites.json` + `root/index.html` landing page listing all prototypes
- Lighthouse server configured:
  - Nginx vhost for `prototype.ricelove.cc`
  - Static roots for each app under `/var/www/prototype-sites/<site_prefix>/current`
  - Correct SPA history fallback and caching headers
  - HTTPS certificate and auto-renew
- GitLab CI pipeline that, on `main`:
  - Builds each app
  - Rsyncs `dist/` to the matching server directory
  - Reloads Nginx

### Definition of Done (verifiable)
- `https://prototype.ricelove.cc/` returns 200 with a landing page linking to each deployed prototype.
- `https://prototype.ricelove.cc/chapter-list/` returns 200 and loads assets (no 404).
- `https://prototype.ricelove.cc/chapter-list/some/deep/route` returns 200 (SPA fallback), not 404.
- `https://prototype.ricelove.cc/premium-course/` returns 200 and deep links work.
- Nginx config test passes: `nginx -t`.
- TLS is valid: `openssl s_client` shows a non-expired cert for `prototype.ricelove.cc`.
- GitLab CI deploy job completes successfully and updates files on server (verified by build hash or timestamp).

### Must NOT Have (guardrails)
- No `node_modules/` committed to git.
- No SSH access via root or password auth for deployments.
- No serving an SPA under a prefix without setting Vite/router base to that prefix.
- No caching `index.html` aggressively (must be no-cache) to avoid broken releases.

## Naming Conventions (Decision Complete)
- Domain: `prototype.ricelove.cc`
- Site prefixes (fixed for this plan):
  - App A: `chapter-list` → URL: `/chapter-list/`
  - App B: `premium-course` → URL: `/premium-course/`

## Server Layout (Decision Complete)
- Web root base: `/var/www/prototype-sites`
- For each site prefix `${P}`:
  - Releases: `/var/www/prototype-sites/${P}/releases/<git_sha>/...`
  - Current symlink: `/var/www/prototype-sites/${P}/current -> releases/<git_sha>`
  - Nginx serves from: `/var/www/prototype-sites/${P}/current`

## Nginx VHost (Decision Complete)
### Preferred config model (works under or without 1Panel)
Use a single vhost for `prototype.ricelove.cc` with per-prefix locations, using `root` (not `alias`) to avoid common `try_files` footguns.

Template (executor will install into the active Nginx include path discovered on the server):

```nginx
server {
  listen 80;
  server_name prototype.ricelove.cc;

  # ACME challenge (certbot)
  location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
  }

  # Redirect HTTP -> HTTPS after cert is installed (enable in final step)
  # return 301 https://$host$request_uri;

  # Landing page (static HTML)
  root /var/www/prototype-sites/root;
  index index.html;

  location = / {
    try_files /index.html =404;
    add_header Cache-Control "no-store";
  }

  # Canonical trailing slash redirects
  location = /chapter-list { return 301 /chapter-list/; }
  location = /premium-course { return 301 /premium-course/; }

  # -------- Site: /chapter-list/ --------
  # Assets: cache long, never SPA-fallback
  location ^~ /chapter-list/assets/ {
    root /var/www/prototype-sites;
    try_files $uri =404;
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
  }

  # App: SPA fallback + no-cache HTML
  location ^~ /chapter-list/ {
    root /var/www/prototype-sites;
    try_files $uri $uri/ /chapter-list/index.html;
    add_header Cache-Control "no-store";
  }

  # -------- Site: /premium-course/ --------
  location ^~ /premium-course/assets/ {
    root /var/www/prototype-sites;
    try_files $uri =404;
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
  }

  location ^~ /premium-course/ {
    root /var/www/prototype-sites;
    try_files $uri $uri/ /premium-course/index.html;
    add_header Cache-Control "no-store";
  }
}
```

HTTPS server block will be added after TLS issuance (Certbot can do this automatically; if using 1Panel certs, executor will copy cert paths into the 443 block).

## GitLab CI/CD (Decision Complete)
### Deployment mechanism
- Use GitLab CI on shared/company runners.
- Store a deploy SSH key in GitLab CI variables.
- Deploy by rsyncing build output to `/var/www/prototype-sites/<prefix>/releases/<sha>/` then updating `current` symlink, then `nginx -t && systemctl reload nginx`.

### CI variables (to be set in GitLab project)
- `DEPLOY_HOST`: public IP or hostname of Lighthouse
- `DEPLOY_USER`: `deployer`
- `DEPLOY_SSH_KEY`: private key (masked + protected)
- `DEPLOY_KNOWN_HOSTS`: output of `ssh-keyscan -H <host>` (prevents MITM)

## TODOs (Decision Complete)
> Each task includes implementation + verification. Commands are written to be copy/paste on macOS/Linux.

- [ ] 1. Create GitLab monorepo `prototype-sites` and local working directory

  What to do:
  - Create a new GitLab project named `prototype-sites` (private) in your company GitLab.
  - Create a local folder (inside this workbench) to host the repo:
    - `Product-SDD-Workbench/projects/prototype-sites-repo/` (new)
  - Initialize git and add remote.

  Acceptance Criteria:
  - `git remote -v` shows the GitLab URL.

  QA Scenarios:
  ```
  Scenario: Repo ready
    Tool: Bash
    Steps: git status; git remote -v
    Expected: Clean repo + remote present
  ```

- [ ] 2. Import App A source into `apps/chapter-list/` (no node_modules)

  What to do:
  - Copy from `Product-SDD-Workbench/projects/chapter-list-redesign/02-prototypes/vue-apps/chapter-list-redesign/` into `apps/chapter-list/`.
  - Ensure `node_modules/` and `dist/` are NOT present.

  Acceptance Criteria:
  - `apps/chapter-list/package.json` exists.
  - No `apps/chapter-list/node_modules` directory.

  QA Scenarios:
  ```
  Scenario: Import succeeded
    Tool: Bash
    Steps: test -f apps/chapter-list/package.json; test ! -d apps/chapter-list/node_modules
    Expected: package.json exists; node_modules absent
  ```

- [ ] 3. Import App B source into `apps/premium-course/` (remove committed node_modules)

  What to do:
  - Copy from `Product-SDD-Workbench/projects/培优课章节列表迭代/02-prototypes/vue-apps/premium-course-list/` into `apps/premium-course/`.
  - If `node_modules/` exists in source, do not copy it.

  Acceptance Criteria:
  - `apps/premium-course/pnpm-lock.yaml` exists.
  - No `apps/premium-course/node_modules` directory.

  QA Scenarios:
  ```
  Scenario: Import succeeded
    Tool: Bash
    Steps: test -f apps/premium-course/pnpm-lock.yaml; test ! -d apps/premium-course/node_modules
    Expected: lockfile exists; node_modules absent
  ```

- [ ] 4. Standardize subpath hosting in both apps (Vite base + router base)

  What to do:
  - App A: set Vite `base` to `/chapter-list/`.
  - App B: set Vite `base` to `/premium-course/` AND set vue-router history base to match.
  - For App B, update router to:
    - `createWebHistory('/premium-course/')` OR `createWebHistory(import.meta.env.BASE_URL)` with Vite base set.

  Acceptance Criteria:
  - After `npm/pnpm build`, generated `dist/index.html` references assets under the correct prefix (e.g. `/premium-course/assets/...`).

  QA Scenarios:
  ```
  Scenario: Build output uses correct prefix
    Tool: Bash
    Steps:
      - cd apps/chapter-list && npm ci && npm run build
      - grep -q "/chapter-list/assets/" dist/index.html
      - cd ../premium-course && corepack enable && pnpm install --frozen-lockfile && pnpm build
      - grep -q "/premium-course/assets/" dist/index.html
    Expected: Both greps succeed
  ```

- [ ] 5. Add root landing page listing prototypes

  What to do:
  - Create `root/index.html` (plain HTML) and `root/sites.json` describing available prototypes and paths.
  - The landing page must link to `/chapter-list/` and `/premium-course/`.
  - Add Nginx vhost template file in repo:
    - `infra/nginx/prototype.ricelove.cc.conf` (copy the vhost template from this plan verbatim)

  Acceptance Criteria:
  - `root/index.html` exists and contains both links.
  - `infra/nginx/prototype.ricelove.cc.conf` exists.

  QA Scenarios:
  ```
  Scenario: Landing page contains links
    Tool: Bash
    Steps: grep -q "/chapter-list/" root/index.html; grep -q "/premium-course/" root/index.html
    Expected: Both greps succeed
  ```

  ```
  Scenario: Nginx template present
    Tool: Bash
    Steps: test -f infra/nginx/prototype.ricelove.cc.conf
    Expected: file exists
  ```

- [ ] 6. Commit + push initial monorepo to GitLab

  What to do:
  - Add `.gitignore` at repo root to exclude `**/node_modules`, `**/dist`, `**/*.local`.
  - Commit with message: `chore: initialize prototype-sites monorepo`.
  - Push `main`.

  Acceptance Criteria:
  - GitLab shows the repo with both apps and root landing page.

  QA Scenarios:
  ```
  Scenario: Push succeeded
    Tool: Bash
    Steps: git log -1 --oneline
    Expected: commit message matches
  ```

- [ ] 7. Prepare Lighthouse DNS + ports

  What to do:
  - DNS: create `A` record `prototype.ricelove.cc` -> Lighthouse public IP.
  - Lighthouse firewall: allow inbound TCP 80, 443, 22.

  Acceptance Criteria:
  - From local: `dig +short prototype.ricelove.cc` returns the server IP.

  QA Scenarios:
  ```
  Scenario: DNS resolves
    Tool: Bash
    Steps: dig +short prototype.ricelove.cc
    Expected: outputs expected IP
  ```

- [ ] 8. Server bootstrap (discover OS, install Nginx, create deploy user)

  What to do:
  - SSH to Lighthouse.
  - Detect OS:
    - `cat /etc/os-release`
  - Install Nginx:
    - Ubuntu/Debian: `apt update && apt install -y nginx`
    - CentOS/RHEL: `yum install -y nginx`
  - Create a non-root deploy user `deployer` with SSH key auth.
  - Harden SSH: disable root login + password auth.
  - Allow deployer to reload Nginx without password (least privilege sudoers):
    - Create `/etc/sudoers.d/deployer-nginx` containing:
      - `deployer ALL=NOPASSWD: /usr/sbin/nginx -t, /bin/systemctl reload nginx, /bin/systemctl restart nginx`

  Acceptance Criteria:
  - `nginx -v` works.
  - `ssh deployer@prototype.ricelove.cc` works using key auth.
  - `ssh deployer@<host> "sudo nginx -t"` works without prompting for password.

  QA Scenarios:
  ```
  Scenario: Nginx installed
    Tool: Bash
    Steps: ssh deployer@<host> "nginx -v"
    Expected: exits 0
  ```

- [ ] 9. Create server directory layout for prototype sites

  What to do:
  - Create:
    - `/var/www/prototype-sites/root`
    - `/var/www/prototype-sites/chapter-list/releases`
    - `/var/www/prototype-sites/premium-course/releases`
  - Set ownership to `deployer`.

  Acceptance Criteria:
  - `deployer` can write to these directories.

  QA Scenarios:
  ```
  Scenario: Permissions OK
    Tool: Bash
    Steps: ssh deployer@<host> "test -w /var/www/prototype-sites/chapter-list/releases"
    Expected: exits 0
  ```

- [ ] 10. Install Nginx vhost for `prototype.ricelove.cc` (HTTP first)

  What to do:
  - Place the vhost config (from this plan) into the active Nginx config include directory.
  - Ensure it does NOT conflict with 1Panel-managed sites:
    - If 1Panel owns Nginx configs, add this as a dedicated site/vhost via 1Panel “custom config” and record the file path.
  - Reload Nginx after `nginx -t`.

  Acceptance Criteria:
  - `nginx -t` passes.
  - `curl -I http://prototype.ricelove.cc/` returns 200.

  QA Scenarios:
  ```
  Scenario: HTTP site serves landing
    Tool: Bash
    Steps: curl -sI http://prototype.ricelove.cc/ | head -n 1
    Expected: HTTP/1.1 200 (or 301 if HTTPS redirect already enabled)
  ```

- [ ] 11. Obtain HTTPS certificate for `prototype.ricelove.cc`

  What to do (preferred):
  - Use Certbot with Nginx plugin.
  - Enable auto-renew and test dry-run.

  What to do (fallback):
  - Use 1Panel to issue and bind a Let's Encrypt cert to the site.

  Acceptance Criteria:
  - `https://prototype.ricelove.cc/` returns 200.
  - Cert is valid and non-expired.

  QA Scenarios:
  ```
  Scenario: TLS valid
    Tool: Bash
    Steps: echo | openssl s_client -connect prototype.ricelove.cc:443 -servername prototype.ricelove.cc 2>/dev/null | openssl x509 -noout -subject -dates
    Expected: shows CN/SAN for prototype.ricelove.cc; notAfter in future
  ```

- [ ] 12. Configure GitLab CI deploy key + known_hosts

  What to do:
  - Generate a dedicated SSH keypair for CI deploy.
  - Add public key to `/home/deployer/.ssh/authorized_keys`.
  - Add GitLab CI variables (`DEPLOY_*`).
  - Ensure key is restricted to deploy user (not root).

  Acceptance Criteria:
  - A CI job can SSH to server non-interactively.

  QA Scenarios:
  ```
  Scenario: CI SSH handshake
    Tool: Bash
    Steps: ssh -o StrictHostKeyChecking=yes -i <ci_key> deployer@prototype.ricelove.cc "echo ok"
    Expected: outputs ok
  ```

- [ ] 13. Add `.gitlab-ci.yml` to build + deploy both apps

  What to do:
  - Build jobs:
    - `apps/chapter-list`: `npm ci && npm run build`
    - `apps/premium-course`: `corepack enable && pnpm install --frozen-lockfile && pnpm build`
  - Deploy job:
    - rsync each `dist/` into `/var/www/prototype-sites/<prefix>/releases/$CI_COMMIT_SHA/`
    - update `current` symlink atomically
    - reload nginx

  Implement as this concrete starting point (adjust only paths/host variables, keep the mechanics):

  ```yaml
  stages: [build, deploy]

  build_chapter_list:
    stage: build
    image: node:20-bullseye
    script:
      - cd apps/chapter-list
      - npm ci
      - npm run build
    artifacts:
      paths:
        - apps/chapter-list/dist/
      expire_in: 7 days

  build_premium_course:
    stage: build
    image: node:20-bullseye
    script:
      - corepack enable
      - cd apps/premium-course
      - pnpm install --frozen-lockfile
      - pnpm build
    artifacts:
      paths:
        - apps/premium-course/dist/
      expire_in: 7 days

  deploy_lighthouse:
    stage: deploy
    image: alpine:3.20
    needs:
      - job: build_chapter_list
        artifacts: true
      - job: build_premium_course
        artifacts: true
    only:
      - main
    before_script:
      - apk add --no-cache openssh-client rsync
      - mkdir -p ~/.ssh
      - chmod 700 ~/.ssh
      - echo "$DEPLOY_SSH_KEY" > ~/.ssh/id_ed25519
      - chmod 600 ~/.ssh/id_ed25519
      - echo "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
    script:
      - export SHA="$CI_COMMIT_SHA"
      - ssh -i ~/.ssh/id_ed25519 "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p /var/www/prototype-sites/chapter-list/releases/$SHA /var/www/prototype-sites/premium-course/releases/$SHA"
      - rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519" apps/chapter-list/dist/ "$DEPLOY_USER@$DEPLOY_HOST:/var/www/prototype-sites/chapter-list/releases/$SHA/"
      - rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519" apps/premium-course/dist/ "$DEPLOY_USER@$DEPLOY_HOST:/var/www/prototype-sites/premium-course/releases/$SHA/"
      - rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519" root/ "$DEPLOY_USER@$DEPLOY_HOST:/var/www/prototype-sites/root/"
      - ssh -i ~/.ssh/id_ed25519 "$DEPLOY_USER@$DEPLOY_HOST" "ln -sfn /var/www/prototype-sites/chapter-list/releases/$SHA /var/www/prototype-sites/chapter-list/current"
      - ssh -i ~/.ssh/id_ed25519 "$DEPLOY_USER@$DEPLOY_HOST" "ln -sfn /var/www/prototype-sites/premium-course/releases/$SHA /var/www/prototype-sites/premium-course/current"
      - ssh -i ~/.ssh/id_ed25519 "$DEPLOY_USER@$DEPLOY_HOST" "sudo nginx -t && sudo systemctl reload nginx"
  ```

  Acceptance Criteria:
  - Pipeline passes on `main`.

  QA Scenarios:
  ```
  Scenario: Pipeline deploys both
    Tool: GitLab CI
    Steps: push commit to main
    Expected: deploy job succeeds; server paths updated
  ```

- [ ] 14. Post-deploy HTTP verification (no browser)

  What to do:
  - Verify redirects + SPA fallback + cache headers.

  Acceptance Criteria:
  - Canonical redirect works:
    - `/chapter-list` -> `/chapter-list/`
  - Deep links return 200 and `text/html`.
  - `index.html` has `Cache-Control: no-store`.

  QA Scenarios:
  ```
  Scenario: Redirect + deep link
    Tool: Bash
    Steps:
      - curl -sI https://prototype.ricelove.cc/chapter-list | grep -i '^location:'
      - curl -sI https://prototype.ricelove.cc/chapter-list/deep/link | head -n 1
      - curl -sI https://prototype.ricelove.cc/chapter-list/ | grep -i '^cache-control:'
    Expected:
      - location: /chapter-list/
      - 200 on deep link
      - cache-control contains no-store
  ```

- [ ] 15. Future-project onboarding recipe (documented in repo)

  What to do:
  - Add `infra/ADDING_A_NEW_SITE.md` with exact steps:
    - pick `<site_prefix>`
    - set Vite base + router base
    - add Nginx location block
    - add GitLab CI build+deploy stanza
    - add landing page entry

  Acceptance Criteria:
  - A new engineer can add a third site without guessing.

  QA Scenarios:
  ```
  Scenario: Doc completeness
    Tool: Read
    Steps: open infra/ADDING_A_NEW_SITE.md
    Expected: includes all 5 steps + example
  ```

## Recommended Method (based on your setup)
- Use 1Panel for general server ops (service monitoring, firewall visibility, cert management if you prefer UI), but keep the deployment itself git-driven.
- Prefer GitLab CI build+rsync deploy (server stays lean; avoids Node/pnpm differences on Lighthouse).

## Notes About 1Panel (explicit guardrail)
- 1Panel may manage Nginx/OpenResty config locations differently across installs.
- The executor MUST record the actual active Nginx config paths discovered by:
  - `nginx -V 2>&1 | tr ' ' '\n' | grep conf-path`
  - `nginx -T | head` (to see include tree)
and then place the vhost accordingly.
