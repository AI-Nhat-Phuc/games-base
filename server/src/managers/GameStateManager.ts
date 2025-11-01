/**
 * Game State Manager - Manages overall game state and updates
 */

import { GameState } from '../core/types';
import { RoomManager } from './RoomManager';
import { PlayerManager } from './PlayerManager';

export interface GameConfig {
  tickRate: number; // Updates per second
  autoSaveInterval?: number; // Auto-save interval in ms
  disconnectTimeout?: number; // Timeout for disconnected players in ms (default: 60000)
}

export class GameStateManager {
  private config: GameConfig;
  private roomManager: RoomManager;
  private playerManager: PlayerManager;
  private running: boolean = false;
  private tickInterval: NodeJS.Timeout | null = null;
  private lastTick: number = 0;
  private readonly DISCONNECT_TIMEOUT: number;

  constructor(config: GameConfig, roomManager: RoomManager, playerManager: PlayerManager) {
    this.config = config;
    this.roomManager = roomManager;
    this.playerManager = playerManager;
    this.DISCONNECT_TIMEOUT = config.disconnectTimeout || 60000; // Default 60 seconds
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTick = Date.now();

    const tickInterval = 1000 / this.config.tickRate;
    this.tickInterval = setInterval(() => {
      this.tick();
    }, tickInterval);

    console.log(`Game state manager started at ${this.config.tickRate} ticks/sec`);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running) return;

    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    console.log('Game state manager stopped');
  }

  /**
   * Main game tick
   */
  private tick(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastTick) / 1000;
    this.lastTick = now;

    // Update all rooms
    const rooms = this.roomManager.getAllRooms();
    for (const room of rooms) {
      this.updateRoom(room.id, deltaTime);
    }

    // Clean up disconnected players
    this.cleanupDisconnectedPlayers();
  }

  /**
   * Update a specific room
   */
  private updateRoom(roomId: string, deltaTime: number): void {
    const room = this.roomManager.getRoom(roomId);
    if (!room) return;

    // Update room state
    this.roomManager.updateRoomState(roomId, {
      lastUpdate: Date.now(),
      deltaTime
    });

    // Custom game logic can be added here
  }

  /**
   * Clean up disconnected players
   */
  private cleanupDisconnectedPlayers(): void {
    const players = this.playerManager.getAllPlayers();
    const now = Date.now();

    for (const player of players) {
      if (!player.connected && (now - player.lastUpdate) > this.DISCONNECT_TIMEOUT) {
        this.playerManager.removePlayer(player.id);
      }
    }
  }

  /**
   * Get global game state
   */
  getGlobalState(): GameState {
    return {
      tick: 0,
      timestamp: Date.now(),
      data: {
        playerCount: this.playerManager.getPlayerCount(),
        roomCount: this.roomManager.getRoomCount(),
        connectedPlayers: this.playerManager.getConnectedPlayerCount()
      }
    };
  }

  /**
   * Check if game is running
   */
  isRunning(): boolean {
    return this.running;
  }
}
