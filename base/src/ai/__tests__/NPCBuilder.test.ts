/**
 * Tests for NPCBuilder
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { NPCBuilder } from '../NPCBuilder';
import { CharacterBuilder } from '../../builders/CharacterBuilder';
import { Vector2D, Size } from '../../core/types';
import { CharacterStats } from '../../builders/CharacterBuilder';
import { 
  PatrolBehavior, 
  ChaseBehavior, 
  FleeBehavior
} from '../behaviors';
import { AIContext, NPCDialog } from '../types';

describe('NPCBuilder', () => {
  let npcBuilder: NPCBuilder;

  beforeEach(() => {
    npcBuilder = new NPCBuilder();
  });

  describe('createNPC', () => {
    test('should create an NPC with given properties', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('guard', 'Guard', position, size, stats);

      expect(npc.id).toBe('guard');
      expect(npc.character.name).toBe('Guard');
      expect(npc.character.transform.position).toEqual(position);
      expect(npc.character.size).toEqual(size);
      expect(npc.state).toBe('idle');
      expect(npc.npcType).toBe('neutral');
      expect(npc.hostile).toBe(false);
    });

    test('should create hostile NPC with options', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 80, maxHealth: 80, speed: 60 };

      const npc = npcBuilder.createNPC('enemy', 'Enemy', position, size, stats, {
        npcType: 'hostile',
        hostile: true
      });

      expect(npc.npcType).toBe('hostile');
      expect(npc.hostile).toBe(true);
    });

    test('should create NPC with behavior config', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };
      const patrolPoints = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }];

      const npc = npcBuilder.createNPC('patrol_guard', 'Patrol Guard', position, size, stats, {
        behaviorConfig: {
          patrolPoints,
          patrolLoop: true,
          detectionRange: 150
        }
      });

      expect(npc.behaviorConfig.patrolPoints).toEqual(patrolPoints);
      expect(npc.behaviorConfig.patrolLoop).toBe(true);
      expect(npc.behaviorConfig.detectionRange).toBe(150);
    });

    test('should add default idle behavior', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('test', 'Test', position, size, stats);

      expect(npc.behaviors.has('idle')).toBe(true);
      expect(npc.currentBehavior).not.toBeNull();
    });
  });

  describe('createNPCFromCharacter', () => {
    test('should create NPC from existing character', () => {
      const characterBuilder = new CharacterBuilder();
      const position: Vector2D = { x: 50, y: 50 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const character = characterBuilder.createCharacter('hero', 'Hero', position, size, stats);
      const npc = npcBuilder.createNPCFromCharacter(character);

      expect(npc.id).toBe('hero');
      expect(npc.character).toBe(character);
      expect(npc.state).toBe('idle');
    });

    test('should apply options when creating from character', () => {
      const characterBuilder = new CharacterBuilder();
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const character = characterBuilder.createCharacter('merchant', 'Merchant', position, size, stats);
      const npc = npcBuilder.createNPCFromCharacter(character, {
        npcType: 'merchant',
        hostile: false
      });

      expect(npc.npcType).toBe('merchant');
      expect(npc.hostile).toBe(false);
    });
  });

  describe('getNPC', () => {
    test('should return NPC by id', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      const npc = npcBuilder.getNPC('test');

      expect(npc).toBeDefined();
      expect(npc?.id).toBe('test');
    });

    test('should return undefined for non-existent NPC', () => {
      const npc = npcBuilder.getNPC('nonexistent');
      expect(npc).toBeUndefined();
    });
  });

  describe('getAllNPCs', () => {
    test('should return all NPCs', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('npc1', 'NPC 1', position, size, stats);
      npcBuilder.createNPC('npc2', 'NPC 2', position, size, stats);
      npcBuilder.createNPC('npc3', 'NPC 3', position, size, stats);

      const npcs = npcBuilder.getAllNPCs();
      expect(npcs.length).toBe(3);
    });
  });

  describe('getNPCsByType', () => {
    test('should return NPCs of specific type', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('merchant1', 'Merchant 1', position, size, stats, { npcType: 'merchant' });
      npcBuilder.createNPC('guard', 'Guard', position, size, stats, { npcType: 'hostile' });
      npcBuilder.createNPC('merchant2', 'Merchant 2', position, size, stats, { npcType: 'merchant' });

      const merchants = npcBuilder.getNPCsByType('merchant');
      expect(merchants.length).toBe(2);
    });
  });

  describe('getHostileNPCs', () => {
    test('should return only hostile NPCs', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('friendly', 'Friendly', position, size, stats, { hostile: false });
      npcBuilder.createNPC('enemy1', 'Enemy 1', position, size, stats, { hostile: true });
      npcBuilder.createNPC('enemy2', 'Enemy 2', position, size, stats, { hostile: true });

      const hostiles = npcBuilder.getHostileNPCs();
      expect(hostiles.length).toBe(2);
    });
  });

  describe('addBehavior', () => {
    test('should add behavior to NPC', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.addBehavior('test', new PatrolBehavior());

      const npc = npcBuilder.getNPC('test');
      expect(npc?.behaviors.has('patrol')).toBe(true);
    });

    test('should throw error for non-existent NPC', () => {
      expect(() => npcBuilder.addBehavior('nonexistent', new PatrolBehavior()))
        .toThrow('NPC nonexistent not found');
    });
  });

  describe('setBehavior', () => {
    test('should set current behavior', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.addBehavior('test', new PatrolBehavior());
      npcBuilder.setBehavior('test', 'patrol');

      const npc = npcBuilder.getNPC('test');
      expect(npc?.currentBehavior?.name).toBe('patrol');
    });

    test('should throw error for non-existent behavior', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);

      expect(() => npcBuilder.setBehavior('test', 'nonexistent'))
        .toThrow('Behavior nonexistent not found for NPC test');
    });
  });

  describe('setState', () => {
    test('should set NPC state', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.setState('test', 'patrol');

      const npc = npcBuilder.getNPC('test');
      expect(npc?.state).toBe('patrol');
    });
  });

  describe('dialog system', () => {
    test('should add dialog to NPC', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('shopkeeper', 'Shopkeeper', position, size, stats);
      
      const dialog: NPCDialog = {
        id: 'greeting',
        lines: ['Hello traveler!', 'Welcome to my shop.']
      };
      
      npcBuilder.addDialog('shopkeeper', dialog);

      const npc = npcBuilder.getNPC('shopkeeper');
      expect(npc?.dialogs?.has('greeting')).toBe(true);
    });

    test('should start and get dialog', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('merchant', 'Merchant', position, size, stats);
      
      const dialog: NPCDialog = {
        id: 'shop_menu',
        lines: ['What would you like to buy?']
      };
      
      npcBuilder.addDialog('merchant', dialog);
      const startedDialog = npcBuilder.startDialog('merchant', 'shop_menu');

      expect(startedDialog).toBeDefined();
      expect(startedDialog?.id).toBe('shop_menu');

      const currentDialog = npcBuilder.getCurrentDialog('merchant');
      expect(currentDialog?.id).toBe('shop_menu');
    });

    test('should end dialog', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('npc', 'NPC', position, size, stats);
      npcBuilder.addDialog('npc', { id: 'test', lines: ['Test'] });
      npcBuilder.startDialog('npc', 'test');
      npcBuilder.endDialog('npc');

      const currentDialog = npcBuilder.getCurrentDialog('npc');
      expect(currentDialog).toBeUndefined();
    });
  });

  describe('updateNPC', () => {
    test('should update NPC with behavior', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('test', 'Test', position, size, stats);
      const context: AIContext = {};

      // Should not throw
      expect(() => npcBuilder.updateNPC(npc, 0.016, context)).not.toThrow();
    });
  });

  describe('updateAll', () => {
    test('should update all NPCs', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('npc1', 'NPC 1', position, size, stats);
      npcBuilder.createNPC('npc2', 'NPC 2', position, size, stats);
      const context: AIContext = {};

      expect(() => npcBuilder.updateAll(0.016, context)).not.toThrow();
    });
  });

  describe('autoSelectBehavior', () => {
    test('should select flee behavior when health is low', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 15, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('test', 'Test', position, size, stats, {
        behaviorConfig: { fleeHealthThreshold: 0.2 }
      });
      npcBuilder.addBehavior('test', new FleeBehavior());

      const context: AIContext = { playerPosition: { x: 50, y: 50 } };
      npcBuilder.autoSelectBehavior(npc, context);

      expect(npc.currentBehavior?.name).toBe('flee');
    });

    test('should select chase behavior for hostile NPC when player in range', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('enemy', 'Enemy', position, size, stats, {
        hostile: true,
        behaviorConfig: { detectionRange: 100 }
      });
      npcBuilder.addBehavior('enemy', new ChaseBehavior());

      const context: AIContext = { playerPosition: { x: 50, y: 50 } };
      npcBuilder.autoSelectBehavior(npc, context);

      expect(npc.currentBehavior?.name).toBe('chase');
    });
  });

  describe('renderNPC', () => {
    test('should render NPC', () => {
      const position: Vector2D = { x: 50, y: 50 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      const npc = npcBuilder.createNPC('test', 'Test', position, size, stats);

      const ctx = {
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        scale: jest.fn(),
        fillStyle: '',
        fillRect: jest.fn(),
        strokeStyle: '',
        strokeRect: jest.fn(),
        globalAlpha: 1
      } as unknown as CanvasRenderingContext2D;

      expect(() => npcBuilder.renderNPC(ctx, npc)).not.toThrow();
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });
  });

  describe('removeNPC', () => {
    test('should remove NPC', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      expect(npcBuilder.hasNPC('test')).toBe(true);

      const removed = npcBuilder.removeNPC('test');
      expect(removed).toBe(true);
      expect(npcBuilder.hasNPC('test')).toBe(false);
    });
  });

  describe('clear', () => {
    test('should clear all NPCs', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('npc1', 'NPC 1', position, size, stats);
      npcBuilder.createNPC('npc2', 'NPC 2', position, size, stats);
      
      npcBuilder.clear();
      
      expect(npcBuilder.getNPCCount()).toBe(0);
    });
  });

  describe('getNPCsInRange', () => {
    test('should return NPCs within range', () => {
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('close', 'Close', { x: 10, y: 10 }, size, stats);
      npcBuilder.createNPC('far', 'Far', { x: 500, y: 500 }, size, stats);

      const npcsInRange = npcBuilder.getNPCsInRange({ x: 0, y: 0 }, 50);
      
      expect(npcsInRange.length).toBe(1);
      expect(npcsInRange[0].id).toBe('close');
    });
  });

  describe('setProperty and getProperty', () => {
    test('should set and get NPC property', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.setProperty('test', 'quest_giver', true);
      npcBuilder.setProperty('test', 'level', 5);

      expect(npcBuilder.getProperty('test', 'quest_giver')).toBe(true);
      expect(npcBuilder.getProperty('test', 'level')).toBe(5);
    });

    test('should prevent prototype pollution', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);

      expect(() => npcBuilder.setProperty('test', '__proto__', {}))
        .toThrow('Invalid property key: reserved property name');
      expect(() => npcBuilder.setProperty('test', 'constructor', {}))
        .toThrow('Invalid property key: reserved property name');
    });
  });

  describe('setHostile and setNPCType', () => {
    test('should change NPC hostility', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.setHostile('test', true);

      const npc = npcBuilder.getNPC('test');
      expect(npc?.hostile).toBe(true);
    });

    test('should change NPC type', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 50 };

      npcBuilder.createNPC('test', 'Test', position, size, stats);
      npcBuilder.setNPCType('test', 'quest_giver');

      const npc = npcBuilder.getNPC('test');
      expect(npc?.npcType).toBe('quest_giver');
    });
  });
});
