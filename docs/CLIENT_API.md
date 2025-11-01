# Client Engine API Documentation

## SOLID-Based API (Recommended)

The game engine uses SOLID principles. You don't need to manually create instances or manage lifecycle.

### Quick Start

```typescript
import { initGame, getGame } from '@games-base/client';

// Initialize the game
initGame({
  canvasId: 'myGame',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  targetFPS: 60
});

// Access game components anywhere
const game = getGame();
const characterBuilder = game.getCharacterBuilder();
const mapBuilder = game.getMapBuilder();
const effectBuilder = game.getEffectBuilder();
const inputManager = game.getInputManager();
const assetLoader = game.getAssetLoader();
```

### Alternative: Fluent API

```typescript
import { createGame, getGame } from '@games-base/client';

await createGame({
  canvasId: 'myGame',
  width: 800,
  height: 600
})
.onInit(async () => {
  // Load assets
  const assetLoader = getGame().getAssetLoader();
  await assetLoader.loadImage('player', '/assets/player.png');
})
.onUpdate((deltaTime) => {
  // Update game logic
})
.onRender((ctx) => {
  // Render game
})
.create();
```

## GameManager

Access the singleton game manager to get all game components.

### Methods

- `initGame(config)`: Initialize the game with configuration
- `getGame()`: Get the game manager instance (use anywhere)
- `start()`: Start the game loop (called automatically)
- `stop()`: Stop the game loop
- `getEngine()`: Get the underlying engine instance
- `getMapBuilder()`: Get the map builder
- `getCharacterBuilder()`: Get the character builder
- `getEffectBuilder()`: Get the effect builder
- `getInputManager()`: Get the input manager
- `getAssetLoader()`: Get the asset loader

### Configuration

```typescript
interface GameManagerConfig {
  canvasId: string;        // ID of the canvas element
  width: number;           // Canvas width in pixels
  height: number;          // Canvas height in pixels
  backgroundColor?: string; // Optional background color
  targetFPS?: number;      // Optional target FPS (default: 60)
  autoStart?: boolean;     // Auto-start game (default: true)
}
```

## MapBuilder

Create and manage tile-based maps with multiple layers.

### Methods

- `setTileSize(width, height)`: Set the size of each tile
- `setMapSize(width, height)`: Set the map dimensions (in tiles)
- `addTile(id, tile)`: Add a tile to the tileset
- `createLayer(name)`: Create a new map layer
- `setTile(layerIndex, x, y, tileId)`: Place a tile on the map
- `getTile(layerIndex, x, y)`: Get tile at position
- `build()`: Build and return the map object
- `render(ctx, map, camera?)`: Render the map to canvas
- `checkCollision(map, worldX, worldY)`: Check for collision at position

### Example

```typescript
import { getGame } from '@games-base/client';

// Get the map builder from the game manager
const mapBuilder = getGame().getMapBuilder();

// Configure map
mapBuilder
  .setTileSize(32, 32)
  .setMapSize(20, 15)
  .addTile('grass', {
    id: 'grass',
    sprite: grassImage,
    collision: false
  })
  .addTile('wall', {
    id: 'wall',
    sprite: wallImage,
    collision: true
  })
  .createLayer('ground')
  .setTile(0, 5, 5, 'wall');

const map = mapBuilder.build();
```

## CharacterBuilder

Access via `getGame().getCharacterBuilder()`. Create and manage game characters with sprites, animations, and stats.

### Methods

- `createCharacter(id, name, position, size, stats)`: Create a new character
- `getCharacter(id)`: Get character by ID
- `setSprite(characterId, sprite)`: Set character sprite
- `addAnimation(characterId, animation)`: Add animation to character
- `setAnimation(characterId, animationName)`: Set current animation
- `moveCharacter(characterId, deltaX, deltaY)`: Move character
- `setPosition(characterId, x, y)`: Set character position
- `updateStats(characterId, stats)`: Update character stats
- `render(ctx, character, camera?)`: Render character
- `update(character, deltaTime)`: Update character state

### Example

```typescript
import { getGame } from '@games-base/client';

// Get the character builder from the game manager
const characterBuilder = getGame().getCharacterBuilder();

const player = characterBuilder.createCharacter(
  'player1',
  'Hero',
  { x: 100, y: 100 },
  { width: 32, height: 32 },
  { health: 100, maxHealth: 100, speed: 150 }
);

characterBuilder.setSprite('player1', {
  image: playerImage,
  size: { width: 32, height: 32 }
});
```

## EffectBuilder

Access via `getGame().getEffectBuilder()`. Create particle-based visual effects.

### Methods

- `createExplosion(position, config)`: Create explosion effect
- `createTrail(position, color)`: Create trail effect
- `createSparkle(position, color)`: Create sparkle effect
- `update(deltaTime)`: Update all effects
- `render(ctx, camera?)`: Render all effects
- `clear()`: Remove all effects
- `getEffect(id)`: Get effect by ID
- `getActiveEffects()`: Get all active effects

### Example

```typescript
import { getGame } from '@games-base/client';

// Get the effect builder from the game manager
const effectBuilder = getGame().getEffectBuilder();

// Create explosion
effectBuilder.createExplosion(
  { x: 200, y: 200 },
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

// Update in game loop
effectBuilder.update(deltaTime);
effectBuilder.render(ctx);
```

## InputManager

Access via `getGame().getInputManager()`. Handle keyboard and mouse input.

### Methods

- `isKeyPressed(code)`: Check if key is pressed
- `isMouseButtonPressed(button)`: Check if mouse button is pressed
- `getMousePosition()`: Get current mouse position
- `clear()`: Clear all input state

### Example

```typescript
import { getGame } from '@games-base/client';

// Get the input manager from the game manager
const inputManager = getGame().getInputManager();

// In update loop
if (inputManager.isKeyPressed('KeyW')) {
  player.y -= speed * deltaTime;
}

if (inputManager.isMouseButtonPressed(0)) {
  const mousePos = inputManager.getMousePosition();
  // Handle click at mousePos
}
```

## AssetLoader

Access via `getGame().getAssetLoader()`. Load and manage game assets (images, sounds).

### Methods

- `loadImage(key, url)`: Load an image
- `loadSound(key, url)`: Load a sound
- `waitForAll()`: Wait for all assets to load
- `getImage(key)`: Get loaded image
- `getSound(key)`: Get loaded sound
- `playSound(key, loop?)`: Play a sound
- `stopSound(key)`: Stop a sound

### Example

```typescript
import { getGame } from '@games-base/client';

// Get the asset loader from the game manager
const assetLoader = getGame().getAssetLoader();

// Load assets
await assetLoader.loadImage('player', '/assets/player.png');
await assetLoader.loadSound('jump', '/assets/jump.wav');
await assetLoader.waitForAll();

// Use assets
const playerImage = assetLoader.getImage('player');
assetLoader.playSound('jump');
```
