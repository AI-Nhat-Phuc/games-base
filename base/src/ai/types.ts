/**
 * AI NPC Types - Core types and interfaces for AI-controlled NPCs
 */

import { Vector2D } from '../core/types';
import { Character } from '../builders/CharacterBuilder';

/**
 * NPC States for state machine
 */
export type NPCState = 'idle' | 'patrol' | 'chase' | 'attack' | 'flee' | 'interact' | 'custom';

/**
 * AI Behavior configuration
 */
export interface AIBehaviorConfig {
  /** Detection range for player/enemies */
  detectionRange?: number;
  /** Attack range */
  attackRange?: number;
  /** Flee health threshold (percentage) */
  fleeHealthThreshold?: number;
  /** Patrol waypoints */
  patrolPoints?: Vector2D[];
  /** Whether to loop patrol points */
  patrolLoop?: boolean;
  /** Time to wait at each patrol point (ms) */
  patrolWaitTime?: number;
  /** Custom behavior properties */
  customProperties?: Record<string, unknown>;
}

/**
 * AI Behavior interface - base for all behaviors
 */
export interface AIBehavior {
  /** Unique behavior name */
  name: string;
  /** Update behavior (called every frame) */
  update(npc: NPC, deltaTime: number, context: AIContext): void;
  /** Check if behavior can activate */
  canActivate?(npc: NPC, context: AIContext): boolean;
  /** Called when behavior starts */
  onEnter?(npc: NPC): void;
  /** Called when behavior ends */
  onExit?(npc: NPC): void;
}

/**
 * AI Context - information available to behaviors
 */
export interface AIContext {
  /** Player position (if available) */
  playerPosition?: Vector2D;
  /** Other NPCs in the scene */
  otherNPCs?: NPC[];
  /** Current game time */
  gameTime?: number;
  /** Custom context data */
  customData?: Record<string, unknown>;
}

/**
 * NPC Dialog configuration
 */
export interface NPCDialog {
  /** Dialog ID */
  id: string;
  /** Dialog text lines */
  lines: string[];
  /** Next dialog ID (for chaining) */
  nextDialogId?: string;
  /** Dialog choices */
  choices?: NPCDialogChoice[];
}

/**
 * NPC Dialog choice
 */
export interface NPCDialogChoice {
  /** Choice text */
  text: string;
  /** Target dialog ID */
  targetDialogId?: string;
  /** Action to execute when selected */
  action?: string;
}

/**
 * NPC - AI-controlled character
 */
export interface NPC {
  /** Unique NPC ID */
  id: string;
  /** Reference to the underlying Character */
  character: Character;
  /** Current AI state */
  state: NPCState;
  /** AI behavior configuration */
  behaviorConfig: AIBehaviorConfig;
  /** Current active behavior */
  currentBehavior: AIBehavior | null;
  /** Available behaviors */
  behaviors: Map<string, AIBehavior>;
  /** Dialog data (if NPC can talk) */
  dialogs?: Map<string, NPCDialog>;
  /** Current dialog ID */
  currentDialogId?: string;
  /** NPC type/role */
  npcType: NPCType;
  /** Is NPC hostile */
  hostile: boolean;
  /** Custom NPC properties */
  properties: Record<string, unknown>;
}

/**
 * NPC Types
 */
export type NPCType = 'friendly' | 'neutral' | 'hostile' | 'merchant' | 'quest_giver' | 'companion';

/**
 * NPC Creation options
 */
export interface NPCCreationOptions {
  /** NPC type */
  npcType?: NPCType;
  /** Is NPC hostile */
  hostile?: boolean;
  /** AI behavior configuration */
  behaviorConfig?: AIBehaviorConfig;
  /** Initial dialogs */
  dialogs?: NPCDialog[];
  /** Custom properties */
  properties?: Record<string, unknown>;
}
