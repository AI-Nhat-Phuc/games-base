/**
 * Main entry point for the Game Engine
 * Exports all public APIs
 */

// Core - SOLID-based APIs (Recommended)
export { GameManager, initGame, getGame } from './core/GameManager';
export type { GameManagerConfig } from './core/GameManager';
export { GameFactory, createGame, quickStart } from './core/GameFactory';
export type { GameSetup } from './core/GameFactory';

// Core - Original APIs (for advanced users)
export { GameEngine } from './core/GameEngine';
export type { GameEngineConfig } from './core/GameEngine';
export * from './core/types';

// Builders
export { MapBuilder } from './builders/MapBuilder';
export type { Tile, TileLayer, GameMap } from './builders/MapBuilder';

export { CharacterBuilder } from './builders/CharacterBuilder';
export type { Character, CharacterStats } from './builders/CharacterBuilder';

export { EffectBuilder } from './builders/EffectBuilder';
export type { Particle, Effect, EffectConfig } from './builders/EffectBuilder';

// Utils
export { InputManager } from './utils/InputManager';
export { AssetLoader } from './utils/AssetLoader';
