<template>
  <div class="locale-switcher">
    <el-select v-model="currentLocale" @change="changeLocaleHandler" class="locale-select">
      <el-option value="zh-cn" label="中文"></el-option>
      <el-option value="en" label="English"></el-option>
    </el-select>
  </div>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useLocale} from '@/locales/useLocale.js'

export default defineComponent({
  name: 'LocaleSwitcher',
  setup() {
    const {locale, changeLocale} = useLocale()

    const currentLocale = ref(locale.value)

    const changeLocaleHandler = (event) => {
      const lang = event.target ? event.target.value : event
      currentLocale.value = lang
      changeLocale(lang)
    }

    // 监听语言变化
    watch(() => locale.value, (newVal) => {
      currentLocale.value = newVal
    })

    return {
      currentLocale,
      changeLocaleHandler
    }
  }
})
</script>

<style scoped lang="scss">
.locale-switcher {
  margin: 10px;
  display: flex;
  align-items: center;
  min-width: 60px;
  width: 100%;
}

.locale-select {
  :deep(.el-select__wrapper) {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

}

</style>