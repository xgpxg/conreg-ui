// 全局混入，使所有组件都可以使用 $t 等方法
import { createI18n } from 'vue-i18n'

export default {
  methods: {
    /**
     * 国际化方法
     * @param key 对应的语言包字段
     * @param params 参数
     */
    $t(key, params = {}) {
      const i18n = this.$i18n
      if (!i18n) {
        console.warn('i18n is not installed')
        return key
      }
      
      return i18n.t(key, params)
    }
  }
}