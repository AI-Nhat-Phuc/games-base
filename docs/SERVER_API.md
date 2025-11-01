# Server Engine API Documentation

## GameServer

Main server class using WebSocket for real-time multiplayer games.

### Constructor

```typescript
constructor(config: ServerConfig)
```

#### ServerConfig

```typescript
interface ServerConfig {
  port: number;           // Server port
  host?: string;          // Server host (default: 'localhost')
  tickRate?: number;      // Game updates per second (default: 30)
  maxRooms?: number;      // Maximum number of rooms (default: 100)
}
```

### Methods

- `start()`: Start the server
- `stop()`: Stop the server
- `getStats()`: Get server statistics

### Example

```typescript
import { GameServer } from '@nhatphucpham/game-core-server';

const server = new GameServer({
  port: 8080,
  host: '0.0.0.0',
  tickRate: 30
});

server.start();
```

## PlayerManager

Manage player connections and state.

### Methods

- `createPlayer(id, name)`: Create a new player
- `getPlayer(id)`: Get player by ID
- `getAllPlayers()`: Get all players
- `getConnectedPlayers()`: Get only connected players
- `updatePosition(id, position)`: Update player position
- `updateHealth(id, health)`: Update player health
- `updateScore(id, score)`: Update player score
- `disconnectPlayer(id)`: Mark player as disconnected
- `removePlayer(id)`: Remove player completely
- `clear()`: Remove all players
- `getPlayerCount()`: Get total player count
- `getConnectedPlayerCount()`: Get connected player count

### Example

```typescript
import { PlayerManager } from '@nhatphucpham/game-core-server';

const playerManager = new PlayerManager();

const player = playerManager.createPlayer('player123', 'John');
playerManager.updatePosition('player123', { x: 100, y: 200 });
playerManager.updateHealth('player123', 85);
```

## RoomManager

Create and manage game rooms/lobbies.

### Methods

- `createRoom(id, name, maxPlayers)`: Create a new room
- `getRoom(id)`: Get room by ID
- `getAllRooms()`: Get all rooms
- `addPlayer(roomId, player)`: Add player to room
- `removePlayer(roomId, playerId)`: Remove player from room
- `getRoomPlayers(roomId)`: Get all players in room
- `updateRoomState(roomId, stateData)`: Update room game state
- `getRoomState(roomId)`: Get room game state
- `removeRoom(id)`: Remove a room
- `getAvailableRooms()`: Get rooms that aren't full
- `getRoomCount()`: Get total room count
- `clear()`: Remove all rooms

### Example

```typescript
import { RoomManager } from '@nhatphucpham/game-core-server';

const roomManager = new RoomManager();

const room = roomManager.createRoom('lobby1', 'Main Lobby', 10);
roomManager.addPlayer('lobby1', player);
roomManager.updateRoomState('lobby1', { gameStarted: true });
```

## GameStateManager

Synchronize game state across all clients.

### Constructor

```typescript
constructor(config: GameConfig, roomManager: RoomManager, playerManager: PlayerManager)
```

#### GameConfig

```typescript
interface GameConfig {
  tickRate: number;           // Updates per second
  autoSaveInterval?: number;  // Auto-save interval in ms
}
```

### Methods

- `start()`: Start the game loop
- `stop()`: Stop the game loop
- `getGlobalState()`: Get global game state
- `isRunning()`: Check if game loop is running

### Example

```typescript
import { GameStateManager } from '@nhatphucpham/game-core-server';

const gameStateManager = new GameStateManager(
  { tickRate: 30 },
  roomManager,
  playerManager
);

gameStateManager.start();
```

## Message Types

The server uses a message-based protocol:

### MessageType Enum

```typescript
enum MessageType {
  JOIN = 'join',              // Player joins
  LEAVE = 'leave',            // Player leaves
  UPDATE = 'update',          // General update
  STATE_SYNC = 'state_sync',  // State synchronization
  PLAYER_ACTION = 'player_action', // Player action
  ERROR = 'error'             // Error message
}
```

### Message Interface

```typescript
interface Message {
  type: MessageType;
  playerId?: string;
  roomId?: string;
  data?: any;
  timestamp: number;
}
```

## Client Integration

### Connecting to Server

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  // Send join message
  ws.send(JSON.stringify({
    type: 'join',
    data: {
      name: 'Player1',
      roomId: 'lobby1'
    },
    timestamp: Date.now()
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'state_sync':
      // Update game state
      updateGameState(message.data);
      break;
    case 'join':
      console.log('Joined room:', message.data);
      break;
    case 'error':
      console.error('Server error:', message.data.error);
      break;
  }
};

// Send player action
function sendAction(action, data) {
  ws.send(JSON.stringify({
    type: 'player_action',
    data: { action, data },
    timestamp: Date.now()
  }));
}

// Example: Update position
sendAction('move', { position: { x: 100, y: 200 } });
```

## Deployment

### Environment Variables

```bash
PORT=8080              # Server port
NODE_ENV=production    # Environment mode
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### Cloud Platform Examples

#### Heroku

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

#### AWS Elastic Beanstalk

```json
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "your-docker-image",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": "8080"
    }
  ]
}
```
