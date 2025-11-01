/**
 * Player Manager - Manages player connections and state
 */

import { Player, Vector2D } from '../core/types';

export class PlayerManager {
  private players: Map<string, Player> = new Map();

  /**
   * Create a new player
   */
  createPlayer(id: string, name: string): Player {
    const player: Player = {
      id,
      name,
      position: { x: 0, y: 0 },
      health: 100,
      score: 0,
      connected: true,
      lastUpdate: Date.now()
    };

    this.players.set(id, player);
    return player;
  }

  /**
   * Get player by id
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  /**
   * Get all players
   */
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  /**
   * Get connected players
   */
  getConnectedPlayers(): Player[] {
    return Array.from(this.players.values()).filter(p => p.connected);
  }

  /**
   * Update player position
   */
  updatePosition(id: string, position: Vector2D): boolean {
    const player = this.players.get(id);
    if (!player) return false;

    player.position = position;
    player.lastUpdate = Date.now();
    return true;
  }

  /**
   * Update player health
   */
  updateHealth(id: string, health: number): boolean {
    const player = this.players.get(id);
    if (!player) return false;

    player.health = Math.max(0, Math.min(100, health));
    player.lastUpdate = Date.now();
    return true;
  }

  /**
   * Update player score
   */
  updateScore(id: string, score: number): boolean {
    const player = this.players.get(id);
    if (!player) return false;

    player.score = score;
    player.lastUpdate = Date.now();
    return true;
  }

  /**
   * Disconnect player
   */
  disconnectPlayer(id: string): boolean {
    const player = this.players.get(id);
    if (!player) return false;

    player.connected = false;
    player.lastUpdate = Date.now();
    return true;
  }

  /**
   * Remove player
   */
  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  /**
   * Clear all players
   */
  clear(): void {
    this.players.clear();
  }

  /**
   * Get player count
   */
  getPlayerCount(): number {
    return this.players.size;
  }

  /**
   * Get connected player count
   */
  getConnectedPlayerCount(): number {
    return this.getConnectedPlayers().length;
  }
}
