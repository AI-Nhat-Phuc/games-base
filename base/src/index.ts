/**
 * Main entry point for the Game Engine
 * SOLID Principles - No Manual Instance Management Required
 */

// Core - SOLID-based APIs
export { GameManager, initGame, getGame } from './core/GameManager';
export type { GameManagerConfig } from './core/GameManager';
export { GameFactory, createGame, quickStart } from './core/GameFactory';
export type { GameSetup } from './core/GameFactory';

// Types (exported for type definitions only)
export * from './core/types';
export type { Tile, TileLayer, GameMap } from './builders/MapBuilder';
export type { Character, CharacterStats } from './builders/CharacterBuilder';
export type { Particle, Effect, EffectConfig } from './builders/EffectBuilder';

// Note: Direct class instantiation is no longer supported.
// Use initGame() or createGame() instead.
// Access builders via getGame().getCharacterBuilder(), etc.
