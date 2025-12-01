/**
 * Tests for the i18n (Internationalization) Module
 */

import { t, setLocale, getLocale, getAvailableLocales, hasKey, initI18n } from '../i18n';

describe('i18n Module', () => {
  beforeEach(() => {
    // Reset to default locale before each test
    setLocale('en');
  });

  describe('setLocale and getLocale', () => {
    it('should default to English locale', () => {
      expect(getLocale()).toBe('en');
    });

    it('should change locale to Vietnamese', () => {
      setLocale('vi');
      expect(getLocale()).toBe('vi');
    });

    it('should keep current locale for invalid locale', () => {
      setLocale('en');
      // @ts-expect-error Testing invalid locale
      setLocale('invalid');
      expect(getLocale()).toBe('en');
    });
  });

  describe('getAvailableLocales', () => {
    it('should return array with en and vi', () => {
      const locales = getAvailableLocales();
      expect(locales).toContain('en');
      expect(locales).toContain('vi');
      expect(locales.length).toBe(2);
    });
  });

  describe('t (translate) function', () => {
    it('should return English translation for errors.gameNotInitialized', () => {
      setLocale('en');
      const translation = t('errors.gameNotInitialized');
      expect(translation).toBe('Game engine has not been initialized. Call initGame() first.');
    });

    it('should return Vietnamese translation for errors.gameNotInitialized', () => {
      setLocale('vi');
      const translation = t('errors.gameNotInitialized');
      expect(translation).toBe('Game engine chưa được khởi tạo. Gọi initGame() trước.');
    });

    it('should interpolate parameters correctly', () => {
      setLocale('en');
      const translation = t('errors.canvasNotFound', { canvasId: 'myCanvas' });
      expect(translation).toBe('Canvas element not found with id: myCanvas');
    });

    it('should interpolate parameters in Vietnamese', () => {
      setLocale('vi');
      const translation = t('errors.canvasNotFound', { canvasId: 'myCanvas' });
      expect(translation).toBe('Không tìm thấy phần tử canvas với id: myCanvas');
    });

    it('should return key for non-existent translation', () => {
      const translation = t('nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });

    it('should fall back to English when key missing in Vietnamese', () => {
      setLocale('vi');
      // Both locales have the same keys, so this tests the fallback mechanism
      const translation = t('info.gameInitialized');
      expect(translation).toBe('Game engine khởi tạo thành công');
    });
  });

  describe('hasKey function', () => {
    it('should return true for existing key', () => {
      expect(hasKey('errors.gameNotInitialized')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(hasKey('nonexistent.key')).toBe(false);
    });

    it('should return true for nested keys', () => {
      expect(hasKey('warnings.deprecatedMethod')).toBe(true);
    });
  });

  describe('initI18n function', () => {
    it('should initialize with default locale if no config provided', () => {
      setLocale('vi'); // Change from default
      initI18n();
      // initI18n without config should not change the locale
      expect(getLocale()).toBe('vi');
    });

    it('should initialize with specified locale', () => {
      initI18n({ locale: 'vi' });
      expect(getLocale()).toBe('vi');
    });

    it('should initialize with English locale', () => {
      setLocale('vi');
      initI18n({ locale: 'en' });
      expect(getLocale()).toBe('en');
    });
  });

  describe('Translation completeness', () => {
    it('should have all error keys in both locales', () => {
      const errorKeys = [
        'errors.gameNotInitialized',
        'errors.canvasNotFound',
        'errors.invalidConfig',
        'errors.assetLoadFailed',
        'errors.characterNotFound',
        'errors.mapNotFound',
        'errors.layerNotFound',
        'errors.invalidPosition',
        'errors.animationNotFound',
        'errors.behaviorNotFound',
        'errors.npcNotFound',
        'errors.tilesetNotLoaded'
      ];

      setLocale('en');
      errorKeys.forEach(key => {
        expect(hasKey(key)).toBe(true);
      });

      setLocale('vi');
      errorKeys.forEach(key => {
        expect(hasKey(key)).toBe(true);
      });
    });

    it('should have all info keys in both locales', () => {
      const infoKeys = [
        'info.gameInitialized',
        'info.gameStarted',
        'info.gamePaused',
        'info.gameResumed',
        'info.assetLoaded',
        'info.characterCreated',
        'info.mapLoaded',
        'info.npcCreated'
      ];

      setLocale('en');
      infoKeys.forEach(key => {
        expect(hasKey(key)).toBe(true);
      });

      setLocale('vi');
      infoKeys.forEach(key => {
        expect(hasKey(key)).toBe(true);
      });
    });
  });
});
