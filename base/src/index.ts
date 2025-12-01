/**
 * Main entry point for the Game Engine
 */

// Core APIs
export { GameManager, initGame, getGame } from './core/GameManager';
export type { GameManagerConfig } from './core/GameManager';
export { GameFactory, createGame, quickStart } from './core/GameFactory';
export type { GameSetup } from './core/GameFactory';

// Types (exported for type definitions only)
export * from './core/types';
export type { Tile, TileLayer, GameMap } from './builders/MapBuilder';
export type { Character, CharacterStats } from './builders/CharacterBuilder';
export type { Particle, Effect, EffectConfig } from './builders/EffectBuilder';

// AI NPC Module
export { NPCBuilder } from './ai/NPCBuilder';
export {
  IdleBehavior,
  PatrolBehavior,
  ChaseBehavior,
  FleeBehavior,
  AttackBehavior,
  WanderBehavior,
  FollowBehavior
} from './ai/behaviors';
export type {
  NPC,
  NPCState,
  NPCType,
  NPCCreationOptions,
  AIBehavior,
  AIBehaviorConfig,
  AIContext,
  NPCDialog,
  NPCDialogChoice
} from './ai/types';

// Note: Use initGame() or createGame() to initialize the engine.
// Access builders via getGame().getCharacterBuilder(), etc.
