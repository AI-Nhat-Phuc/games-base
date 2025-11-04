/**
 * Tests for GameManager
 */

import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { GameManager, initGame, getGame } from '../GameManager';

describe('GameManager', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create a canvas element for testing
    canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
    
    // Reset singleton before each test
    GameManager.reset();
  });

  afterEach(() => {
    // Clean up
    GameManager.reset();
    if (document.body.contains(canvas)) {
      document.body.removeChild(canvas);
    }
  });

  describe('getInstance', () => {
    test('should return singleton instance', () => {
      const instance1 = GameManager.getInstance();
      const instance2 = GameManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('initialize', () => {
    test('should initialize game manager', () => {
      const manager = GameManager.getInstance();
      
      expect(() => {
        manager.initialize({
          canvasId: 'test-canvas',
          width: 800,
          height: 600,
          autoStart: false
        });
      }).not.toThrow();
    });

    test('should warn on re-initialization', () => {
      const manager = GameManager.getInstance();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'GameManager already initialized. Skipping re-initialization.'
      );

      consoleSpy.mockRestore();
    });

    test('should auto-start by default', () => {
      const manager = GameManager.getInstance();
      
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      // If autoStart works, engine should be running
      expect(() => manager.stop()).not.toThrow();
    });

    test('should not auto-start when autoStart is false', () => {
      const manager = GameManager.getInstance();
      
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      // Engine should not be running
      expect(() => manager.stop()).not.toThrow();
    });
  });

  describe('start', () => {
    test('should start the game', () => {
      const manager = GameManager.getInstance();
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(() => manager.start()).not.toThrow();
      manager.stop();
    });

    test('should throw error if not initialized', () => {
      const manager = GameManager.getInstance();

      expect(() => manager.start()).toThrow('GameManager not initialized. Call initialize() first.');
    });
  });

  describe('stop', () => {
    test('should stop the game', () => {
      const manager = GameManager.getInstance();
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(() => manager.stop()).not.toThrow();
    });

    test('should not throw if engine not initialized', () => {
      const manager = GameManager.getInstance();

      expect(() => manager.stop()).not.toThrow();
    });
  });

  describe('getEngine', () => {
    test('should return engine after initialization', () => {
      const manager = GameManager.getInstance();
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const engine = manager.getEngine();
      expect(engine).toBeDefined();
    });

    test('should throw error if not initialized', () => {
      const manager = GameManager.getInstance();

      expect(() => manager.getEngine()).toThrow('GameManager not initialized. Call initialize() first.');
    });
  });

  describe('getMapBuilder', () => {
    test('should return map builder', () => {
      const manager = GameManager.getInstance();
      const mapBuilder = manager.getMapBuilder();

      expect(mapBuilder).toBeDefined();
    });
  });

  describe('getCharacterBuilder', () => {
    test('should return character builder', () => {
      const manager = GameManager.getInstance();
      const characterBuilder = manager.getCharacterBuilder();

      expect(characterBuilder).toBeDefined();
    });
  });

  describe('getEffectBuilder', () => {
    test('should return effect builder', () => {
      const manager = GameManager.getInstance();
      const effectBuilder = manager.getEffectBuilder();

      expect(effectBuilder).toBeDefined();
    });
  });

  describe('getInputManager', () => {
    test('should return input manager after initialization', () => {
      const manager = GameManager.getInstance();
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const inputManager = manager.getInputManager();
      expect(inputManager).toBeDefined();
    });

    test('should throw error if not initialized', () => {
      const manager = GameManager.getInstance();

      expect(() => manager.getInputManager()).toThrow('GameManager not initialized. Call initialize() first.');
    });
  });

  describe('getAssetLoader', () => {
    test('should return asset loader', () => {
      const manager = GameManager.getInstance();
      const assetLoader = manager.getAssetLoader();

      expect(assetLoader).toBeDefined();
    });
  });

  describe('render', () => {
    test('should call render without errors', () => {
      const manager = GameManager.getInstance();
      const ctx = document.createElement('canvas').getContext('2d')!;

      expect(() => manager.render(ctx)).not.toThrow();
    });
  });

  describe('update', () => {
    test('should call update without errors', () => {
      const manager = GameManager.getInstance();

      expect(() => manager.update(0.016)).not.toThrow();
    });
  });

  describe('destroy', () => {
    test('should clean up resources', () => {
      const manager = GameManager.getInstance();
      manager.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(() => manager.destroy()).not.toThrow();
    });
  });

  describe('reset', () => {
    test('should reset singleton instance', () => {
      const instance1 = GameManager.getInstance();
      instance1.initialize({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      GameManager.reset();

      const instance2 = GameManager.getInstance();
      expect(instance2).not.toBe(instance1);
    });
  });

  describe('initGame helper', () => {
    test('should initialize and return game manager', () => {
      const manager = initGame({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(manager).toBeDefined();
      expect(manager).toBeInstanceOf(GameManager);
    });
  });

  describe('getGame helper', () => {
    test('should return game manager instance', () => {
      const manager = getGame();

      expect(manager).toBeDefined();
      expect(manager).toBeInstanceOf(GameManager);
    });

    test('should return same instance as getInstance', () => {
      const manager1 = getGame();
      const manager2 = GameManager.getInstance();

      expect(manager1).toBe(manager2);
    });
  });
});
