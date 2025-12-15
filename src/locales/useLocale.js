import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale, t } = useI18n()
  
  const currentLocale = computed(() => {
    return locale.value
  })

  const changeLocale = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  return {
    locale: currentLocale,
    t,
    changeLocale
  }
}