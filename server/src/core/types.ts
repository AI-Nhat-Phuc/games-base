/**
 * Server core types
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  position: Vector2D;
  health: number;
  score: number;
  connected: boolean;
  lastUpdate: number;
}

export interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  players: Map<string, Player>;
  state: GameState;
  created: number;
}

export interface GameState {
  tick: number;
  timestamp: number;
  data: Record<string, any>;
}

export enum MessageType {
  JOIN = 'join',
  LEAVE = 'leave',
  UPDATE = 'update',
  STATE_SYNC = 'state_sync',
  PLAYER_ACTION = 'player_action',
  ERROR = 'error'
}

export interface Message {
  type: MessageType;
  playerId?: string;
  roomId?: string;
  data?: any;
  timestamp: number;
}
