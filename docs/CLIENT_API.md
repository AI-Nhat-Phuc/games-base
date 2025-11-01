# Client Engine API Documentation

## GameEngine

The main game engine class that manages the game loop and rendering.

### Constructor

```typescript
constructor(config: GameEngineConfig)
```

#### GameEngineConfig

```typescript
interface GameEngineConfig {
  canvasId: string;        // ID of the canvas element
  width: number;           // Canvas width in pixels
  height: number;          // Canvas height in pixels
  backgroundColor?: string; // Optional background color
  targetFPS?: number;      // Optional target FPS (default: 60)
}
```

### Methods

- `start()`: Start the game loop
- `stop()`: Stop the game loop
- `getCanvas()`: Get the canvas element
- `getContext()`: Get the 2D rendering context
- `getSize()`: Get canvas dimensions

### Example

```typescript
import { GameEngine } from '@games-base/client';

const engine = new GameEngine({
  canvasId: 'myGame',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  targetFPS: 60
});

engine.start();
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
import { MapBuilder } from '@games-base/client';

const mapBuilder = new MapBuilder();

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

Create and manage game characters with sprites, animations, and stats.

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
import { CharacterBuilder } from '@games-base/client';

const characterBuilder = new CharacterBuilder();

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

Create particle-based visual effects.

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
import { EffectBuilder } from '@games-base/client';

const effectBuilder = new EffectBuilder();

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

Handle keyboard and mouse input.

### Methods

- `isKeyPressed(code)`: Check if key is pressed
- `isMouseButtonPressed(button)`: Check if mouse button is pressed
- `getMousePosition()`: Get current mouse position
- `clear()`: Clear all input state

### Example

```typescript
import { InputManager } from '@games-base/client';

const inputManager = new InputManager(canvas);

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

Load and manage game assets (images, sounds).

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
import { AssetLoader } from '@games-base/client';

const assetLoader = new AssetLoader();

// Load assets
await assetLoader.loadImage('player', '/assets/player.png');
await assetLoader.loadSound('jump', '/assets/jump.wav');
await assetLoader.waitForAll();

// Use assets
const playerImage = assetLoader.getImage('player');
assetLoader.playSound('jump');
```
