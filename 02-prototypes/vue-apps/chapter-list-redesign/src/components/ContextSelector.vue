<template>
  <div class="context-selector-wrapper">
    <button class="context-selector" :class="{ 'is-compact': compact }" @click="openTextbookModal">
      <!-- 紧凑模式：只显示图标/简写 -->
      <template v-if="compact">
        <span class="selector-text">{{ store.currentTextbook.subject }}</span>
      </template>
      
      <!-- 完整模式：显示全部信息 -->
      <template v-else>
        <span class="selector-text">
          {{ store.currentTextbook.subject }} {{ store.currentTextbook.version }}{{ store.currentTextbook.grade }}{{ store.currentTextbook.semester }}
        </span>
      </template>
      
      <ChevronDown :size="16" />
    </button>
    
    <!-- 教材切换弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isTextbookModalOpen" class="textbook-modal-overlay" @click.self="closeTextbookModal">
          <div class="textbook-modal">
            <!-- 弹窗头部 -->
            <div class="modal-header">
              <span class="modal-title">教材切换</span>
              <button class="close-btn" @click="closeTextbookModal">
                <X :size="20" />
              </button>
            </div>
            
            <!-- 三列选择器 -->
            <div class="selector-columns">
              <!-- 学科列 -->
              <div class="selector-column">
                <div class="column-title">学科</div>
                <div class="column-list">
                  <button 
                    v-for="subject in availableSubjects" 
                    :key="subject"
                    class="column-item"
                    :class="{ 'is-selected': tempSelection.subject === subject }"
                    @click="selectSubject(subject)"
                  >
                    {{ subject }}
                  </button>
                </div>
              </div>
              
              <!-- 版本列 -->
              <div class="selector-column">
                <div class="column-title">版本</div>
                <div class="column-list">
                  <button 
                    v-for="version in availableVersions" 
                    :key="version.id"
                    class="column-item version-item"
                    :class="{ 'is-selected': tempSelection.version === version.id }"
                    @click="selectVersion(version.id)"
                  >
                    <span class="version-name">{{ version.name }}</span>
                    <span v-if="version.desc" class="version-desc">{{ version.desc }}</span>
                  </button>
                </div>
              </div>
              
              <!-- 年级册别列 -->
              <div class="selector-column">
                <div class="column-title">年级册别</div>
                <div class="column-list">
                  <button 
                    v-for="grade in availableGrades" 
                    :key="grade.id"
                    class="column-item grade-item"
                    :class="{ 'is-selected': tempSelection.grade === grade.id }"
                    @click="selectGrade(grade.id)"
                  >
                    <span class="grade-name">{{ grade.name }}</span>
                    <span v-if="grade.tag" class="grade-tag">{{ grade.tag }}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 确认按钮 -->
            <div class="modal-footer">
              <button class="confirm-btn" @click="confirmSelection">
                <Check :size="18" />
                <span>确认</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ChevronDown, Check, X } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { SubjectType } from '@/types'

defineProps<{
  compact?: boolean
}>()

const store = useChapterStore()

// 教材选择弹窗状态
const isTextbookModalOpen = ref(false)

// 临时选择状态
const tempSelection = reactive({
  subject: '' as SubjectType | '',
  version: '',
  grade: ''
})

// 可选学科列表
const availableSubjects: SubjectType[] = ['数学', '英语', '语文', '物理', '化学', '生物', '历史', '地理', '政治']

// 版本数据（根据学科）
const versionsBySubject: Record<string, { id: string; name: string; desc?: string }[]> = {
  '数学': [
    { id: 'rj', name: '部编版（人教版）', desc: '教育部义务教育统编教材' },
    { id: 'bsd', name: '北师大版' },
    { id: 'sj', name: '苏教版' }
  ],
  '英语': [
    { id: 'rj', name: '人教版', desc: '教育部义务教育统编教材' },
    { id: 'wy', name: '外研版' },
    { id: 'yljy', name: '译林版' }
  ],
  '语文': [
    { id: 'rj', name: '部编版（人教版）', desc: '教育部义务教育统编教材' }
  ],
  '物理': [
    { id: 'rj', name: '人教版', desc: '教育部义务教育统编教材' },
    { id: 'hjy', name: '沪教版' }
  ],
  '化学': [
    { id: 'rj', name: '人教版', desc: '教育部义务教育统编教材' }
  ],
  '生物': [
    { id: 'rj', name: '人教版', desc: '教育部义务教育统编教材' }
  ],
  '历史': [
    { id: 'rj', name: '部编版（人教版）', desc: '教育部义务教育统编教材' }
  ],
  '地理': [
    { id: 'rj', name: '人教版', desc: '教育部义务教育统编教材' },
    { id: 'xj', name: '湘教版' }
  ],
  '政治': [
    { id: 'rj', name: '部编版（人教版）', desc: '教育部义务教育统编教材' }
  ]
}

// 年级册别数据
const gradeOptions = [
  { id: '7a', name: '七年级上册', tag: '2024新课标新版' },
  { id: '7b', name: '七年级下册', tag: '2024新课标新版' },
  { id: '8a', name: '八年级上册', tag: '2024新课标新版' },
  { id: '8b', name: '八年级下册', tag: '2024新课标新版' },
  { id: '9a', name: '九年级上册', tag: '2024新课标新版' },
  { id: '9b', name: '九年级下册', tag: '2024新课标新版' }
]

// 当前可选版本
const availableVersions = computed(() => {
  if (!tempSelection.subject) return []
  return versionsBySubject[tempSelection.subject] || []
})

// 当前可选年级册别
const availableGrades = computed(() => {
  if (!tempSelection.version) return []
  return gradeOptions
})

// 打开教材选择弹窗
function openTextbookModal() {
  // 初始化临时选择为当前值
  tempSelection.subject = store.currentTextbook.subject
  tempSelection.version = 'rj' // 默认人教版
  tempSelection.grade = '7b' // 默认七年级下册
  isTextbookModalOpen.value = true
}

function closeTextbookModal() {
  isTextbookModalOpen.value = false
}

function selectSubject(subject: SubjectType) {
  tempSelection.subject = subject
  // 重置版本和年级选择
  const versions = versionsBySubject[subject]
  if (versions && versions.length > 0) {
    tempSelection.version = versions[0].id
  }
}

function selectVersion(versionId: string) {
  tempSelection.version = versionId
}

function selectGrade(gradeId: string) {
  tempSelection.grade = gradeId
}

async function confirmSelection() {
  // 根据选择找到对应的教材配置
  const textbook = store.availableTextbooks.find(t => t.subject === tempSelection.subject)
  if (textbook) {
    await store.switchTextbook(textbook.id)
  }
  closeTextbookModal()
}
</script>

<style lang="scss" scoped>
.context-selector-wrapper {
  position: relative;
}

.context-selector {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-xl;
  background: $bg-secondary;
  border-radius: $radius-pill;
  font-size: $font-size-sm;
  color: $text-primary;
  cursor: pointer;
  transition: background $transition-fast;
  white-space: nowrap;
  
  &:hover {
    background: darken($bg-secondary, 3%);
  }
  
  &:active {
    background: darken($bg-secondary, 5%);
  }
  
  // 紧凑模式样式
  &.is-compact {
    padding: $spacing-xs $spacing-sm;
    background: transparent;
    
    .selector-text {
      font-weight: $font-weight-semibold;
      font-size: $font-size-md;
    }
    
    &:hover {
      background: $bg-secondary;
    }
  }
  
  .selector-text {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @include small-mobile {
      max-width: 100px;
      font-size: $font-size-xs;
    }
  }
}

// ============ 教材切换弹窗 ============
.textbook-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  
  @include desktop {
    align-items: center;
  }
}

.textbook-modal {
  width: 100%;
  max-width: 720px;
  max-height: 80vh;
  background: $bg-white;
  border-radius: $radius-xl $radius-xl 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @include desktop {
    border-radius: $radius-xl;
    max-height: 70vh;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xxl;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
  
  .modal-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-secondary;
    border-radius: $radius-circle;
    color: $text-secondary;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      background: darken($bg-secondary, 5%);
    }
  }
}

.selector-columns {
  display: flex;
  flex: 1;
  overflow: hidden;
  
  @include small-mobile {
    flex-direction: column;
  }
}

.selector-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $border-color;
  
  &:last-child {
    border-right: none;
  }
  
  @include small-mobile {
    border-right: none;
    border-bottom: 1px solid $border-color;
    max-height: 150px;
    
    &:last-child {
      border-bottom: none;
      max-height: none;
      flex: 2;
    }
  }
}

.column-title {
  padding: $spacing-lg $spacing-xxl;
  font-size: $font-size-xs;
  color: $text-tertiary;
  background: $bg-secondary;
  flex-shrink: 0;
}

.column-list {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm 0;
}

.column-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: $spacing-lg $spacing-xxl;
  font-size: $font-size-sm;
  color: $text-primary;
  cursor: pointer;
  transition: all $transition-fast;
  text-align: left;
  
  &:hover {
    background: $bg-secondary;
  }
  
  &.is-selected {
    background: $warning-light;
    color: #7A5000;
    font-weight: $font-weight-medium;
  }
}

.version-item {
  .version-name {
    font-weight: $font-weight-medium;
  }
  
  .version-desc {
    font-size: $font-size-xxs;
    color: $text-tertiary;
    margin-top: 2px;
  }
  
  &.is-selected .version-desc {
    color: #9A6800;
  }
}

.grade-item {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  .grade-tag {
    font-size: $font-size-xxs;
    color: $secondary;
  }
  
  &.is-selected .grade-tag {
    color: #7A5000;
  }
}

.modal-footer {
  padding: $spacing-xxl;
  border-top: 1px solid $border-color;
  flex-shrink: 0;
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-lg;
  background: $warning;
  color: #7A5000;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  border-radius: $radius-pill;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background: darken($warning, 5%);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

// 弹窗动画
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
  
  .textbook-modal {
    transition: all 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .textbook-modal {
    transform: translateY(100%);
    
    @include desktop {
      transform: scale(0.9);
    }
  }
}
</style>
