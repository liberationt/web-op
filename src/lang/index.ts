import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { getLanguage } from '@/utils/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import elementEsLocale from 'element-ui/lib/locale/lang/es'
import elementJaLocale from 'element-ui/lib/locale/lang/ja'
// import elementKoLocale from 'element-ui/lib/locale/lang/ko'
import elementMnLocale from 'element-ui/lib/locale/lang/mn'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'
// import koLocale from './ko'
import mnLocale from './mn'

Vue.use(VueI18n)

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale
  },
  es_ES: {
    ...esLocale,
    ...elementEsLocale
  },
  ja_JP: {
    ...jaLocale,
    ...elementJaLocale
  },
  // ko_KR: {
  //   ...koLocale,
  //   ...elementKoLocale
  // },
  mn_MN: {
    ...mnLocale,
    ...elementMnLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage) {
    return cookieLanguage
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  // Default language is english
  return 'zh_CN'
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages
})

export default i18n
