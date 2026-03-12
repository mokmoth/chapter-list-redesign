# Draft: Deploy Prototypes To Tencent Cloud Lighthouse + Git

## Requirements (confirmed)
- Deploy two prototype projects to a Tencent Cloud Lighthouse (轻应用服务器)
- Manage with git for future maintenance/iteration

## Projects In Scope
- `Product-SDD-Workbench/projects/chapter-list-redesign/02-prototypes/vue-apps/chapter-list-redesign`
- `Product-SDD-Workbench/projects/培优课章节列表迭代/02-prototypes/vue-apps/premium-course-list`

## Research Findings
- Both apps are Vue 3 + Vite SPA builds (static output `dist/`)
- `chapter-list-redesign` has `base: './'` in `vite.config.ts` (good for subdirectory hosting)
- `premium-course-list` has no `base` configured and uses `vue-router` history mode (needs Nginx SPA fallback; subdirectory hosting likely needs `base` adjustment)
- Existing docs under `chapter-list-redesign/02-prototypes/vue-apps/` focus on COS+CDN static hosting, not Lighthouse
- `premium-course-list` uses pnpm lock (`pnpm-lock.yaml`); `chapter-list-redesign` uses npm lock (`package-lock.json`)

## Technical Decisions (pending)
- Repo layout: single mono-repo vs two separate repos
- Hosting topology on Lighthouse: two subdomains vs one domain with path prefixes
- Deployment automation: CI (GitHub Actions) vs manual SSH deploy

## Open Questions
- Domain/HTTPS requirements (custom domain vs IP-only) and whether public access needs basic auth
- Preferred git remote provider (GitHub / Gitee / Tencent Cloud Code / self-hosted)
- Lighthouse OS and constraints (Ubuntu/CentOS, existing Nginx, available ports)

## Scope Boundaries
- INCLUDE: server provisioning steps, Nginx config for SPA, SSL, git repo init and ignore rules, deploy workflow
- EXCLUDE (unless requested): adding backend APIs, data persistence, authentication/authorization features
