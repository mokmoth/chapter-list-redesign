<template>
  <div v-if="hasPrev || hasNext" class="chapter-footer">
    <button
      v-if="hasPrev"
      class="nav-btn nav-btn--prev"
      @click="handlePrev"
    >
      <ChevronLeft :size="18" />
      <div class="nav-btn__content">
        <span class="nav-btn__label">上一章</span>
        <span class="nav-btn__title">{{ prevTitle }}</span>
      </div>
    </button>

    <div v-else class="nav-spacer"></div>

    <button
      v-if="hasNext"
      class="nav-btn nav-btn--next"
      @click="handleNext"
    >
      <div class="nav-btn__content">
        <span class="nav-btn__label">下一章</span>
        <span class="nav-btn__title">{{ nextTitle }}</span>
      </div>
      <ChevronRight :size="18" />
    </button>

    <div v-else class="nav-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'

const store = useChapterStore()

const hasPrev = computed(() => !!store.adjacentChapters.prev)
const hasNext = computed(() => !!store.adjacentChapters.next)

const prevTitle = computed(() => store.adjacentChapters.prev?.title ?? '')
const nextTitle = computed(() => store.adjacentChapters.next?.title ?? '')

function handlePrev() {
  const prev = store.adjacentChapters.prev
  if (!prev) return
  navigateToChapter(prev.id)
}

function handleNext() {
  const next = store.adjacentChapters.next
  if (!next) return
  navigateToChapter(next.id)
}

function navigateToChapter(chapterId: string) {
  // Find the first subsection in the target chapter
  const findFirstSubsection = (items: typeof store.chapters): string | null => {
    for (const item of items) {
      if (item.id === chapterId) {
        return findDeepestSubsection(item)
      }
      if (item.children) {
        const found = findFirstSubsection(item.children)
        if (found) return found
      }
    }
    return null
  }

  const findDeepestSubsection = (node: (typeof store.chapters)[0]): string | null => {
    if (node.level === 'subsection') return node.id
    if (node.children) {
      for (const child of node.children) {
        const found = findDeepestSubsection(child)
        if (found) return found
      }
    }
    return null
  }

  const targetId = findFirstSubsection(store.chapters)
  if (targetId) {
    store.selectNode(targetId)
  }
}
</script>

<style lang="scss" scoped>
.chapter-footer {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-xxl $spacing-xl;
  margin-top: $spacing-xxl;
}

.nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg $spacing-xl;
  background: $bg-white;
  border: 1px solid $border-color;
  border-radius: $radius-xl;
  cursor: pointer;
  transition: all $transition-fast;
  text-align: left;
  min-width: 0;

  &:hover {
    border-color: $primary;
    background: $primary-light;
  }

  &:active {
    transform: scale(0.98);
  }

  &--prev {
    justify-content: flex-start;
  }

  &--next {
    justify-content: flex-end;
    text-align: right;
  }

  svg {
    flex-shrink: 0;
    color: $text-tertiary;
  }

  &:hover svg {
    color: $primary;
  }
}

.nav-btn__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.nav-btn__label {
  font-size: $font-size-xxs;
  color: $text-tertiary;
}

.nav-btn__title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-spacer {
  flex: 1;
}
</style>
