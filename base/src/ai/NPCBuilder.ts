/**
 * NPC Builder - Creates and manages AI-controlled NPCs using Character objects
 */

import { Vector2D, Size } from '../core/types';
import { CharacterBuilder, CharacterStats, Character } from '../builders/CharacterBuilder';
import { 
  NPC, 
  NPCState, 
  NPCType, 
  NPCCreationOptions, 
  AIBehavior, 
  AIBehaviorConfig, 
  AIContext,
  NPCDialog 
} from './types';
import { IdleBehavior } from './behaviors';

/**
 * NPC Builder - Creates and manages AI-controlled NPCs
 * Uses CharacterBuilder internally for character management
 */
export class NPCBuilder {
  private npcs: Map<string, NPC> = new Map();
  private characterBuilder: CharacterBuilder;

  constructor(characterBuilder?: CharacterBuilder) {
    this.characterBuilder = characterBuilder || new CharacterBuilder();
  }

  /**
   * Create a new NPC from scratch
   */
  createNPC(
    id: string,
    name: string,
    position: Vector2D,
    size: Size,
    stats: CharacterStats,
    options: NPCCreationOptions = {}
  ): NPC {
    // Create underlying character using CharacterBuilder
    const character = this.characterBuilder.createCharacter(id, name, position, size, stats);

    // Create NPC with AI capabilities
    const npc: NPC = {
      id,
      character,
      state: 'idle',
      behaviorConfig: options.behaviorConfig || {},
      currentBehavior: null,
      behaviors: new Map(),
      dialogs: new Map(),
      npcType: options.npcType || 'neutral',
      hostile: options.hostile ?? false,
      properties: options.properties || {}
    };

    // Add default idle behavior
    npc.behaviors.set('idle', new IdleBehavior());
    npc.currentBehavior = npc.behaviors.get('idle') || null;

    // Add dialogs if provided
    if (options.dialogs) {
      for (const dialog of options.dialogs) {
        npc.dialogs?.set(dialog.id, dialog);
      }
    }

    this.npcs.set(id, npc);
    return npc;
  }

  /**
   * Create NPC from an existing Character object
   */
  createNPCFromCharacter(
    character: Character,
    options: NPCCreationOptions = {}
  ): NPC {
    // Store the character in the builder if not already present
    if (!this.characterBuilder.getCharacter(character.id)) {
      // Re-create the character in the builder to maintain consistency
      this.characterBuilder.createCharacter(
        character.id,
        character.name,
        character.transform.position,
        character.size,
        character.stats
      );
      // Copy over existing properties
      const builtChar = this.characterBuilder.getCharacter(character.id);
      if (builtChar) {
        builtChar.sprite = character.sprite;
        builtChar.animations = character.animations;
        builtChar.currentAnimation = character.currentAnimation;
        builtChar.properties = character.properties;
      }
    }

    const npc: NPC = {
      id: character.id,
      character,
      state: 'idle',
      behaviorConfig: options.behaviorConfig || {},
      currentBehavior: null,
      behaviors: new Map(),
      dialogs: new Map(),
      npcType: options.npcType || 'neutral',
      hostile: options.hostile ?? false,
      properties: options.properties || {}
    };

    // Add default idle behavior
    npc.behaviors.set('idle', new IdleBehavior());
    npc.currentBehavior = npc.behaviors.get('idle') || null;

    // Add dialogs if provided
    if (options.dialogs) {
      for (const dialog of options.dialogs) {
        npc.dialogs?.set(dialog.id, dialog);
      }
    }

    this.npcs.set(character.id, npc);
    return npc;
  }

  /**
   * Get NPC by ID
   */
  getNPC(id: string): NPC | undefined {
    return this.npcs.get(id);
  }

  /**
   * Get all NPCs
   */
  getAllNPCs(): NPC[] {
    return Array.from(this.npcs.values());
  }

  /**
   * Get NPCs by type
   */
  getNPCsByType(type: NPCType): NPC[] {
    return Array.from(this.npcs.values()).filter(npc => npc.npcType === type);
  }

  /**
   * Get hostile NPCs
   */
  getHostileNPCs(): NPC[] {
    return Array.from(this.npcs.values()).filter(npc => npc.hostile);
  }

  /**
   * Get friendly NPCs
   */
  getFriendlyNPCs(): NPC[] {
    return Array.from(this.npcs.values()).filter(npc => !npc.hostile);
  }

  /**
   * Add behavior to NPC
   */
  addBehavior(npcId: string, behavior: AIBehavior): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    npc.behaviors.set(behavior.name, behavior);
    return this;
  }

  /**
   * Remove behavior from NPC
   */
  removeBehavior(npcId: string, behaviorName: string): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    npc.behaviors.delete(behaviorName);
    return this;
  }

  /**
   * Set NPC's current behavior
   */
  setBehavior(npcId: string, behaviorName: string): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    const behavior = npc.behaviors.get(behaviorName);
    if (!behavior) {
      throw new Error(`Behavior ${behaviorName} not found for NPC ${npcId}`);
    }

    // Exit current behavior
    if (npc.currentBehavior && npc.currentBehavior.onExit) {
      npc.currentBehavior.onExit(npc);
    }

    // Enter new behavior
    npc.currentBehavior = behavior;
    if (behavior.onEnter) {
      behavior.onEnter(npc);
    }

    return this;
  }

  /**
   * Set NPC state
   */
  setState(npcId: string, state: NPCState): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    npc.state = state;
    return this;
  }

  /**
   * Update behavior config for NPC
   */
  updateBehaviorConfig(npcId: string, config: Partial<AIBehaviorConfig>): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    Object.assign(npc.behaviorConfig, config);
    return this;
  }

  /**
   * Add dialog to NPC
   */
  addDialog(npcId: string, dialog: NPCDialog): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    if (!npc.dialogs) {
      npc.dialogs = new Map();
    }
    npc.dialogs.set(dialog.id, dialog);
    return this;
  }

  /**
   * Get NPC's current dialog
   */
  getCurrentDialog(npcId: string): NPCDialog | undefined {
    const npc = this.npcs.get(npcId);
    if (!npc || !npc.dialogs || !npc.currentDialogId) {
      return undefined;
    }
    return npc.dialogs.get(npc.currentDialogId);
  }

  /**
   * Start dialog with NPC
   */
  startDialog(npcId: string, dialogId: string): NPCDialog | undefined {
    const npc = this.npcs.get(npcId);
    if (!npc || !npc.dialogs) {
      return undefined;
    }
    const dialog = npc.dialogs.get(dialogId);
    if (dialog) {
      npc.currentDialogId = dialogId;
    }
    return dialog;
  }

  /**
   * End current dialog
   */
  endDialog(npcId: string): void {
    const npc = this.npcs.get(npcId);
    if (npc) {
      npc.currentDialogId = undefined;
    }
  }

  /**
   * Set NPC hostility
   */
  setHostile(npcId: string, hostile: boolean): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    npc.hostile = hostile;
    return this;
  }

  /**
   * Set NPC type
   */
  setNPCType(npcId: string, type: NPCType): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    npc.npcType = type;
    return this;
  }

  /**
   * Update NPC (call every frame)
   */
  updateNPC(npc: NPC, deltaTime: number, context: AIContext): void {
    if (npc.currentBehavior) {
      npc.currentBehavior.update(npc, deltaTime, context);
    }

    // Update the underlying character
    this.characterBuilder.update(npc.character, deltaTime);
  }

  /**
   * Update all NPCs
   */
  updateAll(deltaTime: number, context: AIContext): void {
    for (const npc of this.npcs.values()) {
      this.updateNPC(npc, deltaTime, context);
    }
  }

  /**
   * Auto-select best behavior based on context
   */
  autoSelectBehavior(npc: NPC, context: AIContext): void {
    // Check behaviors in priority order
    const behaviorPriority = ['flee', 'attack', 'chase', 'patrol', 'wander', 'idle'];

    for (const behaviorName of behaviorPriority) {
      const behavior = npc.behaviors.get(behaviorName);
      if (behavior && behavior.canActivate && behavior.canActivate(npc, context)) {
        if (npc.currentBehavior !== behavior) {
          this.setBehavior(npc.id, behaviorName);
        }
        return;
      }
    }
  }

  /**
   * Render NPC
   */
  renderNPC(ctx: CanvasRenderingContext2D, npc: NPC, camera?: Vector2D): void {
    this.characterBuilder.render(ctx, npc.character, camera);
  }

  /**
   * Render all NPCs
   */
  renderAll(ctx: CanvasRenderingContext2D, camera?: Vector2D): void {
    for (const npc of this.npcs.values()) {
      this.renderNPC(ctx, npc, camera);
    }
  }

  /**
   * Remove NPC
   */
  removeNPC(id: string): boolean {
    return this.npcs.delete(id);
  }

  /**
   * Clear all NPCs
   */
  clear(): void {
    this.npcs.clear();
  }

  /**
   * Get the underlying CharacterBuilder
   */
  getCharacterBuilder(): CharacterBuilder {
    return this.characterBuilder;
  }

  /**
   * Get NPC count
   */
  getNPCCount(): number {
    return this.npcs.size;
  }

  /**
   * Check if NPC exists
   */
  hasNPC(id: string): boolean {
    return this.npcs.has(id);
  }

  /**
   * Get NPCs within range of a position
   */
  getNPCsInRange(position: Vector2D, range: number): NPC[] {
    return Array.from(this.npcs.values()).filter(npc => {
      const dx = npc.character.transform.position.x - position.x;
      const dy = npc.character.transform.position.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= range;
    });
  }

  /**
   * Set NPC property
   */
  setProperty(npcId: string, key: string, value: unknown): NPCBuilder {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      throw new Error(`NPC ${npcId} not found`);
    }
    
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      throw new Error('Invalid property key: reserved property name');
    }
    
    npc.properties[key] = value;
    return this;
  }

  /**
   * Get NPC property
   */
  getProperty(npcId: string, key: string): unknown {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      return undefined;
    }
    return npc.properties[key];
  }
}
