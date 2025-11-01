# PNP Builder Tools (@nhatphucpham/builder)

A comprehensive web-based toolset for creating and configuring game assets for the PNP Game Engine. This package includes two powerful visual builders: Character Builder and Map Builder.

## Features

### 👤 Character Builder
Visual interface for creating game characters with sprites, animations, and audio.

#### Character Features
- **Sprite Upload**: Add character sprite images
- **Animation Sheet Upload**: Upload sprite sheets for character animations
- **Voice/Audio Upload**: Add sound effects or voice lines
- **Real-time Preview**: See your assets as you upload them
- **Stats System**: Health, speed, strength, defense, and level
- **Dimensions**: Configurable character size
- **Animation Settings**: Frame count, frame size, and duration
- **Output Generation**: JSON format and TypeScript integration code

### 🗺️ Map Builder
Visual interface for creating game maps with two distinct perspectives.

#### Map Types
1. **2.5D Isometric**: Top-down perspective with depth simulation
   - Pseudo-3D isometric grid
   - Multiple layers support
   - Ideal for RPGs and strategy games

2. **Side-Scrolling**: Traditional 2D side-view platformer style
   - Standard orthogonal grid
   - Platform-based level design
   - Perfect for action and platform games

#### Map Features
- **Visual Grid Editor**: Click-to-paint tile placement
- **Layer System**: Multiple layers for background, foreground, and collision
- **Tileset Support**: Import and use custom tilesets
- **Configurable Dimensions**: Set map size and tile size
- **Live Preview**: See your map as you build it
- **Export Options**: JSON data and TypeScript integration code

## Getting Started

### Installation

```bash
cd builders
npm install
```

### Running the Tool

```bash
npm start
```

The builder tools will start at `http://localhost:3000`

You'll see two options:
- **Character Builder** - Create characters with sprites and animations
- **Map Builder** - Design game maps with 2.5D or side-scrolling views

### Development Mode

```bash
npm run dev
```

## How to Use Character Builder

### 1. Basic Information
- Enter character name and unique ID
- Add a description for your character

### 2. Upload Assets
- **Sprite**: Upload a PNG/JPG image for the character
- **Animation Sheet**: Upload a sprite sheet with multiple frames
- **Voice/Audio**: Upload MP3/WAV files for character sounds

### 3. Configure Stats
Set the character's attributes:
- Health and Max Health
- Speed (movement speed in pixels/second)
- Strength (attack power)
- Defense (damage reduction)
- Level (character level)

### 4. Set Dimensions
- Width and height in pixels
- These should match your sprite dimensions

### 5. Animation Configuration
- Frame Count: Number of frames in the animation
- Frame Width/Height: Size of each frame
- Frame Duration: How long each frame displays (milliseconds)

### 6. Generate and Download
- Click "Generate Character Data" to create the output
- Review the JSON and TypeScript code
- Click "Download Character Data" to save

## How to Use Map Builder

### 1. Choose Map Type
Select between:
- **2.5D Isometric**: Top-down perspective with depth
- **Side-Scrolling**: Traditional platformer view

### 2. Configure Map Settings
- **Map Name**: Give your map a descriptive name
- **Dimensions**: Set width and height in tiles (5-100)
- **Tile Size**: Set the pixel size of each tile (8-128px)

### 3. Upload Tileset (Optional)
- Upload a tileset image containing your tile graphics
- The tileset will be used to render tiles visually

### 4. Build Your Map
- **Click to Paint**: Click tiles on the canvas to place them
- **Cycle Tiles**: Each click cycles through available tile types
- **Layers**: Use multiple layers for complex maps
  - Ground layer for terrain
  - Object layer for items and decorations
  - Collision layer for blocking movement

### 5. Layer Management
- **Add Layers**: Click "+ Add Layer" to create new layers
- **Switch Layers**: Click a layer to make it active
- **Active Layer**: Only the active layer is edited

### 6. Generate and Export
- **Generate Map Data**: Create JSON and TypeScript code
- **Download Map**: Save map data and integration code
- **Clear Map**: Reset all tiles (with confirmation)

## Map Builder Output Format

### JSON Structure
```json
{
  "name": "Level 1",
  "type": "2.5d",
  "width": 20,
  "height": 15,
  "tileSize": 32,
  "layers": [
    {
      "name": "Ground Layer",
      "tiles": [[0, 1, 2, ...], ...]
    }
  ],
  "tileset": {
    "name": "tileset.png"
  },
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "engine": "PNP Game Engine",
    "version": "1.0.0"
  }
}
```

### Integration with Base Engine (Map)

```typescript
import { getGame } from '@nhatphucpham/game-core-client';
import { Level1MapData } from './maps/level1_map';

// Load the map
const mapBuilder = getGame().getMapBuilder();
mapBuilder.setMapSize(Level1MapData.width, Level1MapData.height);
mapBuilder.setTileSize(Level1MapData.tileSize, Level1MapData.tileSize);

// Create layers
Level1MapData.layers.forEach(layer => {
  mapBuilder.createLayer(layer.name);
  
  // Place tiles
  layer.tiles.forEach((row, y) => {
    row.forEach((tileId, x) => {
      if (tileId > 0) {
        mapBuilder.setTile(layer.name, x, y, tileId);
      }
    });
  });
});
```

## Character Builder Output Format

### JSON Structure
```json
{
  "id": "hero_001",
  "name": "Hero",
  "description": "A brave hero ready for adventure",
  "stats": {
    "health": 100,
    "maxHealth": 100,
    "speed": 200,
    "strength": 10,
    "defense": 5,
    "level": 1
  },
  "size": {
    "width": 32,
    "height": 32
  },
  "animation": {
    "frameCount": 4,
    "frameWidth": 32,
    "frameHeight": 32,
    "frameDuration": 100
  },
  "assets": {
    "sprite": "hero_sprite.png",
    "animationSheet": "hero_walk.png",
    "voice": "hero_voice.mp3"
  }
}
```

## Integration with Base Engine

The generated TypeScript code can be directly used with the base engine:

```typescript
import { getGame } from '@nhatphucpham/game-core-client';

const characterBuilder = getGame().getCharacterBuilder();
const assetLoader = getGame().getAssetLoader();

// Load assets
await assetLoader.loadImage('hero_sprite', '/assets/hero_sprite.png');
await assetLoader.loadImage('hero_animation', '/assets/hero_walk.png');
await assetLoader.loadSound('hero_voice', '/assets/hero_voice.mp3');

// Create character using generated code
const hero = characterBuilder.createCharacter(
  'hero_001',
  'Hero',
  { x: 100, y: 100 },
  { width: 32, height: 32 },
  {
    health: 100,
    maxHealth: 100,
    speed: 200,
    strength: 10,
    defense: 5
  }
);

// Set sprite
const spriteImage = assetLoader.getImage('hero_sprite');
characterBuilder.setSprite('hero_001', {
  image: spriteImage,
  size: { width: 32, height: 32 }
});

// Render in game
characterBuilder.render(ctx, hero);
```

## Map Building Guidelines

### 2.5D Isometric Maps
- **Perspective**: Use isometric tiles for depth effect
- **Best For**: RPGs, strategy games, city builders
- **Tile Design**: Tiles should fit isometric grid (diamond shape)
- **Layering**: Use layers for terrain, buildings, and objects

### Side-Scrolling Maps
- **Perspective**: Traditional orthogonal view
- **Best For**: Platformers, side-scrollers, Metroidvania games
- **Tile Design**: Standard square tiles work perfectly
- **Layering**: Background, midground, foreground layers for parallax

### Tileset Guidelines
- **Format**: PNG (with transparency) recommended
- **Organization**: Arrange tiles in a grid pattern
- **Size**: Each tile should match your configured tile size
- **Consistency**: Maintain consistent art style across tileset

## Character Asset Guidelines

### Sprite Images
- **Format**: PNG (with transparency) or JPG
- **Size**: Powers of 2 work best (32x32, 64x64, etc.)
- **Transparency**: Use PNG with alpha channel for best results

### Animation Sheets
- **Layout**: Horizontal sprite sheet (frames side by side)
- **Consistency**: All frames should be the same size
- **Spacing**: No gaps between frames

Example animation sheet layout:
```
[Frame 1][Frame 2][Frame 3][Frame 4]
```

### Audio Files
- **Format**: MP3, WAV, or OGG
- **Size**: Keep under 1MB for web performance
- **Quality**: 128kbps MP3 is usually sufficient

## Tips

### Character Building
1. **Naming Convention**: Use descriptive IDs like `hero_001`, `enemy_goblin`, etc.
2. **Consistent Sizes**: Keep character sizes consistent within your game
3. **Animation Timing**: 100ms per frame (10 FPS) works well for pixel art
4. **Asset Organization**: Store all character assets in a dedicated folder
5. **Version Control**: Save character JSON files in your project repository

### Map Building
1. **Start Simple**: Begin with a small map and expand
2. **Layer Strategy**: Ground → Objects → Collision → Foreground
3. **Test Frequently**: Export and test maps in your game regularly
4. **Tile Variety**: Use 5-10 different tile types for visual interest
5. **Performance**: Keep maps under 100x100 tiles for best performance
6. **Backup**: Save map JSON files frequently during editing

## File Structure

```
character-builder/
├── src/
│   └── server.js              # Express server
├── public/
│   ├── index.html             # Main navigation page
│   ├── character-builder.js   # Character builder logic
│   ├── map-builder.html       # Map builder UI
│   └── map-builder.js         # Map builder logic
├── package.json
└── README.md
```

## API Endpoints

### POST /api/save-character
Save character data to the server (can be extended for database storage)

**Request Body:**
```json
{
  "name": "Hero",
  "id": "hero_001",
  "sprite": { "filename": "...", "data": "..." },
  "stats": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Character data saved successfully",
  "data": { ... }
}
```

## Extending the Tool

### Adding Custom Fields
Edit `public/index.html` to add new form fields, then update `public/character-builder.js` to include them in the output.

### Database Integration
Modify `src/server.js` to save character data to a database instead of just logging it.

### Asset Storage
Implement file upload to a CDN or server storage for permanent asset hosting.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Support

For issues or questions, please refer to the main games-base repository documentation.
