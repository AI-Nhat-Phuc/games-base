# PNP Game Engine - Monorepo Structure

This repository is organized as a monorepo containing multiple packages under the `@pnp` scope.

## Packages

### @pnp/client (base/)
**Client-side 2D game engine for web browsers**

- **Package Name**: `@pnp/client`
- **Location**: `/base`
- **Purpose**: Core game engine with rendering, physics, and game loop
- **Usage**: `import { initGame, getGame } from '@pnp/client'`

### @pnp/cli (cli/)
**Command-line tool for project creation and character building**

- **Package Name**: `@pnp/cli`
- **Location**: `/cli`
- **Purpose**: Scaffold new game projects and generate character assets
- **Commands**: 
  - `pnp create <project-name>` - Create new game project
  - `pnp build-character` - Generate character from sprites
- **Usage**: `npx @pnp/cli create my-game`

### @pnp/server (server/)
**Multiplayer game server with WebSocket support**

- **Package Name**: `@pnp/server`
- **Location**: `/server`
- **Purpose**: Handle multiplayer game state and player connections
- **Usage**: `import { GameServer } from '@pnp/server'`

### @pnp/character-builder (character-builder/)
**Visual character creation tool**

- **Package Name**: `@pnp/character-builder`
- **Location**: `/character-builder`
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
cd character-builder && npm publish --access public
```

Or use the GitHub Actions workflow for automated publishing.

## Package Relationships

- **@pnp/cli** → Creates projects that use **@pnp/client**
- **@pnp/character-builder** → Generates data for **@pnp/client**
- **@pnp/client** → Can connect to **@pnp/server** for multiplayer
- **@pnp/server** → Works independently but designed for **@pnp/client** games

## Migration from @games-base

All packages have been renamed from the `@games-base` scope to `@pnp`:

- `@games-base/client` → `@pnp/client`
- `@games-base/cli` → `@pnp/cli`
- `@games-base/server` → `@pnp/server`
- `@games-base/character-builder` → `@pnp/character-builder`

Commands have also been updated:
- `games-base` → `pnp`
- `npx @games-base/cli` → `npx @pnp/cli`
