/**
 * Internationalization (i18n) Module for PNP Game Engine
 * 
 * Provides a lightweight translation system for internal messages,
 * error strings, and developer logs.
 */

import { en } from './en';
import { vi } from './vi';

/** Available locale codes */
export type Locale = 'en' | 'vi';

/** Translation dictionary type based on English translation structure */
export type TranslationDict = typeof en;

/** Available locales and their translations */
const translations: Record<Locale, TranslationDict> = {
  en,
  vi
};

/** Current locale setting */
let currentLocale: Locale = 'en';

/** Fallback locale when a key is not found in current locale */
const fallbackLocale: Locale = 'en';

/**
 * Set the current locale for translations
 * @param locale - The locale code to set ('en' or 'vi')
 */
export function setLocale(locale: Locale): void {
  if (translations[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' is not available. Keeping current locale: ${currentLocale}`);
  }
}

/**
 * Get the current locale
 * @returns The current locale code
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Get the list of available locales
 * @returns Array of available locale codes
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to search
 * @param path - Dot-notation path (e.g., 'errors.gameNotInitialized')
 * @returns The value or undefined if not found
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate parameters into a translation string
 * @param str - The string with placeholders like {param}
 * @param params - Object containing parameter values
 * @returns The interpolated string
 */
function interpolate(str: string, params: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

/**
 * Get a translated string by key
 * @param key - Dot-notation key path (e.g., 'errors.gameNotInitialized')
 * @param params - Optional parameters for interpolation
 * @returns The translated string, or the key if not found
 */
export function t(key: string, params: Record<string, string | number> = {}): string {
  // Try current locale first
  let value = getNestedValue(translations[currentLocale] as unknown as Record<string, unknown>, key);
  
  // Fall back to fallback locale if not found
  if (value === undefined && currentLocale !== fallbackLocale) {
    value = getNestedValue(translations[fallbackLocale] as unknown as Record<string, unknown>, key);
  }
  
  // Return key if still not found
  if (value === undefined) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  // Interpolate parameters
  return interpolate(value, params);
}

/**
 * Check if a translation key exists
 * @param key - Dot-notation key path
 * @returns true if the key exists in current or fallback locale
 */
export function hasKey(key: string): boolean {
  const inCurrent = getNestedValue(translations[currentLocale] as unknown as Record<string, unknown>, key) !== undefined;
  const inFallback = getNestedValue(translations[fallbackLocale] as unknown as Record<string, unknown>, key) !== undefined;
  return inCurrent || inFallback;
}

/**
 * I18n module configuration interface
 */
export interface I18nConfig {
  locale?: Locale;
}

/**
 * Initialize the i18n module with optional configuration
 * @param config - Optional configuration object
 */
export function initI18n(config: I18nConfig = {}): void {
  if (config.locale) {
    setLocale(config.locale);
  }
}

// Export the default i18n object for convenient access
export const i18n = {
  t,
  setLocale,
  getLocale,
  getAvailableLocales,
  hasKey,
  init: initI18n
};

export default i18n;
