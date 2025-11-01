# Workflow: Character Builder → Base Engine

This document explains how to use the Character Builder tool to create characters for your game.

## Complete Workflow

### Step 1: Create Character in Builder

1. Start the Character Builder:
```bash
cd character-builder
npm install
npm start
```

2. Open http://localhost:3000 in your browser

3. Fill in character information:
   - Name: "Warrior"
   - ID: "warrior_001"
   - Description: "A strong melee fighter"

4. Upload assets:
   - **Sprite**: warrior_idle.png (32x32)
   - **Animation Sheet**: warrior_walk.png (128x32, 4 frames)
   - **Voice**: warrior_attack.mp3

5. Configure stats:
   - Health: 150
   - Max Health: 150
   - Speed: 180
   - Strength: 15
   - Defense: 8

6. Set animation config:
   - Frame Count: 4
   - Frame Width: 32
   - Frame Height: 32
   - Frame Duration: 100ms

7. Click "Generate Character Data"

8. Click "Download Character Data" → saves `warrior_001.json`

### Step 2: Use in Your Game

#### A. Save assets to your project

```
my-game/
├── assets/
│   └── characters/
│       └── warrior/
│           ├── warrior_idle.png
│           ├── warrior_walk.png
│           └── warrior_attack.mp3
└── characters/
    └── warrior_001.json
```

#### B. Load the character data

```typescript
import { GameEngine, CharacterBuilder, AssetLoader } from '@games-base/client';

// Load character metadata
const characterData = await fetch('/characters/warrior_001.json')
  .then(res => res.json());

// Create builders
const assetLoader = new AssetLoader();
const characterBuilder = new CharacterBuilder();

// Load assets from the metadata
const spriteFile = characterData.assets.sprite;
const animationFile = characterData.assets.animationSheet;
const voiceFile = characterData.assets.voice;

await assetLoader.loadImage(
  'warrior_sprite', 
  `/assets/characters/warrior/${spriteFile}`
);
await assetLoader.loadImage(
  'warrior_animation', 
  `/assets/characters/warrior/${animationFile}`
);
await assetLoader.loadSound(
  'warrior_voice', 
  `/assets/characters/warrior/${voiceFile}`
);

// Wait for all assets
await assetLoader.waitForAll();
```

#### C. Create the character

```typescript
// Create character using the metadata
const warrior = characterBuilder.createCharacter(
  characterData.metadata.id,
  characterData.metadata.name,
  { x: 100, y: 100 }, // Starting position
  characterData.metadata.size,
  characterData.metadata.stats
);

// Set sprite
const spriteImage = assetLoader.getImage('warrior_sprite');
characterBuilder.setSprite(warrior.id, {
  image: spriteImage,
  size: characterData.metadata.size
});

// Add animation
const animationImage = assetLoader.getImage('warrior_animation');
const animation = {
  name: 'walk',
  frames: [],
  loop: true
};

// Generate frames from the animation config
const config = characterData.metadata.animation;
for (let i = 0; i < config.frameCount; i++) {
  animation.frames.push({
    sprite: {
      image: animationImage,
      sourceRect: {
        x: i * config.frameWidth,
        y: 0,
        width: config.frameWidth,
        height: config.frameHeight
      },
      size: {
        width: config.frameWidth,
        height: config.frameHeight
      }
    },
    duration: config.frameDuration
  });
}

characterBuilder.addAnimation(warrior.id, animation);
characterBuilder.setAnimation(warrior.id, 'walk');
```

#### D. Use in game loop

```typescript
class MyGame extends GameEngine {
  constructor(config) {
    super(config);
  }

  update(deltaTime) {
    // Update character
    characterBuilder.update(warrior, deltaTime);
    
    // Handle movement with input
    if (inputManager.isKeyPressed('ArrowRight')) {
      characterBuilder.moveCharacter(
        warrior.id, 
        warrior.stats.speed * deltaTime, 
        0
      );
    }
  }

  render() {
    const ctx = this.getContext();
    
    // Render the character
    characterBuilder.render(ctx, warrior);
  }
}
```

## Advantages of This Workflow

✅ **Separation of Concerns**
- Character creation = Visual tool
- Game logic = Base engine
- No mixing of concerns

✅ **Team Friendly**
- Artists use the Character Builder
- Programmers use the base engine
- Clear handoff via JSON files

✅ **Reusability**
- Create characters once
- Use in multiple games
- Share character packs

✅ **Version Control**
- JSON files are git-friendly
- Easy to track changes
- Simple to review

✅ **No Code Changes**
- Base engine stays unchanged
- Tool generates compatible data
- Clean architecture

## Character JSON Structure

```json
{
  "metadata": {
    "id": "warrior_001",
    "name": "Warrior",
    "description": "A strong melee fighter",
    "stats": {
      "health": 150,
      "maxHealth": 150,
      "speed": 180,
      "strength": 15,
      "defense": 8,
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
    "generatedAt": "2025-11-01T12:00:00.000Z"
  },
  "assets": {
    "sprite": {
      "filename": "warrior_idle.png",
      "data": "data:image/png;base64,...",
      "type": "image/png",
      "size": 2048
    },
    "animationSheet": {
      "filename": "warrior_walk.png",
      "data": "data:image/png;base64,...",
      "type": "image/png",
      "size": 4096
    },
    "voice": {
      "filename": "warrior_attack.mp3",
      "data": "data:audio/mp3;base64,...",
      "type": "audio/mp3",
      "size": 8192
    }
  }
}
```

## Tips

1. **Naming Convention**: Use consistent IDs like `{type}_{number}` (e.g., warrior_001, mage_001)
2. **Asset Organization**: Keep character assets in dedicated folders
3. **Version Control**: Commit both JSON files and assets
4. **File Sizes**: Keep sprites small for web performance
5. **Animation Sheets**: Use horizontal layouts (frames side by side)
6. **Testing**: Test characters in isolation before integration

## Extending the Workflow

### Adding Custom Properties

Edit the Character Builder to add custom fields:

1. Add input field in `public/index.html`
2. Capture value in `public/character-builder.js`
3. Include in JSON output
4. Use in your game code

### Automation

Create build scripts to:
- Batch process multiple characters
- Optimize asset files
- Generate TypeScript types
- Validate character data

### Integration with CI/CD

```yaml
# .github/workflows/characters.yml
name: Validate Characters
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate character JSON
        run: |
          for file in characters/*.json; do
            node -e "JSON.parse(require('fs').readFileSync('$file'))"
          done
```

## Summary

The Character Builder provides a clean workflow:
1. **Create** characters visually in the tool
2. **Export** as JSON with embedded assets
3. **Load** in your game using the base engine
4. **Render** using the CharacterBuilder API

No code changes to `/base` required! 🎮
