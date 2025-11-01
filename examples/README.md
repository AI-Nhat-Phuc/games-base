# Examples

This directory contains example implementations of the games-base engine.

## Available Examples

### client-demo.html

A standalone HTML demo showing the client engine capabilities:
- 2D character movement with WASD/Arrow keys
- Particle effects (explosions, sparkles)
- Grid-based map rendering
- Interactive canvas controls

**How to run:**
1. Open `client-demo.html` directly in a modern web browser
2. No build step required - it's a self-contained demo

### Full Stack Example (Coming Soon)

A complete example showing client-server integration with:
- Client-side rendering using the base engine
- Server-side game state management
- WebSocket communication
- Multiplayer synchronization

## Creating Your Own Game

### Basic Client Game

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script type="module">
    import { 
      GameEngine, 
      MapBuilder, 
      CharacterBuilder, 
      EffectBuilder,
      InputManager
    } from '../base/dist/index.js';

    // Create game engine
    const engine = new GameEngine({
      canvasId: 'gameCanvas',
      width: 800,
      height: 600,
      backgroundColor: '#1a1a2e'
    });

    // Create builders
    const mapBuilder = new MapBuilder();
    const characterBuilder = new CharacterBuilder();
    const effectBuilder = new EffectBuilder();
    const inputManager = new InputManager(engine.getCanvas());

    // Build your game...
    
    engine.start();
  </script>
</body>
</html>
```

### Client with Server Connection

```javascript
// Connect to game server
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'join',
    data: { name: 'Player1' },
    timestamp: Date.now()
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'state_sync') {
    // Update game state from server
    updateGameState(message.data);
  }
};

// Send player position to server
function sendPosition(x, y) {
  ws.send(JSON.stringify({
    type: 'player_action',
    data: {
      action: 'move',
      data: { position: { x, y } }
    },
    timestamp: Date.now()
  }));
}
```

## Tips

1. **Performance**: Keep your game loop optimized by only rendering what's visible
2. **Assets**: Preload all images and sounds before starting the game
3. **State Management**: Use the server for authoritative game state in multiplayer
4. **Testing**: Test on different browsers and devices for compatibility

## Need Help?

Check the documentation in `/docs`:
- `CLIENT_API.md` - Client engine API reference
- `SERVER_API.md` - Server engine API reference
