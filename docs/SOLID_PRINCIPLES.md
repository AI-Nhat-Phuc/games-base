# SOLID Principles Implementation

The game engine now follows SOLID principles, providing a simplified API where users don't need to manually create instances or manage the game lifecycle.

## Overview

### Benefits
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: All dependencies are managed automatically
- **Singleton Pattern**: No need to pass instances around
- **Factory Pattern**: Simple game creation with fluent API
- **Automatic Lifecycle Management**: Start/stop handled automatically

## Quick Start (Simplest Way)

```typescript
import { quickStart, getGame } from '@games-base/client';

// Initialize and auto-start the game
await quickStart('gameCanvas', 800, 600);

// Access game components anywhere
const game = getGame();
const characterBuilder = game.getCharacterBuilder();
const mapBuilder = game.getMapBuilder();

// Create a character
const player = characterBuilder.createCharacter(
  'player1',
  'Hero',
  { x: 100, y: 100 },
  { width: 32, height: 32 },
  { health: 100, maxHealth: 100, speed: 200 }
);
```

## Fluent API (Recommended Way)

```typescript
import { createGame, getGame } from '@games-base/client';

// Create game with fluent API
await createGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  targetFPS: 60
})
.onInit(async () => {
  // Load assets
  const game = getGame();
  const assetLoader = game.getAssetLoader();
  
  await assetLoader.loadImage('player', '/assets/player.png');
  await assetLoader.loadImage('enemy', '/assets/enemy.png');
  await assetLoader.waitForAll();
  
  console.log('Assets loaded!');
})
.onUpdate((deltaTime) => {
  // Update game logic
  const game = getGame();
  const inputManager = game.getInputManager();
  const characterBuilder = game.getCharacterBuilder();
  
  if (inputManager.isKeyPressed('ArrowRight')) {
    characterBuilder.moveCharacter('player1', 200 * deltaTime, 0);
  }
})
.onRender((ctx) => {
  // Render game objects
  const game = getGame();
  const characterBuilder = game.getCharacterBuilder();
  const player = characterBuilder.getCharacter('player1');
  
  if (player) {
    characterBuilder.render(ctx, player);
  }
})
.create();
```

## Using Game Manager Directly

```typescript
import { initGame, getGame } from '@games-base/client';

// Initialize the game
initGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600,
  autoStart: true  // Automatically starts the game
});

// Access game instance from anywhere
const game = getGame();

// Get builders (Dependency Injection)
const mapBuilder = game.getMapBuilder();
const characterBuilder = game.getCharacterBuilder();
const effectBuilder = game.getEffectBuilder();
const inputManager = game.getInputManager();
const assetLoader = game.getAssetLoader();

// No need to pass these around - access them globally
function createPlayer() {
  const game = getGame();
  const builder = game.getCharacterBuilder();
  
  return builder.createCharacter(
    'player1',
    'Hero',
    { x: 100, y: 100 },
    { width: 32, height: 32 },
    { health: 100, maxHealth: 100, speed: 200 }
  );
}

function handleInput() {
  const game = getGame();
  const input = game.getInputManager();
  const builder = game.getCharacterBuilder();
  
  if (input.isKeyPressed('KeyW')) {
    builder.moveCharacter('player1', 0, -5);
  }
}
```

## Complete Example

```typescript
import { createGame, getGame } from '@games-base/client';

// Game state
let player: any = null;

// Create and configure game
await createGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  targetFPS: 60
})
.onInit(async () => {
  const game = getGame();
  
  // Load assets
  const assetLoader = game.getAssetLoader();
  await assetLoader.loadImage('player_sprite', '/assets/hero.png');
  await assetLoader.loadSound('jump', '/assets/jump.wav');
  await assetLoader.waitForAll();
  
  // Create player
  const characterBuilder = game.getCharacterBuilder();
  player = characterBuilder.createCharacter(
    'player1',
    'Hero',
    { x: 400, y: 300 },
    { width: 32, height: 32 },
    { health: 100, maxHealth: 100, speed: 200 }
  );
  
  // Set sprite
  const sprite = assetLoader.getImage('player_sprite');
  characterBuilder.setSprite('player1', {
    image: sprite,
    size: { width: 32, height: 32 }
  });
  
  // Create map
  const mapBuilder = game.getMapBuilder();
  mapBuilder
    .setTileSize(32, 32)
    .setMapSize(25, 19)
    .createLayer('ground')
    .createLayer('objects');
})
.onUpdate((deltaTime) => {
  const game = getGame();
  const inputManager = game.getInputManager();
  const characterBuilder = game.getCharacterBuilder();
  const effectBuilder = game.getEffectBuilder();
  
  // Handle player movement
  const speed = player.stats.speed * deltaTime;
  
  if (inputManager.isKeyPressed('ArrowUp') || inputManager.isKeyPressed('KeyW')) {
    characterBuilder.moveCharacter('player1', 0, -speed);
  }
  if (inputManager.isKeyPressed('ArrowDown') || inputManager.isKeyPressed('KeyS')) {
    characterBuilder.moveCharacter('player1', 0, speed);
  }
  if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('KeyA')) {
    characterBuilder.moveCharacter('player1', -speed, 0);
  }
  if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('KeyD')) {
    characterBuilder.moveCharacter('player1', speed, 0);
  }
  
  // Create effect on space press
  if (inputManager.isKeyPressed('Space')) {
    effectBuilder.createExplosion(
      player.transform.position,
      {
        particleCount: 20,
        particleLife: 1.0,
        particleSize: 4,
        color: { r: 1, g: 0.5, b: 0 },
        spread: 100,
        velocity: 150,
        gravity: 50
      }
    );
  }
})
.onRender((ctx) => {
  const game = getGame();
  const characterBuilder = game.getCharacterBuilder();
  
  // Render player
  if (player) {
    characterBuilder.render(ctx, player);
  }
})
.create();

// Game is now running!
console.log('Game started!');
```

## Module Organization

```typescript
// In module-a.ts
import { getGame } from '@games-base/client';

export function createEnemy(x: number, y: number) {
  const game = getGame();
  const builder = game.getCharacterBuilder();
  
  return builder.createCharacter(
    `enemy_${Date.now()}`,
    'Goblin',
    { x, y },
    { width: 32, height: 32 },
    { health: 50, maxHealth: 50, speed: 100 }
  );
}

// In module-b.ts
import { getGame } from '@games-base/client';

export function handleEnemyMovement(deltaTime: number) {
  const game = getGame();
  const builder = game.getCharacterBuilder();
  const enemies = builder.getAllPlayers().filter(p => p.name === 'Goblin');
  
  enemies.forEach(enemy => {
    // Move enemy
    builder.moveCharacter(enemy.id, 50 * deltaTime, 0);
  });
}

// In main.ts
import { initGame } from '@games-base/client';
import { createEnemy } from './module-a';
import { handleEnemyMovement } from './module-b';

// Initialize once
initGame({ canvasId: 'game', width: 800, height: 600 });

// Use from different modules without passing instances
createEnemy(100, 100);
createEnemy(200, 150);
```

## Lifecycle Management

```typescript
import { initGame, getGame } from '@games-base/client';

// Initialize
const game = initGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600,
  autoStart: false  // Manual start
});

// Start when ready
game.start();

// Stop the game
game.stop();

// Clean up
game.destroy();

// Start a new game
initGame({ canvasId: 'gameCanvas', width: 800, height: 600 });
```

## Advanced: Custom Game Class (Optional)

For users who want more control:

```typescript
import { GameEngine, GameEngineConfig } from '@games-base/client';

class MyGame extends GameEngine {
  constructor(config: GameEngineConfig) {
    super(config);
  }

  protected update(deltaTime: number): void {
    // Custom update logic
  }

  protected render(): void {
    // Custom render logic
    const ctx = this.getContext();
    // ... rendering code
  }
}

// Create custom game
const game = new MyGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600
});

game.start();
```

## Comparison

### Before (Manual Instance Management)

```typescript
// User has to create and manage instances
const engine = new GameEngine({ canvasId: 'game', width: 800, height: 600 });
const characterBuilder = new CharacterBuilder();
const mapBuilder = new MapBuilder();
const effectBuilder = new EffectBuilder();
const inputManager = new InputManager(engine.getCanvas());
const assetLoader = new AssetLoader();

// Pass instances everywhere
function createPlayer(builder: CharacterBuilder) {
  return builder.createCharacter(...);
}

function handleInput(input: InputManager, builder: CharacterBuilder) {
  if (input.isKeyPressed('W')) {
    builder.moveCharacter(...);
  }
}

// Call with instances
createPlayer(characterBuilder);
handleInput(inputManager, characterBuilder);

// Start manually
engine.start();
```

### After (SOLID Principles)

```typescript
// Initialize once
initGame({ canvasId: 'game', width: 800, height: 600 });

// Access anywhere without passing instances
function createPlayer() {
  const builder = getGame().getCharacterBuilder();
  return builder.createCharacter(...);
}

function handleInput() {
  const game = getGame();
  const input = game.getInputManager();
  const builder = game.getCharacterBuilder();
  
  if (input.isKeyPressed('W')) {
    builder.moveCharacter(...);
  }
}

// Call without parameters
createPlayer();
handleInput();

// Automatically started!
```

## Key Principles Applied

1. **Single Responsibility Principle**: GameManager handles lifecycle, GameFactory handles creation
2. **Open/Closed Principle**: Extension through callbacks without modifying core
3. **Liskov Substitution Principle**: GameEngine can be extended/replaced
4. **Interface Segregation**: Clean separation between core engine and managers
5. **Dependency Inversion**: Depend on abstractions (getGame()) not concrete instances

## Migration Guide

Existing code still works! The new SOLID APIs are additions, not replacements:

```typescript
// Old way still works
import { GameEngine, CharacterBuilder } from '@games-base/client';
const engine = new GameEngine({ canvasId: 'game', width: 800, height: 600 });
const builder = new CharacterBuilder();

// New way (recommended)
import { initGame, getGame } from '@games-base/client';
initGame({ canvasId: 'game', width: 800, height: 600 });
const builder = getGame().getCharacterBuilder();
```

## Summary

No more:
- ❌ Manually creating instances
- ❌ Passing instances between functions
- ❌ Managing lifecycle (start/stop)
- ❌ Keeping track of references

Just:
- ✅ Initialize once
- ✅ Access anywhere with `getGame()`
- ✅ Automatic lifecycle management
- ✅ Clean, testable code
