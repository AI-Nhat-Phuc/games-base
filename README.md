# PNP Game Engine

A comprehensive 2D web game engine with client-side rendering and server-side multiplayer support for easy game development.

## Overview

This repository provides a complete game development platform consisting of:

- **CLI Tool** (`@pnp/cli`): Command-line tool for creating game projects instantly
- **Base/Client Engine** (`@pnp/game-core-client`): A powerful 2D game engine that runs in web browsers
- **Character Builder** (`@pnp/builder`): A visual tool for creating and configuring game characters
- **Server** (`@pnp/game-core-server`): A scalable game server for multiplayer functionality

## 🚀 Quick Start

Create a new game project in seconds:

```bash
npx @pnp/cli create my-game
cd my-game
npm start
```

Your game will include:
- ✅ Credit screen showing "Made with PNP Game Engine"
- ✅ Character movement (WASD/Arrow keys)
- ✅ Particle effects system
- ✅ Full TypeScript support
- ✅ Hot reload with Vite

## ✨ Key Features

### Simple API

**No manual instance management or lifecycle handling required!**

```typescript
// Simple, clean API
import { initGame, getGame } from '@pnp/game-core-client';

initGame({ canvasId: 'game', width: 800, height: 600 });
const builder = getGame().getCharacterBuilder(); // Access anywhere!
```

**Benefits:**
- ✅ Automatic lifecycle management
- ✅ Easy access to game components
- ✅ No need to pass instances around
- ✅ Singleton pattern for global access
- ✅ Clean, maintainable code

## Features

### CLI Tool (`/cli`)

Command-line tool for instant game project creation:

- **Project Generator**: Create complete game projects with one command
- **Credit Screen**: Automatic "Made with PNP Game Engine" credit
- **Character Builder**: Build characters from sprite and 5 animations (walk, run, attack, injured, dead)
- **Asset Support**: Local files or remote URLs
- **TypeScript**: Full type safety out of the box
- **Vite Integration**: Fast development with hot reload

**Usage:**
```bash
# Create project
npx @pnp/cli create my-game

# Build character
games-base build-character \
  --name Hero \
  --sprite ./assets/hero.png \
  --walk ./assets/hero_walk.png \
  --run ./assets/hero_run.png \
  --attack ./assets/hero_attack.png \
  --injured ./assets/hero_injured.png \
  --dead ./assets/hero_dead.png
```

### Client Engine (`/base`)

The client engine provides everything needed to build 2D browser games:

- **Game Engine Core**: Main game loop, canvas rendering, and state management
- **Map Builder**: Create and manage tile-based maps with multiple layers
- **Character Builder**: Define and control game characters with stats and animations
- **Effect Builder**: Create particle effects, explosions, and visual effects
- **Input Manager**: Handle keyboard and mouse input
- **Asset Loader**: Load and manage images and sounds

### Character Builder (`/builders`)

A visual tool for creating game characters without writing code:

- **Visual Interface**: Upload sprites, animation sheets, and audio files
- **Configuration Panel**: Set character stats, dimensions, and animation settings
- **Live Preview**: See your character assets as you upload them
- **Auto-Generation**: Automatically generates JSON data and TypeScript code
- **Export System**: Download character data ready for the base engine

### Server Engine (`/server`)

The server engine handles multiplayer game logic:

- **Game Server**: WebSocket-based server for real-time communication
- **Player Manager**: Track and manage connected players
- **Room Manager**: Create and manage game rooms/lobbies
- **Game State Manager**: Synchronize game state across clients
- **Scalable Architecture**: Designed for local hosting with cloud migration support

## Getting Started

### Client Engine

1. Navigate to the base directory:
```bash
cd base
```

2. Install dependencies:
```bash
npm install
```

3. Build the engine:
```bash
npm run build
```

4. Use in your HTML:
```html
<canvas id="game"></canvas>
<script type="module">
  import { GameEngine, MapBuilder, CharacterBuilder } from './base/dist/index.js';
  
  // Create game engine
  const engine = new GameEngine({
    canvasId: 'game',
    width: 800,
    height: 600,
    backgroundColor: '#000000'
  });
  
  // Build your game...
</script>
```

### Character Builder

1. Navigate to the builders directory:
```bash
cd builders
```

2. Install dependencies:
```bash
npm install
```

3. Start the tool:
```bash
npm start
```

4. Open your browser at `http://localhost:3000` and start creating characters!

The Character Builder provides a visual interface to:
- Upload character sprites and animation sheets
- Configure character stats and properties
- Add voice/sound effects
- Generate JSON data and TypeScript code automatically
- Export character data for use in your games

### Server Engine

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The server will start on port 8080 by default. You can change this with the `PORT` environment variable:
```bash
PORT=3000 npm start
```

## Project Structure

```
games-base/
├── cli/                  # CLI tool for project creation
│   ├── bin/
│   │   └── games-base.js # CLI entry point
│   ├── src/
│   │   └── commands/    # CLI commands
│   ├── package.json
│   └── README.md
├── base/                 # Client game engine
│   ├── src/
│   │   ├── core/        # Core engine components
│   │   ├── builders/    # Map, Character, and Effect builders
│   │   └── utils/       # Utility classes
│   ├── package.json
│   └── tsconfig.json
├── builders/   # Visual character creation tool
│   ├── src/
│   │   └── server.js    # Express server
│   ├── public/
│   │   ├── index.html   # UI interface
│   │   └── builders.js  # Client logic
│   ├── package.json
│   └── README.md
├── server/              # Game server
│   ├── src/
│   │   ├── core/        # Server core and types
│   │   ├── managers/    # Player, Room, and State managers
│   │   └── utils/       # Server utilities
│   ├── package.json
│   └── tsconfig.json
├── examples/            # Example implementations
└── docs/               # Documentation
```

## Development

### Client Engine Development

```bash
cd base
npm run dev  # Watch mode for development
npm run lint # Lint TypeScript files
```

### Server Development

```bash
cd server
npm run dev  # Watch mode for development
npm run lint # Lint TypeScript files
```

## Examples

Check the `/examples` directory for complete working examples:

- `client-demo.html`: Interactive client-side game demo
- More examples coming soon!

## API Documentation

### Client API

#### GameEngine
Main engine class that handles the game loop and rendering.

#### MapBuilder
Create tile-based maps with multiple layers, collision detection, and rendering.

#### CharacterBuilder
Create and manage game characters with sprites, animations, and stats.

#### EffectBuilder
Create particle effects like explosions, trails, and sparkles.

### Server API

#### GameServer
WebSocket server for multiplayer games.

#### PlayerManager
Manage player connections, positions, and stats.

#### RoomManager
Create and manage game rooms with player limits.

#### GameStateManager
Synchronize game state across all connected clients.

## Cloud Deployment

The server is designed to be easily deployable to cloud platforms:

### Heroku
```bash
# Add Procfile
echo "web: npm start" > Procfile
git push heroku main
```

### AWS / Azure / GCP
Use the provided server configuration and deploy as a Node.js application with WebSocket support.

### Docker
```dockerfile
FROM node:20
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0 or higher
- Modern web browser with Canvas and WebSocket support

## License

MIT

## Publishing to NPM

This project includes automated GitHub Actions workflows for publishing packages to npm. See [Publishing Guide](.github/PUBLISHING.md) for detailed instructions.

**Quick Steps:**
1. Add `NPM_TOKEN` to GitHub repository secrets
2. Go to **Actions** → **Publish CLI to NPM**
3. Click **Run workflow** and select package to publish

**Supported Packages:**
- `@pnp/cli` - CLI tool
- `@pnp/game-core-client` - Client engine
- `@pnp/game-core-server` - Server engine

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.