import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages: {
    en,
    pt
  }
}) 