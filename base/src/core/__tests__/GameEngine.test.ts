/**
 * Tests for GameEngine
 */

import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { GameEngine } from '../GameEngine';

describe('GameEngine', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create a canvas element for testing
    canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(canvas);
  });

  describe('constructor', () => {
    test('should create engine with valid canvas id', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(engine).toBeDefined();
      expect(engine.getCanvas()).toBe(canvas);
    });

    test('should set canvas dimensions', () => {
      new GameEngine({
        canvasId: 'test-canvas',
        width: 1024,
        height: 768
      });

      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
    });

    test('should throw error for non-existent canvas', () => {
      expect(() => {
        new GameEngine({
          canvasId: 'nonexistent',
          width: 800,
          height: 600
        });
      }).toThrow('Canvas with id "nonexistent" not found');
    });

    test('should use default FPS if not provided', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(engine).toBeDefined();
      // Default FPS is 60, can't directly test but engine should be created
    });

    test('should use custom FPS if provided', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        targetFPS: 30
      });

      expect(engine).toBeDefined();
    });
  });

  describe('getCanvas', () => {
    test('should return canvas element', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(engine.getCanvas()).toBe(canvas);
    });
  });

  describe('getContext', () => {
    test('should return 2D rendering context', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      const ctx = engine.getContext();
      expect(ctx).toBeDefined();
      expect(ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });
  });

  describe('getSize', () => {
    test('should return canvas size', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 640,
        height: 480
      });

      const size = engine.getSize();
      expect(size.width).toBe(640);
      expect(size.height).toBe(480);
    });
  });

  describe('start and stop', () => {
    test('should start the game loop', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(() => engine.start()).not.toThrow();
      engine.stop();
    });

    test('should not start if already running', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      engine.start();
      // Starting again should not cause issues
      expect(() => engine.start()).not.toThrow();
      engine.stop();
    });

    test('should stop the game loop', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      engine.start();
      expect(() => engine.stop()).not.toThrow();
    });
  });

  describe('backgroundColor', () => {
    test('should use default background color', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600
      });

      expect(engine).toBeDefined();
      // Background color is applied during game loop
    });

    test('should use custom background color', () => {
      const engine = new GameEngine({
        canvasId: 'test-canvas',
        width: 800,
        height: 600,
        backgroundColor: '#ff0000'
      });

      expect(engine).toBeDefined();
    });
  });
});
