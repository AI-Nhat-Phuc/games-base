# Games Base CLI

Command-line tool for creating game projects with the games-base engine.

## Installation

### Global Installation

```bash
npm install -g @pnp/cli
```

Then use directly:
```bash
games-base create my-game
# or
gb create my-game
```

### Use with npx (Recommended)

No installation required! Use directly with npx:

```bash
npx @pnp/cli create my-game
```

### Local Development / Testing

To test locally before publishing:

```bash
cd cli
npm install
npm run build
npm link

# Now you can use it globally
games-base create test-game

# Or test with npx from parent directory
cd ..
npx ./cli create test-game
```

## Commands

### `create <project-name>`

Create a new game project with the games-base engine.

**Options:**
- `-t, --template <template>` - Project template (basic, platformer, topdown) [default: basic]
- `--no-install` - Skip dependency installation

**Example:**
```bash
# Create a new game project
games-base create my-awesome-game

# Create without auto-installing dependencies
games-base create my-game --no-install

# Use alias
gb create my-game
```

**What it creates:**
- Complete project structure with TypeScript
- Credit screen showing "Made with PNP Game Engine"
- Vite dev server configuration
- Character movement with WASD/Arrow keys
- Particle effects system
- Ready-to-run game template

### `build-character`

Build a character with sprite and animations.

**Options:**
- `-n, --name <name>` - Character name [default: "Character"]
- `-s, --sprite <path>` - Path or URL to character sprite
- `--walk <path>` - Path or URL to walk animation
- `--run <path>` - Path or URL to run animation
- `--attack <path>` - Path or URL to attack animation
- `--injured <path>` - Path or URL to injured animation
- `--dead <path>` - Path or URL to dead animation
- `-o, --output <path>` - Output directory [default: "./characters"]

**Example:**
```bash
# Build a character with local files
games-base build-character \
  --name Hero \
  --sprite ./assets/hero.png \
  --walk ./assets/hero_walk.png \
  --run ./assets/hero_run.png \
  --attack ./assets/hero_attack.png \
  --injured ./assets/hero_injured.png \
  --dead ./assets/hero_dead.png \
  --output ./src/characters

# Build a character with URLs
games-base build-character \
  --name Enemy \
  --sprite https://example.com/enemy.png \
  --walk https://example.com/enemy_walk.png \
  --output ./src/characters
```

**What it creates:**
- `<character-name>.json` - Character data file with embedded assets or URLs
- `<character-name>.ts` - TypeScript integration file
- Ready-to-use character loader function

**Usage in your game:**
```typescript
import { loadHero } from './characters/hero';

// In your game initialization
const hero = await loadHero(getGame());
```

## Project Structure

When you create a new project, you get:

```
my-game/
├── src/
│   ├── main.ts          # Main game file
│   ├── credits.ts       # Credit screen (shows "Made with PNP Game Engine")
│   ├── assets/
│   │   ├── images/      # Image assets
│   │   └── sounds/      # Sound assets
│   └── characters/      # Character data files
├── public/              # Static files
├── index.html           # Entry HTML
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json
└── README.md
```

## Quick Start

1. **Create a new game:**
```bash
npx @pnp/cli create my-game
cd my-game
```

2. **Start development server:**
```bash
npm start
```

3. **Build characters:**
```bash
npx games-base build-character \
  --name Player \
  --sprite ./assets/player.png \
  --walk ./assets/player_walk.png \
  --run ./assets/player_run.png
```

4. **Use the character in your game:**
```typescript
import { loadPlayer } from './characters/player';

const player = await loadPlayer(getGame());
```

## Features

### Credit Screen

All projects created with the CLI include an automatic credit screen that displays:
- "Made with"
- "PNP Game Engine" (highlighted in green)
- "Press any key to start"

The credit screen:
- Fades in smoothly
- Shows for 2 seconds
- Fades out automatically
- Can be skipped by pressing any key or clicking

### Character System

The build-character command supports:
- **5 standard animations**: walk, run, attack, injured, dead
- **Local files**: Embed images directly in the character file
- **Remote URLs**: Reference external image URLs
- **Auto-generation**: Creates TypeScript integration code automatically

### Simple Architecture

All projects use a simple singleton pattern for easy access:
```typescript
import { initGame, getGame } from '@pnp/game-core-client';

// Initialize once
initGame({ canvasId: 'gameCanvas', width: 800, height: 600 });

// Access anywhere
const characterBuilder = getGame().getCharacterBuilder();
```

## Development

To work on the CLI itself:

```bash
cd cli
npm install
npm run build

# Test locally
npm link
games-base create test-game
```

## Requirements

- Node.js 18 or higher
- npm or yarn

## License

MIT
