import {createI18n} from 'vue-i18n'

// 导入语言文件
import zhCn from './zh-cn.js'
import en from './en.js'

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') || 'zh-cn', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {
    'zh-cn': zhCn,
    'en': en
  },
  silentTranslationWarn: true, // 禁止警告信息
  silentFallbackWarn: true // 禁止回退警告信息
})

export default i18n