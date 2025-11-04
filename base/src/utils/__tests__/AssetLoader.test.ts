/**
 * Tests for AssetLoader
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { AssetLoader } from '../AssetLoader';

describe('AssetLoader', () => {
  let loader: AssetLoader;

  beforeEach(() => {
    loader = new AssetLoader();
  });

  describe('loadImage', () => {
    test('should load image successfully', async () => {
      // Mock Image constructor
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: ''
      };

      global.Image = jest.fn(() => mockImage) as any;

      const promise = loader.loadImage('test', 'test.png');
      
      // Trigger onload
      if (mockImage.onload) {
        mockImage.onload();
      }
      
      await expect(promise).resolves.toBeUndefined();
      
      const image = loader.getImage('test');
      expect(image).toBeDefined();
    });

    test('should reject on image load error', async () => {
      // Mock Image constructor with error
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: ''
      };

      global.Image = jest.fn(() => mockImage) as any;

      const promise = loader.loadImage('fail', 'nonexistent.png');
      
      // Trigger onerror
      if (mockImage.onerror) {
        mockImage.onerror();
      }
      
      await expect(promise).rejects.toThrow('Failed to load image: nonexistent.png');
    });
  });

  describe('loadSound', () => {
    test('should load sound successfully', async () => {
      // Mock Audio constructor
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: ''
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      
      // Trigger oncanplaythrough
      if (mockAudio.oncanplaythrough) {
        mockAudio.oncanplaythrough();
      }
      
      await expect(promise).resolves.toBeUndefined();
      
      const sound = loader.getSound('test');
      expect(sound).toBeDefined();
    });

    test('should reject on sound load error', async () => {
      // Mock Audio constructor with error
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: ''
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('fail', 'nonexistent.mp3');
      
      // Trigger onerror
      if (mockAudio.onerror) {
        mockAudio.onerror();
      }
      
      await expect(promise).rejects.toThrow('Failed to load sound: nonexistent.mp3');
    });
  });

  describe('waitForAll', () => {
    test('should wait for all assets to load', async () => {
      // Mock successful loading
      const mockImage1 = { onload: null as any, onerror: null as any, src: '' };
      const mockImage2 = { onload: null as any, onerror: null as any, src: '' };
      let imageCount = 0;

      global.Image = jest.fn(() => {
        imageCount++;
        return imageCount === 1 ? mockImage1 : mockImage2;
      }) as any;

      loader.loadImage('img1', 'test1.png');
      loader.loadImage('img2', 'test2.png');

      // Trigger onload for both
      if (mockImage1.onload) mockImage1.onload();
      if (mockImage2.onload) mockImage2.onload();

      await expect(loader.waitForAll()).resolves.toBeUndefined();
    });

    test('should handle mixed success and failure', async () => {
      const mockImage1 = { onload: null as any, onerror: null as any, src: '' };
      const mockImage2 = { onload: null as any, onerror: null as any, src: '' };
      let imageCount = 0;

      global.Image = jest.fn(() => {
        imageCount++;
        return imageCount === 1 ? mockImage1 : mockImage2;
      }) as any;

      loader.loadImage('img1', 'test1.png');
      loader.loadImage('img2', 'fail.png');

      // Trigger onload for first, onerror for second
      if (mockImage1.onload) mockImage1.onload();
      if (mockImage2.onerror) mockImage2.onerror();

      await expect(loader.waitForAll()).rejects.toThrow();
    });
  });

  describe('getImage', () => {
    test('should return loaded image', async () => {
      const mockImage = { onload: null as any, onerror: null as any, src: '' };
      global.Image = jest.fn(() => mockImage) as any;

      const promise = loader.loadImage('test', 'test.png');
      if (mockImage.onload) mockImage.onload();
      await promise;

      const image = loader.getImage('test');
      expect(image).toBeDefined();
    });

    test('should return undefined for non-existent image', () => {
      const image = loader.getImage('nonexistent');
      expect(image).toBeUndefined();
    });
  });

  describe('getSound', () => {
    test('should return loaded sound', async () => {
      const mockAudio = { oncanplaythrough: null as any, onerror: null as any, src: '' };
      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      if (mockAudio.oncanplaythrough) mockAudio.oncanplaythrough();
      await promise;

      const sound = loader.getSound('test');
      expect(sound).toBeDefined();
    });

    test('should return undefined for non-existent sound', () => {
      const sound = loader.getSound('nonexistent');
      expect(sound).toBeUndefined();
    });
  });

  describe('playSound', () => {
    test('should play sound', async () => {
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: '',
        play: mockPlay,
        loop: false,
        currentTime: 0
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      if (mockAudio.oncanplaythrough) mockAudio.oncanplaythrough();
      await promise;

      loader.playSound('test');

      expect(mockPlay).toHaveBeenCalled();
    });

    test('should play sound with loop', async () => {
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: '',
        play: mockPlay,
        loop: false,
        currentTime: 0
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      if (mockAudio.oncanplaythrough) mockAudio.oncanplaythrough();
      await promise;

      loader.playSound('test', true);

      expect(mockAudio.loop).toBe(true);
      expect(mockPlay).toHaveBeenCalled();
    });

    test('should handle play error gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const mockPlay = jest.fn().mockRejectedValue(new Error('Play failed'));
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: '',
        play: mockPlay,
        loop: false,
        currentTime: 0
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      if (mockAudio.oncanplaythrough) mockAudio.oncanplaythrough();
      await promise;

      loader.playSound('test');

      // Wait for promise to reject
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    test('should do nothing for non-existent sound', () => {
      expect(() => loader.playSound('nonexistent')).not.toThrow();
    });
  });

  describe('stopSound', () => {
    test('should stop sound', async () => {
      const mockPause = jest.fn();
      const mockAudio = {
        oncanplaythrough: null as any,
        onerror: null as any,
        src: '',
        pause: mockPause,
        currentTime: 5
      };

      global.Audio = jest.fn(() => mockAudio) as any;

      const promise = loader.loadSound('test', 'test.mp3');
      if (mockAudio.oncanplaythrough) mockAudio.oncanplaythrough();
      await promise;

      loader.stopSound('test');

      expect(mockPause).toHaveBeenCalled();
      expect(mockAudio.currentTime).toBe(0);
    });

    test('should do nothing for non-existent sound', () => {
      expect(() => loader.stopSound('nonexistent')).not.toThrow();
    });
  });
});
