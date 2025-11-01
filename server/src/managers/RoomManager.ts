/**
 * Room Manager - Manages game rooms
 */

import { Room, Player, GameState } from '../core/types';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  /**
   * Create a new room
   */
  createRoom(id: string, name: string, maxPlayers: number = 10): Room {
    const room: Room = {
      id,
      name,
      maxPlayers,
      players: new Map(),
      state: {
        tick: 0,
        timestamp: Date.now(),
        data: {}
      },
      created: Date.now()
    };

    this.rooms.set(id, room);
    return room;
  }

  /**
   * Get room by id
   */
  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  /**
   * Get all rooms
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Add player to room
   */
  addPlayer(roomId: string, player: Player): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    if (room.players.size >= room.maxPlayers) {
      return false;
    }

    room.players.set(player.id, player);
    return true;
  }

  /**
   * Remove player from room
   */
  removePlayer(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    return room.players.delete(playerId);
  }

  /**
   * Get players in room
   */
  getRoomPlayers(roomId: string): Player[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.players.values());
  }

  /**
   * Update room state
   */
  updateRoomState(roomId: string, stateData: Record<string, any>): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.state.tick++;
    room.state.timestamp = Date.now();
    room.state.data = { ...room.state.data, ...stateData };
    return true;
  }

  /**
   * Get room state
   */
  getRoomState(roomId: string): GameState | undefined {
    const room = this.rooms.get(roomId);
    return room?.state;
  }

  /**
   * Remove room
   */
  removeRoom(id: string): boolean {
    return this.rooms.delete(id);
  }

  /**
   * Get available rooms (not full)
   */
  getAvailableRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(
      room => room.players.size < room.maxPlayers
    );
  }

  /**
   * Get room count
   */
  getRoomCount(): number {
    return this.rooms.size;
  }

  /**
   * Clear all rooms
   */
  clear(): void {
    this.rooms.clear();
  }
}
