# Character Builder Tool

A web-based tool for creating and configuring game characters for the games-base engine. This tool provides a user-friendly interface to design characters with sprites, animations, and audio, then automatically generates the data needed by the base engine.

## Features

### Visual Interface
- **Sprite Upload**: Add character sprite images
- **Animation Sheet Upload**: Upload sprite sheets for character animations
- **Voice/Audio Upload**: Add sound effects or voice lines
- **Real-time Preview**: See your assets as you upload them

### Character Configuration
- **Basic Info**: Name, ID, and description
- **Stats System**: Health, speed, strength, defense, and level
- **Dimensions**: Configurable character size
- **Animation Settings**: Frame count, frame size, and duration

### Output Generation
- **JSON Format**: Export character data as JSON
- **TypeScript Code**: Generate ready-to-use TypeScript integration code
- **Downloadable Package**: Save all character data including assets

## Getting Started

### Installation

```bash
cd character-builder
npm install
```

### Running the Tool

```bash
npm start
```

The character builder will start at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## How to Use

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

## Output Format

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
import { CharacterBuilder, AssetLoader } from '@games-base/client';

const assetLoader = new AssetLoader();
const characterBuilder = new CharacterBuilder();

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

## Asset Guidelines

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

1. **Naming Convention**: Use descriptive IDs like `hero_001`, `enemy_goblin`, etc.
2. **Consistent Sizes**: Keep character sizes consistent within your game
3. **Animation Timing**: 100ms per frame (10 FPS) works well for pixel art
4. **Asset Organization**: Store all character assets in a dedicated folder
5. **Version Control**: Save character JSON files in your project repository

## File Structure

```
character-builder/
├── src/
│   └── server.js          # Express server
├── public/
│   ├── index.html         # Main UI
│   └── character-builder.js  # Client-side logic
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
