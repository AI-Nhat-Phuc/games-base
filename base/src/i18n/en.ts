/**
 * English translations for the core engine
 * This module contains all user-facing messages and error strings in English.
 */

export const en = {
  errors: {
    gameNotInitialized: 'Game engine has not been initialized. Call initGame() first.',
    canvasNotFound: 'Canvas element not found with id: {canvasId}',
    invalidConfig: 'Invalid configuration provided',
    assetLoadFailed: 'Failed to load asset: {assetPath}',
    characterNotFound: 'Character not found with id: {characterId}',
    mapNotFound: 'Map not found with id: {mapId}',
    layerNotFound: 'Layer not found: {layerName}',
    invalidPosition: 'Invalid position coordinates provided',
    animationNotFound: 'Animation not found: {animationName}',
    behaviorNotFound: 'Behavior not found: {behaviorName}',
    npcNotFound: 'NPC not found with id: {npcId}',
    tilesetNotLoaded: 'Tileset has not been loaded'
  },
  warnings: {
    assetAlreadyLoaded: 'Asset already loaded: {assetPath}',
    characterAlreadyExists: 'Character with id already exists: {characterId}',
    layerAlreadyExists: 'Layer already exists: {layerName}',
    deprecatedMethod: 'Method {methodName} is deprecated. Use {replacement} instead.'
  },
  info: {
    gameInitialized: 'Game engine initialized successfully',
    gameStarted: 'Game started',
    gamePaused: 'Game paused',
    gameResumed: 'Game resumed',
    assetLoaded: 'Asset loaded: {assetPath}',
    characterCreated: 'Character created: {characterId}',
    mapLoaded: 'Map loaded: {mapId}',
    npcCreated: 'NPC created: {npcId}'
  },
  debug: {
    frameRate: 'Current FPS: {fps}',
    entityCount: 'Total entities: {count}',
    memoryUsage: 'Memory usage: {usage}MB'
  }
};
