/**
 * Game Factory - Factory pattern for creating games
 * Simplifies game creation with fluent API
 */

import { GameManager, GameManagerConfig, initGame } from './GameManager';
import { Character } from '../builders/CharacterBuilder';
import { GameMap } from '../builders/MapBuilder';

export interface GameSetup {
  onInit?: () => void | Promise<void>;
  onUpdate?: (deltaTime: number) => void;
  onRender?: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Game Factory
 * Provides a fluent API for creating games without managing instances
 */
export class GameFactory {
  private config: GameManagerConfig;
  private setup: GameSetup = {};

  constructor(config: GameManagerConfig) {
    this.config = config;
  }

  /**
   * Set initialization callback
   */
  public onInit(callback: () => void | Promise<void>): GameFactory {
    this.setup.onInit = callback;
    return this;
  }

  /**
   * Set update callback
   */
  public onUpdate(callback: (deltaTime: number) => void): GameFactory {
    this.setup.onUpdate = callback;
    return this;
  }

  /**
   * Set render callback
   */
  public onRender(callback: (ctx: CanvasRenderingContext2D) => void): GameFactory {
    this.setup.onRender = callback;
    return this;
  }

  /**
   * Create and start the game
   */
  public async create(): Promise<GameManager> {
    const game = initGame(this.config);

    // Run initialization
    if (this.setup.onInit) {
      await this.setup.onInit();
    }

    // Override update/render if provided
    if (this.setup.onUpdate) {
      const originalUpdate = game.update.bind(game);
      game.update = (deltaTime: number) => {
        originalUpdate(deltaTime);
        this.setup.onUpdate!(deltaTime);
      };
    }

    if (this.setup.onRender) {
      const originalRender = game.render.bind(game);
      game.render = (ctx: CanvasRenderingContext2D) => {
        originalRender(ctx);
        this.setup.onRender!(ctx);
      };
    }

    return game;
  }
}

/**
 * Create a new game with fluent API
 */
export function createGame(config: GameManagerConfig): GameFactory {
  return new GameFactory(config);
}

/**
 * Quick start - Creates and starts a game with minimal configuration
 */
export async function quickStart(
  canvasId: string,
  width: number = 800,
  height: number = 600
): Promise<GameManager> {
  return initGame({
    canvasId,
    width,
    height,
    autoStart: true
  });
}
