/**
 * Input Manager - Handles keyboard and mouse input
 */

import { Vector2D } from '../core/types';

export class InputManager {
  private keys: Set<string> = new Set();
  private mousePosition: Vector2D = { x: 0, y: 0 };
  private mouseButtons: Set<number> = new Set();
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition.x = e.clientX - rect.left;
      this.mousePosition.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseButtons.add(e.button);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseButtons.delete(e.button);
    });
  }

  /**
   * Check if key is pressed
   */
  isKeyPressed(code: string): boolean {
    return this.keys.has(code);
  }

  /**
   * Check if mouse button is pressed
   */
  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  /**
   * Get mouse position
   */
  getMousePosition(): Vector2D {
    return { ...this.mousePosition };
  }

  /**
   * Clear all input state
   */
  clear(): void {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}
