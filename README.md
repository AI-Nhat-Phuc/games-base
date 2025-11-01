# Games Base

A comprehensive 2D web game engine with client-side rendering and server-side multiplayer support.

## Overview

This repository provides a complete game development platform consisting of:

- **Base (Client Engine)**: A powerful 2D game engine that runs in web browsers
- **Server**: A scalable game server for multiplayer functionality

## Features

### Client Engine (`/base`)

The client engine provides everything needed to build 2D browser games:

- **Game Engine Core**: Main game loop, canvas rendering, and state management
- **Map Builder**: Create and manage tile-based maps with multiple layers
- **Character Builder**: Define and control game characters with stats and animations
- **Effect Builder**: Create particle effects, explosions, and visual effects
- **Input Manager**: Handle keyboard and mouse input
- **Asset Loader**: Load and manage images and sounds

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
├── base/                 # Client game engine
│   ├── src/
│   │   ├── core/        # Core engine components
│   │   ├── builders/    # Map, Character, and Effect builders
│   │   └── utils/       # Utility classes
│   ├── package.json
│   └── tsconfig.json
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

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.