<template>
  <header class="global-header">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="handleBack" aria-label="返回">
      <ChevronLeft :size="24" />
    </button>
    
    <!-- 教材选择器（紧贴返回按钮右侧） -->
    <ContextSelector />
    
    <!-- 占位，撑开右侧 -->
    <div class="spacer"></div>
    
    <!-- VIP 升级入口 -->
    <button 
      class="upgrade-entry"
      :class="{ 'is-vip': store.isVip }"
      @click="handleUpgradeClick"
    >
      <Crown :size="14" />
      <span class="upgrade-text">{{ store.isVip ? '已升级' : '去升级' }}</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { Crown, ChevronLeft } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import ContextSelector from './ContextSelector.vue'

const store = useChapterStore()

function handleBack() {
  alert('返回上一页（原型占位）')
}

function handleUpgradeClick() {
  if (store.isVip) {
    alert('您已是 VIP 用户')
  } else {
    if (confirm('开通 VIP 可解锁全部课程，是否立即开通？')) {
      store.unlockVip()
    }
  }
}
</script>

<style lang="scss" scoped>
.global-header {
  display: flex;
  align-items: center;
  height: $header-height;
  padding: 0 $spacing-xl;
  background: $bg-white;
  gap: $spacing-sm;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: $text-primary;
  border-radius: $radius-md;
  flex-shrink: 0;
  
  &:active {
    background: $bg-secondary;
  }
}

.spacer {
  flex: 1;
}

.upgrade-entry {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-lg;
  background: $gold-gradient;
  color: $bg-white;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  flex-shrink: 0;
  transition: opacity $transition-fast;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
  
  &.is-vip {
    background: linear-gradient(135deg, #A0A0A0 0%, #808080 100%);
  }
  
  .upgrade-text {
    @include micro-mobile {
      display: none;
    }
  }
}
</style>
