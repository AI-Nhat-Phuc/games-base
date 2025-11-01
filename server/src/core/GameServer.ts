/**
 * Game Server - Main server class using WebSocket
 */

import { WebSocketServer, WebSocket } from 'ws';
import { PlayerManager } from '../managers/PlayerManager';
import { RoomManager } from '../managers/RoomManager';
import { GameStateManager } from '../managers/GameStateManager';
import { Message, MessageType, Player } from './types';

export interface ServerConfig {
  port: number;
  host?: string;
  tickRate?: number;
  maxRooms?: number;
  stateSyncFrequency?: number; // State sync updates per second (default: 10)
}

export class GameServer {
  private config: ServerConfig;
  private wss: WebSocketServer | null = null;
  private playerManager: PlayerManager;
  private roomManager: RoomManager;
  private gameStateManager: GameStateManager;
  private clients: Map<string, WebSocket> = new Map();
  private readonly STATE_SYNC_FREQUENCY: number;

  constructor(config: ServerConfig) {
    this.config = {
      host: 'localhost',
      tickRate: 30,
      maxRooms: 100,
      stateSyncFrequency: 10,
      ...config
    };
    this.STATE_SYNC_FREQUENCY = this.config.stateSyncFrequency!;

    this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
    this.gameStateManager = new GameStateManager(
      { tickRate: this.config.tickRate! },
      this.roomManager,
      this.playerManager
    );
  }

  /**
   * Start the server
   */
  start(): void {
    this.wss = new WebSocketServer({
      port: this.config.port,
      host: this.config.host
    });

    console.log(`Game server starting on ${this.config.host}:${this.config.port}`);

    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
    });

    this.wss.on('listening', () => {
      console.log(`Game server listening on ${this.config.host}:${this.config.port}`);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    // Start game state manager
    this.gameStateManager.start();

    // Setup periodic state sync
    setInterval(() => {
      this.broadcastState();
    }, 1000 / this.STATE_SYNC_FREQUENCY);
  }

  /**
   * Stop the server
   */
  stop(): void {
    if (this.wss) {
      this.gameStateManager.stop();
      this.wss.close();
      this.wss = null;
      console.log('Game server stopped');
    }
  }

  /**
   * Handle new client connection
   */
  private handleConnection(ws: WebSocket): void {
    const clientId = this.generateClientId();
    this.clients.set(clientId, ws);

    console.log(`Client connected: ${clientId}`);

    ws.on('message', (data: Buffer) => {
      try {
        const message: Message = JSON.parse(data.toString());
        this.handleMessage(clientId, message, ws);
      } catch (error) {
        console.error('Error parsing message:', error);
        this.sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      this.handleDisconnect(clientId);
      this.clients.delete(clientId);
    });

    ws.on('error', (error) => {
      console.error(`Client error (${clientId}):`, error);
    });

    // Send welcome message
    this.send(ws, {
      type: MessageType.JOIN,
      playerId: clientId,
      data: { message: 'Connected to game server' },
      timestamp: Date.now()
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(clientId: string, message: Message, ws: WebSocket): void {
    switch (message.type) {
      case MessageType.JOIN:
        this.handleJoin(clientId, message, ws);
        break;
      case MessageType.LEAVE:
        this.handleLeave(clientId, message);
        break;
      case MessageType.PLAYER_ACTION:
        this.handlePlayerAction(clientId, message);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handle player join
   */
  private handleJoin(clientId: string, message: Message, ws: WebSocket): void {
    const playerName = message.data?.name || `Player_${clientId.substring(0, 8)}`;
    const player = this.playerManager.createPlayer(clientId, playerName);

    // Create or join default room
    const roomId = message.data?.roomId || 'default';
    let room = this.roomManager.getRoom(roomId);
    
    if (!room) {
      room = this.roomManager.createRoom(roomId, 'Default Room', 10);
    }

    const added = this.roomManager.addPlayer(roomId, player);
    
    if (added) {
      this.send(ws, {
        type: MessageType.JOIN,
        playerId: clientId,
        roomId,
        data: { 
          player,
          room: {
            id: room.id,
            name: room.name,
            playerCount: room.players.size
          }
        },
        timestamp: Date.now()
      });
    } else {
      this.sendError(ws, 'Failed to join room');
    }
  }

  /**
   * Handle player leave
   */
  private handleLeave(clientId: string, message: Message): void {
    const roomId = message.roomId;
    if (roomId) {
      this.roomManager.removePlayer(roomId, clientId);
    }
    this.playerManager.disconnectPlayer(clientId);
  }

  /**
   * Handle player action
   */
  private handlePlayerAction(clientId: string, message: Message): void {
    const { action, data } = message.data || {};

    switch (action) {
      case 'move':
        if (data?.position) {
          this.playerManager.updatePosition(clientId, data.position);
        }
        break;
      case 'updateHealth':
        if (data?.health !== undefined) {
          this.playerManager.updateHealth(clientId, data.health);
        }
        break;
      case 'updateScore':
        if (data?.score !== undefined) {
          this.playerManager.updateScore(clientId, data.score);
        }
        break;
    }
  }

  /**
   * Handle client disconnect
   */
  private handleDisconnect(clientId: string): void {
    // Remove player from all rooms
    const rooms = this.roomManager.getAllRooms();
    for (const room of rooms) {
      this.roomManager.removePlayer(room.id, clientId);
    }

    this.playerManager.disconnectPlayer(clientId);
  }

  /**
   * Broadcast game state to all clients
   */
  private broadcastState(): void {
    const rooms = this.roomManager.getAllRooms();

    for (const room of rooms) {
      const players = this.roomManager.getRoomPlayers(room.id);
      const state = this.roomManager.getRoomState(room.id);

      const stateMessage: Message = {
        type: MessageType.STATE_SYNC,
        roomId: room.id,
        data: {
          players: players.map((p: Player) => ({
            id: p.id,
            name: p.name,
            position: p.position,
            health: p.health,
            score: p.score
          })),
          state
        },
        timestamp: Date.now()
      };

      // Send to all players in room
      for (const player of players) {
        const ws = this.clients.get(player.id);
        if (ws && ws.readyState === WebSocket.OPEN) {
          this.send(ws, stateMessage);
        }
      }
    }
  }

  /**
   * Send message to client
   */
  private send(ws: WebSocket, message: Message): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send error to client
   */
  private sendError(ws: WebSocket, error: string): void {
    this.send(ws, {
      type: MessageType.ERROR,
      data: { error },
      timestamp: Date.now()
    });
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Get server stats
   */
  getStats(): any {
    return {
      playerCount: this.playerManager.getPlayerCount(),
      connectedPlayers: this.playerManager.getConnectedPlayerCount(),
      roomCount: this.roomManager.getRoomCount(),
      clientCount: this.clients.size
    };
  }
}
