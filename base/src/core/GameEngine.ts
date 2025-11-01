/**
 * Game Engine - Main entry point for the 2D game engine
 */

import { Size } from './types';

export interface GameEngineConfig {
  canvasId: string;
  width: number;
  height: number;
  backgroundColor?: string;
  targetFPS?: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameEngineConfig;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private targetFPS: number;
  private frameTime: number;

  constructor(config: GameEngineConfig) {
    this.config = config;
    this.targetFPS = config.targetFPS || 60;
    this.frameTime = 1000 / this.targetFPS;

    // Get or create canvas
    const canvasElement = document.getElementById(config.canvasId);
    if (!canvasElement) {
      throw new Error(`Canvas with id "${config.canvasId}" not found`);
    }
    
    this.canvas = canvasElement as HTMLCanvasElement;
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get canvas size
   */
  getSize(): Size {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Main game loop
   */
  private gameLoop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= this.frameTime) {
      // Clear canvas
      this.ctx.fillStyle = this.config.backgroundColor || '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Update and render will be called here
      this.update(deltaTime / 1000); // Convert to seconds
      this.render();

      this.lastTime = currentTime - (deltaTime % this.frameTime);
    }

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Update game state - to be overridden
   */
  protected update(_deltaTime: number): void {
    // Override this method in subclass
  }

  /**
   * Render game - to be overridden
   */
  protected render(): void {
    // Override this method in subclass
  }
}
