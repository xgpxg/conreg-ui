<template>
  <div class="side-by-side-comparison">
    <div class="content">
      <div class="panel old-panel">
        <div class="flex-center mb10">
          <div class="title">{{ props.oldTitle || t('原始配置') }}</div>
        </div>
        <div class="code">
          <code
              v-for="(line, index) in diffLines.oldLines"
              :key="index"
              :class="['line', `line-${line.type}`]"
          >
            <span class="line-number">{{ line.number }}</span>
            <span class="line-content">{{ line.content }}</span>
          </code>
        </div>

      </div>
      <div class="panel new-panel">
        <div class="flex-center mb10">
          <div class="title">{{ props.newTitle || t('新配置') }}</div>
        </div>
        <div class="code">
          <code
              v-for="(line, index) in diffLines.newLines"
              :key="index"
              :class="['line', `line-${line.type}`]"
          >
            <span class="line-number">{{ line.number }}</span>
            <span class="line-content">{{ line.content }}</span>
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {diffLines as diffAlgorithm, Change} from 'diff'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  oldContent: string
  newContent: string
  oldTitle?: string
  newTitle?: string
}>()

interface DiffLine {
  content: string
  type: 'equal' | 'added' | 'removed'
  number: number
}

const diffLines = computed(() => {
  // 使用 diff 库计算差异
  const diffs: Change[] = diffAlgorithm(props.oldContent || '', props.newContent || '')

  const oldResult: DiffLine[] = []
  const newResult: DiffLine[] = []

  let oldLineNumber = 1
  let newLineNumber = 1

  diffs.forEach(part => {
    // 分割行，但保留空字符串表示空行
    const lines = part.value.split('\n')
    // 如果最后一个元素是空字符串，则表示以换行符结尾，需要去掉
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop()
    }

    if (part.added) {
      // 新增的内容只出现在右侧(newLines)
      lines.forEach(line => {
        newResult.push({
          content: line,
          type: 'added',
          number: newLineNumber++
        })
      })
      // 左侧用空行占位
      lines.forEach(() => {
        oldResult.push({
          content: '',
          type: 'removed',
          number: oldLineNumber++
        })
      })
    } else if (part.removed) {
      // 删除的内容只出现在左侧(oldLines)
      lines.forEach(line => {
        oldResult.push({
          content: line,
          type: 'removed',
          number: oldLineNumber++
        })
      })
      // 右侧用空行占位
      lines.forEach(() => {
        newResult.push({
          content: '',
          type: 'added',
          number: newLineNumber++
        })
      })
    } else {
      // 相同的内容在两侧都显示
      lines.forEach(line => {
        oldResult.push({
          content: line,
          type: 'equal',
          number: oldLineNumber++
        })
        newResult.push({
          content: line,
          type: 'equal',
          number: newLineNumber++
        })
      })
    }
  })

  return {
    oldLines: oldResult,
    newLines: newResult
  }
})
</script>

<style scoped lang="scss">
.side-by-side-comparison {
  //border: 1px solid #ddd;
  //border-radius: 4px;
  overflow: hidden;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  flex: 1;
}

.content {
  display: flex;
  flex: 1;

}

.code {
  border: 1px solid #ddd;
  overflow: auto;
  max-height: 55vh;
}

.panel {
  flex: 1;
  line-height: 1.6;

  &.old-panel {
    margin-right: 20px;
  }
}

.line {
  display: flex;
  font-size: 14px;

  &.line-equal {
    background-color: #ffffff;
  }

  &.line-added {
    background-color: #d4edda;
  }

  &.line-removed {
    background-color: #f8d7da;
  }
}

.line-number {
  width: 30px;
  text-align: right;
  padding: 0 5px;
  color: #666;
  border-right: 1px solid #ddd;
  margin-right: 5px;
  background-color: #f5f5f5;
}

.line-content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>