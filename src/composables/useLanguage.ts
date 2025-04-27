import { useI18n } from 'vue-i18n'

export function useLanguage() {
    const { locale } = useI18n()

    const navigatorLang = navigator.language || navigator.languages[0] || 'en'
    const savedLang = localStorage.getItem('lang')

    locale.value = savedLang || navigatorLang.split('-')[0]
    localStorage.setItem('lang', locale.value)

    function changeLanguage(lang: string) {
        locale.value = lang
        localStorage.setItem('lang', lang)
    }

    return { locale, changeLanguage }
}
