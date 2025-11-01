# Quick Start Guide

Get started with games-base in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of JavaScript/TypeScript

## Installation

### 1. Clone and Setup

```bash
git clone https://github.com/AI-Nhat-Phuc/games-base.git
cd games-base
```

### 2. Build Client Engine

```bash
cd base
npm install
npm run build
cd ..
```

### 3. Build Server Engine

```bash
cd server
npm install
npm run build
cd ..
```

## Try the Demo

Open `examples/client-demo.html` in your web browser to see the engine in action!

**Controls:**
- WASD or Arrow Keys: Move the character
- Click anywhere: Create sparkle effects
- "Create Explosion" button: Trigger explosion effect
- "Toggle Map" button: Show/hide grid

## Create Your First Game

### Step 1: Create HTML File

```bash
mkdir my-game
cd my-game
```

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Game</title>
  <style>
    body { margin: 0; padding: 0; background: #222; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { border: 2px solid #fff; }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  <script type="module" src="game.js"></script>
</body>
</html>
```

### Step 2: Create Game Script

Create `game.js`:

```javascript
import { 
  GameEngine, 
  CharacterBuilder, 
  EffectBuilder,
  InputManager 
} from '../base/dist/index.js';

// Create game engine
const engine = new GameEngine({
  canvasId: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e'
});

// Create character builder
const characterBuilder = new CharacterBuilder();
const player = characterBuilder.createCharacter(
  'player1',
  'Hero',
  { x: 400, y: 300 },
  { width: 32, height: 32 },
  { health: 100, maxHealth: 100, speed: 200 }
);

// Create effect builder
const effectBuilder = new EffectBuilder();

// Create input manager
const inputManager = new InputManager(engine.getCanvas());

// Custom game class
class MyGame extends GameEngine {
  constructor(config) {
    super(config);
  }

  update(deltaTime) {
    // Handle input
    if (inputManager.isKeyPressed('KeyW') || inputManager.isKeyPressed('ArrowUp')) {
      characterBuilder.moveCharacter('player1', 0, -player.stats.speed * deltaTime);
    }
    if (inputManager.isKeyPressed('KeyS') || inputManager.isKeyPressed('ArrowDown')) {
      characterBuilder.moveCharacter('player1', 0, player.stats.speed * deltaTime);
    }
    if (inputManager.isKeyPressed('KeyA') || inputManager.isKeyPressed('ArrowLeft')) {
      characterBuilder.moveCharacter('player1', -player.stats.speed * deltaTime, 0);
    }
    if (inputManager.isKeyPressed('KeyD') || inputManager.isKeyPressed('ArrowRight')) {
      characterBuilder.moveCharacter('player1', player.stats.speed * deltaTime, 0);
    }

    // Update effects
    effectBuilder.update(deltaTime);
  }

  render() {
    const ctx = this.getContext();
    
    // Render character
    characterBuilder.render(ctx, player);
    
    // Render effects
    effectBuilder.render(ctx);
  }
}

// Start the game
const game = new MyGame({
  canvasId: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e'
});

game.start();

// Add click to create effects
engine.getCanvas().addEventListener('click', (e) => {
  const rect = engine.getCanvas().getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  effectBuilder.createSparkle({ x, y }, { r: 0.3, g: 0.7, b: 1.0 });
});

console.log('Game started!');
```

### Step 3: Run Your Game

Open `index.html` in your browser. You should see your game running!

## Add Multiplayer

### Step 1: Start the Server

```bash
cd server
npm start
```

The server will start on `http://localhost:8080`

### Step 2: Connect from Client

Add this to your game.js:

```javascript
// Connect to server
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected to server');
  ws.send(JSON.stringify({
    type: 'join',
    data: { name: 'Player1' },
    timestamp: Date.now()
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Server message:', message);
  
  if (message.type === 'state_sync') {
    // Update game state from server
    const players = message.data.players;
    // Render other players...
  }
};

// Send position updates
function sendPosition() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'player_action',
      data: {
        action: 'move',
        data: { position: player.transform.position }
      },
      timestamp: Date.now()
    }));
  }
}

// Send position every 100ms
setInterval(sendPosition, 100);
```

## Next Steps

1. **Read the Documentation**
   - [Client API Reference](../docs/CLIENT_API.md)
   - [Server API Reference](../docs/SERVER_API.md)

2. **Explore Examples**
   - Check out `examples/` directory for more examples

3. **Build Something Cool**
   - Platformer game
   - Top-down shooter
   - RPG adventure
   - Puzzle game

4. **Join the Community**
   - Share your creations
   - Contribute improvements
   - Help others get started

## Troubleshooting

### Module not found errors
- Make sure you've run `npm install` and `npm run build` in both base/ and server/
- Check that your import paths are correct

### Canvas not showing
- Verify the canvas ID matches in HTML and JavaScript
- Check browser console for errors
- Make sure the canvas element exists before creating the engine

### Server connection fails
- Ensure the server is running (`npm start` in server/)
- Check the WebSocket URL matches your server address
- Look for CORS or firewall issues

### Game runs slowly
- Reduce particle counts in effects
- Limit the number of objects being rendered
- Use sprites instead of drawing shapes
- Consider using object pooling for frequently created/destroyed objects

## Get Help

- Check the [documentation](../docs/)
- Look at [examples](../examples/)
- Open an issue on GitHub
- Read the [security guidelines](../docs/SECURITY.md)

Happy game development! 🎮
