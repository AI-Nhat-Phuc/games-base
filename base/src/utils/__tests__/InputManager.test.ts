/**
 * Tests for InputManager
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { InputManager } from '../InputManager';

describe('InputManager', () => {
  let canvas: HTMLCanvasElement;
  let inputManager: InputManager;

  beforeEach(() => {
    // Create a canvas element for testing
    canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    inputManager = new InputManager(canvas);
  });

  afterEach(() => {
    inputManager.clear();
    document.body.removeChild(canvas);
  });

  describe('constructor', () => {
    test('should create input manager with canvas', () => {
      expect(inputManager).toBeDefined();
    });
  });

  describe('keyboard input', () => {
    test('should detect key press', () => {
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      window.dispatchEvent(event);

      expect(inputManager.isKeyPressed('KeyW')).toBe(true);
    });

    test('should detect key release', () => {
      const downEvent = new KeyboardEvent('keydown', { code: 'KeyA' });
      window.dispatchEvent(downEvent);

      expect(inputManager.isKeyPressed('KeyA')).toBe(true);

      const upEvent = new KeyboardEvent('keyup', { code: 'KeyA' });
      window.dispatchEvent(upEvent);

      expect(inputManager.isKeyPressed('KeyA')).toBe(false);
    });

    test('should handle multiple keys pressed simultaneously', () => {
      const event1 = new KeyboardEvent('keydown', { code: 'KeyW' });
      const event2 = new KeyboardEvent('keydown', { code: 'KeyA' });
      
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);

      expect(inputManager.isKeyPressed('KeyW')).toBe(true);
      expect(inputManager.isKeyPressed('KeyA')).toBe(true);
    });

    test('should return false for unpressed keys', () => {
      expect(inputManager.isKeyPressed('KeyZ')).toBe(false);
    });
  });

  describe('mouse input', () => {
    test('should detect mouse button press', () => {
      const event = new MouseEvent('mousedown', {
        button: 0,
        clientX: 100,
        clientY: 100
      });
      canvas.dispatchEvent(event);

      expect(inputManager.isMouseButtonPressed(0)).toBe(true);
    });

    test('should detect mouse button release', () => {
      const downEvent = new MouseEvent('mousedown', { button: 0 });
      canvas.dispatchEvent(downEvent);

      expect(inputManager.isMouseButtonPressed(0)).toBe(true);

      const upEvent = new MouseEvent('mouseup', { button: 0 });
      canvas.dispatchEvent(upEvent);

      expect(inputManager.isMouseButtonPressed(0)).toBe(false);
    });

    test('should track mouse position', () => {
      // Mock getBoundingClientRect
      canvas.getBoundingClientRect = jest.fn(() => ({
        left: 10,
        top: 20,
        right: 810,
        bottom: 620,
        width: 800,
        height: 600,
        x: 10,
        y: 20,
        toJSON: () => {}
      }));

      const event = new MouseEvent('mousemove', {
        clientX: 110,
        clientY: 120
      });
      canvas.dispatchEvent(event);

      const position = inputManager.getMousePosition();
      expect(position.x).toBe(100); // 110 - 10
      expect(position.y).toBe(100); // 120 - 20
    });

    test('should return false for unpressed mouse buttons', () => {
      expect(inputManager.isMouseButtonPressed(0)).toBe(false);
      expect(inputManager.isMouseButtonPressed(1)).toBe(false);
      expect(inputManager.isMouseButtonPressed(2)).toBe(false);
    });

    test('should handle different mouse buttons', () => {
      const leftClick = new MouseEvent('mousedown', { button: 0 });
      const rightClick = new MouseEvent('mousedown', { button: 2 });
      
      canvas.dispatchEvent(leftClick);
      canvas.dispatchEvent(rightClick);

      expect(inputManager.isMouseButtonPressed(0)).toBe(true);
      expect(inputManager.isMouseButtonPressed(2)).toBe(true);
      expect(inputManager.isMouseButtonPressed(1)).toBe(false);
    });
  });

  describe('getMousePosition', () => {
    test('should return mouse position', () => {
      const position = inputManager.getMousePosition();
      
      expect(position).toBeDefined();
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
    });

    test('should return a copy of mouse position', () => {
      const position1 = inputManager.getMousePosition();
      const position2 = inputManager.getMousePosition();

      expect(position1).not.toBe(position2);
      expect(position1).toEqual(position2);
    });
  });

  describe('clear', () => {
    test('should clear all keyboard input', () => {
      const event1 = new KeyboardEvent('keydown', { code: 'KeyW' });
      const event2 = new KeyboardEvent('keydown', { code: 'KeyA' });
      
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);

      expect(inputManager.isKeyPressed('KeyW')).toBe(true);
      expect(inputManager.isKeyPressed('KeyA')).toBe(true);

      inputManager.clear();

      expect(inputManager.isKeyPressed('KeyW')).toBe(false);
      expect(inputManager.isKeyPressed('KeyA')).toBe(false);
    });

    test('should clear all mouse button input', () => {
      const event1 = new MouseEvent('mousedown', { button: 0 });
      const event2 = new MouseEvent('mousedown', { button: 1 });
      
      canvas.dispatchEvent(event1);
      canvas.dispatchEvent(event2);

      expect(inputManager.isMouseButtonPressed(0)).toBe(true);
      expect(inputManager.isMouseButtonPressed(1)).toBe(true);

      inputManager.clear();

      expect(inputManager.isMouseButtonPressed(0)).toBe(false);
      expect(inputManager.isMouseButtonPressed(1)).toBe(false);
    });
  });
});
