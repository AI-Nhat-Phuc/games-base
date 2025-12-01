/**
 * i18n (Internationalization) Helper Module
 * 
 * Provides dynamic locale loading and DOM text replacement
 * using data-i18n attributes.
 */

const I18n = {
  currentLocale: 'en',
  translations: {},
  fallbackLocale: 'en',

  /**
   * Initialize i18n with a given locale
   * @param {string} locale - The locale code (e.g., 'en', 'vi')
   */
  async init(locale = 'en') {
    this.currentLocale = locale;
    await this.loadTranslations(locale);
    
    // Also load fallback translations
    if (locale !== this.fallbackLocale) {
      await this.loadTranslations(this.fallbackLocale, true);
    }
    
    this.updateDOM();
    this.saveLocalePreference(locale);
  },

  /**
   * Load translations for a given locale
   * @param {string} locale - The locale code
   * @param {boolean} isFallback - Whether this is the fallback locale
   */
  async loadTranslations(locale, isFallback = false) {
    try {
      const response = await fetch(`./i18n/${locale}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${locale} translations`);
      }
      const translations = await response.json();
      
      if (isFallback) {
        this.translations.fallback = translations;
      } else {
        this.translations.current = translations;
      }
    } catch (error) {
      console.warn(`Could not load translations for locale: ${locale}`, error);
      if (!isFallback && locale !== this.fallbackLocale) {
        // Fall back to default locale
        await this.loadTranslations(this.fallbackLocale);
      }
    }
  },

  /**
   * Get a translation by key path (e.g., 'header.title')
   * @param {string} key - Dot-notation key path
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} The translated string or the key if not found
   */
  t(key, params = {}) {
    let value = this.getNestedValue(this.translations.current, key);
    
    // Fall back to fallback locale if key not found
    if (value === undefined && this.translations.fallback) {
      value = this.getNestedValue(this.translations.fallback, key);
    }
    
    // Return key if still not found
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // Interpolate parameters
    return this.interpolate(value, params);
  },

  /**
   * Get a nested value from an object using dot notation
   * @param {Object} obj - The object to search
   * @param {string} path - Dot-notation path
   * @returns {*} The value or undefined
   */
  getNestedValue(obj, path) {
    if (!obj) return undefined;
    
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  },

  /**
   * Interpolate parameters into a string
   * @param {string} str - The string with placeholders
   * @param {Object} params - The parameters to interpolate
   * @returns {string} The interpolated string
   */
  interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  },

  /**
   * Update all DOM elements with data-i18n attributes
   */
  updateDOM() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Check if it's an input placeholder
      if (element.hasAttribute('data-i18n-placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    // Update lang attribute on html element
    document.documentElement.lang = this.currentLocale;

    // Dispatch event for any custom handlers
    document.dispatchEvent(new CustomEvent('i18n:updated', {
      detail: { locale: this.currentLocale }
    }));
  },

  /**
   * Switch to a different locale
   * @param {string} locale - The new locale code
   */
  async switchLocale(locale) {
    if (locale === this.currentLocale) return;
    await this.init(locale);
  },

  /**
   * Get the current locale
   * @returns {string} The current locale code
   */
  getLocale() {
    return this.currentLocale;
  },

  /**
   * Save locale preference to localStorage
   * @param {string} locale - The locale to save
   */
  saveLocalePreference(locale) {
    try {
      localStorage.setItem('pnp-builder-locale', locale);
    } catch (e) {
      // localStorage not available
    }
  },

  /**
   * Load saved locale preference from localStorage
   * @returns {string} The saved locale or default 'en'
   */
  loadLocalePreference() {
    try {
      return localStorage.getItem('pnp-builder-locale') || 'en';
    } catch (e) {
      return 'en';
    }
  },

  /**
   * Get list of available locales
   * @returns {string[]} Array of available locale codes
   */
  getAvailableLocales() {
    return ['en', 'vi'];
  }
};

// Make I18n available globally
window.I18n = I18n;

// Shorthand function for translations (namespaced to avoid conflicts)
window.i18nT = (key, params) => I18n.t(key, params);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
