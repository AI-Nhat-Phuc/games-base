# Using Games Base CLI with npx

## What is npx?

`npx` is a package runner tool that comes with npm 5.2+. It allows you to run npm packages without installing them globally.

## Using the CLI with npx

### 1. Create a New Game Project

```bash
npx @nhatphucpham/cli create my-game
```

This will:
- Download the CLI tool temporarily (if not cached)
- Create a new game project called `my-game`
- Set up the complete project structure
- Install all dependencies
- Include the credit screen

### 2. Navigate and Start

```bash
cd my-game
npm start
```

Your game will open in the browser at `http://localhost:3000` with:
- ✅ Credit screen showing "Made with PNP Game Engine"
- ✅ Character movement (WASD/Arrow keys)
- ✅ Particle effects (Space key)

### 3. Build Characters

```bash
npx @nhatphucpham/cli build-character \
  --name Hero \
  --sprite ./assets/hero.png \
  --walk ./assets/hero_walk.png \
  --run ./assets/hero_run.png \
  --attack ./assets/hero_attack.png \
  --injured ./assets/hero_injured.png \
  --dead ./assets/hero_dead.png \
  --output ./src/characters
```

## Local Testing (Before Publishing)

If you want to test the CLI locally before it's published to npm:

### Method 1: npm link

```bash
cd cli
npm install
npm run build
npm link

# Now use it globally
games-base create test-game
```

### Method 2: Direct Path with npx

```bash
# From the repository root
npx ./cli create test-game
```

### Method 3: Local Package

```bash
# From within a project directory
npx /absolute/path/to/games-base/cli create test-game
```

## Publishing to npm

To make the CLI available via `npx @nhatphucpham/cli`:

1. **Ensure you're logged in to npm:**
   ```bash
   npm login
   ```

2. **Build the CLI:**
   ```bash
   cd cli
   npm run build
   ```

3. **Publish:**
   ```bash
   npm publish --access public
   ```

4. **Now anyone can use it:**
   ```bash
   npx @nhatphucpham/cli create my-game
   ```

## Package Structure for npx

The package is configured to work with npx through:

- **package.json `bin` field**: Points to executable scripts
  ```json
  "bin": {
    "games-base": "./bin/games-base.js",
    "gb": "./bin/games-base.js"
  }
  ```

- **Shebang in bin file**: `#!/usr/bin/env node`

- **files field**: Ensures only necessary files are included:
  ```json
  "files": [
    "bin",
    "dist",
    "templates",
    "README.md"
  ]
  ```

- **prepare script**: Automatically builds when installing:
  ```json
  "scripts": {
    "prepare": "npm run build"
  }
  ```

## Troubleshooting

### CLI Not Found

If `npx @nhatphucpham/cli` doesn't work:
- Check if the package is published: `npm view @nhatphucpham/cli`
- Try clearing npx cache: `npx clear-npx-cache`
- Use the full path for local testing: `npx /path/to/cli`

### Permission Denied

If you get permission errors:
```bash
chmod +x cli/bin/games-base.js
```

### Module Not Found

If imports fail:
```bash
cd cli
rm -rf node_modules
npm install
npm run build
```

## Examples

### Quick Start

```bash
# Create and run a game in 3 commands
npx @nhatphucpham/cli create awesome-game
cd awesome-game
npm start
```

### Create with Custom Options

```bash
# Skip auto-install
npx @nhatphucpham/cli create my-game --no-install

cd my-game
npm install
npm start
```

### Build Multiple Characters

```bash
# Hero character
npx @nhatphucpham/cli build-character \
  --name Hero \
  --sprite ./assets/hero.png \
  --walk ./assets/hero_walk.png

# Enemy character
npx @nhatphucpham/cli build-character \
  --name Goblin \
  --sprite ./assets/goblin.png \
  --attack ./assets/goblin_attack.png \
  --dead ./assets/goblin_dead.png
```

## Advanced Usage

### Using Aliases

After global install:
```bash
npm install -g @nhatphucpham/cli

# Use short alias
gb create my-game
gb build-character --name Player
```

### CI/CD Integration

```yaml
# .github/workflows/create-game.yml
- name: Create Game Project
  run: npx @nhatphucpham/cli create game-project --no-install
```

### Docker

```dockerfile
RUN npx @nhatphucpham/cli create game \
    && cd game \
    && npm install \
    && npm run build
```
