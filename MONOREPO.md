# PNP Game Engine - Monorepo Structure

This repository is organized as a monorepo containing multiple packages under the `@nhatphucpham` scope.

## Packages

### @nhatphucpham/game-core-client (base/)
**Client-side 2D game engine for web browsers**

- **Package Name**: `@nhatphucpham/game-core-client`
- **Location**: `/base`
- **Purpose**: Core game engine with rendering, physics, and game loop
- **Usage**: `import { initGame, getGame } from '@nhatphucpham/game-core-client'`

### @nhatphucpham/cli (cli/)
**Command-line tool for project creation and character building**

- **Package Name**: `@nhatphucpham/cli`
- **Location**: `/cli`
- **Purpose**: Scaffold new game projects and generate character assets
- **Commands**: 
  - `pnp create <project-name>` - Create new game project
  - `pnp build-character` - Generate character from sprites
- **Usage**: `npx @nhatphucpham/cli create my-game`

### @nhatphucpham/game-core-server (server/)
**Multiplayer game server with WebSocket support**

- **Package Name**: `@nhatphucpham/game-core-server`
- **Location**: `/server`
- **Purpose**: Handle multiplayer game state and player connections
- **Usage**: `import { GameServer } from '@nhatphucpham/game-core-server'`

### @nhatphucpham/builder (builders/)
**Visual character creation tool**

- **Package Name**: `@nhatphucpham/builder`
- **Location**: `/builders`
- **Purpose**: Web-based UI for creating game characters
- **Usage**: Run locally with `npm start`

## Workspace Commands

The root package.json provides workspace commands that run across all packages:

```bash
# Build all packages
npm run build

# Run development mode for all packages
npm run dev

# Lint all packages
npm run lint

# Test all packages
npm run test

# Clean all build artifacts and node_modules
npm run clean
```

## Installation

Install all dependencies across the monorepo:

```bash
npm install
```

This will install dependencies for all workspaces.

## Publishing

Each package can be published independently to npm:

```bash
# Publish CLI
cd cli && npm publish --access public

# Publish Client
cd base && npm publish --access public

# Publish Server
cd server && npm publish --access public

# Publish Character Builder
cd builders && npm publish --access public
```

Or use the GitHub Actions workflow for automated publishing.

## Package Relationships

- **@nhatphucpham/cli** → Creates projects that use **@nhatphucpham/game-core-client**
- **@nhatphucpham/builder** → Generates data for **@nhatphucpham/game-core-client**
- **@nhatphucpham/game-core-client** → Can connect to **@nhatphucpham/game-core-server** for multiplayer
- **@nhatphucpham/game-core-server** → Works independently but designed for **@nhatphucpham/game-core-client** games

## Migration from @games-base

All packages have been renamed from the `@games-base` scope to `@nhatphucpham`:

- `@games-base/client` → `@nhatphucpham/game-core-client`
- `@games-base/cli` → `@nhatphucpham/cli`
- `@games-base/server` → `@nhatphucpham/game-core-server`
- `@games-base/builders` → `@nhatphucpham/builder`

Commands have also been updated:
- `games-base` → `pnp`
- `npx @games-base/cli` → `npx @nhatphucpham/cli`
