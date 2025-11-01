/**
 * Game Manager - SOLID-based game lifecycle manager
 * Implements Singleton pattern and Dependency Injection
 * Users don't need to manually create instances or manage lifecycle
 */

import { GameEngine, GameEngineConfig } from './GameEngine';
import { MapBuilder } from '../builders/MapBuilder';
import { CharacterBuilder } from '../builders/CharacterBuilder';
import { EffectBuilder } from '../builders/EffectBuilder';
import { InputManager } from '../utils/InputManager';
import { AssetLoader } from '../utils/AssetLoader';

export interface GameManagerConfig extends GameEngineConfig {
  autoStart?: boolean;
}

/**
 * Singleton Game Manager
 * Automatically manages game engine lifecycle and dependencies
 */
export class GameManager {
  private static instance: GameManager | null = null;
  private engine: GameEngine | null = null;
  private mapBuilder: MapBuilder;
  private characterBuilder: CharacterBuilder;
  private effectBuilder: EffectBuilder;
  private inputManager: InputManager | null = null;
  private assetLoader: AssetLoader;
  private initialized: boolean = false;

  private constructor() {
    // Private constructor for Singleton
    this.mapBuilder = new MapBuilder();
    this.characterBuilder = new CharacterBuilder();
    this.effectBuilder = new EffectBuilder();
    this.assetLoader = new AssetLoader();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  /**
   * Initialize the game with configuration
   * Automatically sets up all dependencies
   */
  public initialize(config: GameManagerConfig): GameManager {
    if (this.initialized) {
      console.warn('GameManager already initialized. Skipping re-initialization.');
      return this;
    }

    // Create game engine
    this.engine = new GameEngine(config);
    
    // Create input manager with canvas
    this.inputManager = new InputManager(this.engine.getCanvas());

    this.initialized = true;

    // Auto-start if configured
    if (config.autoStart !== false) {
      this.start();
    }

    return this;
  }

  /**
   * Start the game
   */
  public start(): void {
    if (!this.engine) {
      throw new Error('GameManager not initialized. Call initialize() first.');
    }
    this.engine.start();
  }

  /**
   * Stop the game
   */
  public stop(): void {
    if (this.engine) {
      this.engine.stop();
    }
  }

  /**
   * Get the game engine instance
   */
  public getEngine(): GameEngine {
    if (!this.engine) {
      throw new Error('GameManager not initialized. Call initialize() first.');
    }
    return this.engine;
  }

  /**
   * Get the map builder (Dependency Injection)
   */
  public getMapBuilder(): MapBuilder {
    return this.mapBuilder;
  }

  /**
   * Get the character builder (Dependency Injection)
   */
  public getCharacterBuilder(): CharacterBuilder {
    return this.characterBuilder;
  }

  /**
   * Get the effect builder (Dependency Injection)
   */
  public getEffectBuilder(): EffectBuilder {
    return this.effectBuilder;
  }

  /**
   * Get the input manager (Dependency Injection)
   */
  public getInputManager(): InputManager {
    if (!this.inputManager) {
      throw new Error('GameManager not initialized. Call initialize() first.');
    }
    return this.inputManager;
  }

  /**
   * Get the asset loader (Dependency Injection)
   */
  public getAssetLoader(): AssetLoader {
    return this.assetLoader;
  }

  /**
   * Render method - called automatically by the engine
   */
  public render(ctx: CanvasRenderingContext2D): void {
    // This can be overridden or extended by the user
    this.effectBuilder.render(ctx);
  }

  /**
   * Update method - called automatically by the engine
   */
  public update(deltaTime: number): void {
    // This can be overridden or extended by the user
    this.effectBuilder.update(deltaTime);
  }

  /**
   * Clean up and reset the game manager
   */
  public destroy(): void {
    this.stop();
    this.inputManager?.clear();
    this.effectBuilder.clear();
    this.initialized = false;
    this.engine = null;
    this.inputManager = null;
  }

  /**
   * Reset the singleton instance (mainly for testing)
   */
  public static reset(): void {
    if (GameManager.instance) {
      GameManager.instance.destroy();
      GameManager.instance = null;
    }
  }
}

/**
 * Convenience function to initialize the game
 * Users can simply call this without managing instances
 */
export function initGame(config: GameManagerConfig): GameManager {
  return GameManager.getInstance().initialize(config);
}

/**
 * Get the game manager instance
 */
export function getGame(): GameManager {
  return GameManager.getInstance();
}
