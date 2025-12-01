/**
 * i18n Module - Internationalization support for PNP Game Engine
 */

export { en } from './en';
export { vi } from './vi';
export {
  i18n,
  t,
  setLocale,
  getLocale,
  getAvailableLocales,
  hasKey,
  initI18n
} from './i18n';
export type { Locale, TranslationDict, I18nConfig } from './i18n';
