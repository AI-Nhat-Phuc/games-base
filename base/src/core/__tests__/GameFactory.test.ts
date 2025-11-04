/**
 * Tests for GameFactory
 */

import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { GameFactory, createGame, quickStart } from '../GameFactory';
import { GameManager } from '../GameManager';

describe('GameFactory', () => {
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

  describe('constructor', () => {
    test('should create factory with config', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(factory).toBeDefined();
    });
  });

  describe('onInit', () => {
    test('should set initialization callback', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const initCallback = jest.fn();
      const result = factory.onInit(initCallback);

      expect(result).toBe(factory);
    });

    test('should support chaining', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const result = factory.onInit(() => {});
      expect(result).toBeInstanceOf(GameFactory);
    });
  });

  describe('onUpdate', () => {
    test('should set update callback', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const updateCallback = jest.fn();
      const result = factory.onUpdate(updateCallback);

      expect(result).toBe(factory);
    });

    test('should support chaining', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const result = factory.onUpdate(() => {});
      expect(result).toBeInstanceOf(GameFactory);
    });
  });

  describe('onRender', () => {
    test('should set render callback', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const renderCallback = jest.fn();
      const result = factory.onRender(renderCallback);

      expect(result).toBe(factory);
    });

    test('should support chaining', () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const result = factory.onRender(() => {});
      expect(result).toBeInstanceOf(GameFactory);
    });
  });

  describe('create', () => {
    test('should create and return game manager', async () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const game = await factory.create();

      expect(game).toBeDefined();
      expect(game).toBeInstanceOf(GameManager);
    });

    test('should call init callback', async () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const initCallback = jest.fn();
      factory.onInit(initCallback);

      await factory.create();

      expect(initCallback).toHaveBeenCalled();
    });

    test('should call async init callback', async () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const asyncInitCallback = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      factory.onInit(asyncInitCallback);

      await factory.create();

      expect(asyncInitCallback).toHaveBeenCalled();
    });

    test('should override update method when callback provided', async () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const updateCallback = jest.fn();
      factory.onUpdate(updateCallback);

      const game = await factory.create();
      game.update(0.016);

      expect(updateCallback).toHaveBeenCalledWith(0.016);
    });

    test('should override render method when callback provided', async () => {
      const factory = new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      const renderCallback = jest.fn();
      factory.onRender(renderCallback);

      const game = await factory.create();
      const ctx = canvas.getContext('2d')!;
      game.render(ctx);

      expect(renderCallback).toHaveBeenCalledWith(ctx);
    });

    test('should support fluent API', async () => {
      const initCallback = jest.fn();
      const updateCallback = jest.fn();
      const renderCallback = jest.fn();

      const game = await new GameFactory({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      })
        .onInit(initCallback)
        .onUpdate(updateCallback)
        .onRender(renderCallback)
        .create();

      expect(game).toBeDefined();
      expect(initCallback).toHaveBeenCalled();
    });
  });

  describe('createGame helper', () => {
    test('should return game factory', () => {
      const factory = createGame({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      });

      expect(factory).toBeInstanceOf(GameFactory);
    });

    test('should support fluent API', async () => {
      const game = await createGame({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        autoStart: false
      })
        .onInit(() => {})
        .create();

      expect(game).toBeDefined();
    });
  });

  describe('quickStart helper', () => {
    test('should create and start game with minimal config', async () => {
      const game = await quickStart('test-canvas', 800, 600);

      expect(game).toBeDefined();
      expect(game).toBeInstanceOf(GameManager);
      game.stop();
    });

    test('should use default dimensions', async () => {
      const game = await quickStart('test-canvas');

      expect(game).toBeDefined();
      const size = game.getEngine().getSize();
      expect(size.width).toBe(800);
      expect(size.height).toBe(600);
      game.stop();
    });
  });
});
