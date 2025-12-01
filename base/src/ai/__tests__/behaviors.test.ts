/**
 * Tests for AI Behaviors
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { 
  IdleBehavior, 
  PatrolBehavior, 
  ChaseBehavior, 
  FleeBehavior,
  AttackBehavior,
  WanderBehavior,
  FollowBehavior
} from '../behaviors';
import { NPCBuilder } from '../NPCBuilder';
import { NPC, AIContext } from '../types';
import { Vector2D, Size } from '../../core/types';
import { CharacterStats } from '../../builders/CharacterBuilder';

describe('AI Behaviors', () => {
  let npcBuilder: NPCBuilder;
  let testNPC: NPC;

  const createTestNPC = (
    id: string = 'test',
    position: Vector2D = { x: 100, y: 100 },
    hostile: boolean = false
  ): NPC => {
    const size: Size = { width: 32, height: 32 };
    const stats: CharacterStats = { health: 100, maxHealth: 100, speed: 100 };
    return npcBuilder.createNPC(id, 'Test NPC', position, size, stats, { hostile });
  };

  beforeEach(() => {
    npcBuilder = new NPCBuilder();
    testNPC = createTestNPC();
  });

  describe('IdleBehavior', () => {
    test('should create with default max idle time', () => {
      const behavior = new IdleBehavior();
      expect(behavior.name).toBe('idle');
    });

    test('should track idle time', () => {
      const behavior = new IdleBehavior(1000);
      behavior.onEnter!(testNPC);
      
      expect(behavior.isIdleComplete()).toBe(false);
      
      behavior.update(testNPC, 0.5, {}); // 500ms
      expect(behavior.isIdleComplete()).toBe(false);
      
      behavior.update(testNPC, 0.6, {}); // 600ms more = 1100ms total
      expect(behavior.isIdleComplete()).toBe(true);
    });

    test('should always be able to activate', () => {
      const behavior = new IdleBehavior();
      expect(behavior.canActivate!(testNPC, {})).toBe(true);
    });

    test('should reset idle time on exit', () => {
      const behavior = new IdleBehavior(1000);
      behavior.update(testNPC, 2, {});
      expect(behavior.isIdleComplete()).toBe(true);
      
      behavior.onExit!(testNPC);
      expect(behavior.isIdleComplete()).toBe(false);
    });
  });

  describe('PatrolBehavior', () => {
    test('should move towards waypoints', () => {
      const behavior = new PatrolBehavior();
      testNPC.behaviorConfig.patrolPoints = [
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ];
      testNPC.behaviorConfig.patrolLoop = true;
      
      behavior.onEnter!(testNPC);
      const initialX = testNPC.character.transform.position.x;
      
      // Update multiple times
      behavior.update(testNPC, 0.1, {});
      
      // Should have moved towards first waypoint (200, 100)
      expect(testNPC.character.transform.position.x).toBeGreaterThan(initialX);
    });

    test('should only activate with patrol points', () => {
      const behavior = new PatrolBehavior();
      
      expect(behavior.canActivate!(testNPC, {})).toBe(false);
      
      testNPC.behaviorConfig.patrolPoints = [{ x: 0, y: 0 }];
      expect(behavior.canActivate!(testNPC, {})).toBe(true);
    });

    test('should track current waypoint index', () => {
      const behavior = new PatrolBehavior();
      expect(behavior.getCurrentWaypointIndex()).toBe(0);
      
      behavior.setCurrentWaypointIndex(2);
      expect(behavior.getCurrentWaypointIndex()).toBe(2);
    });

    test('should reset on enter', () => {
      const behavior = new PatrolBehavior();
      behavior.setCurrentWaypointIndex(3);
      
      behavior.onEnter!(testNPC);
      expect(behavior.getCurrentWaypointIndex()).toBe(0);
    });
  });

  describe('ChaseBehavior', () => {
    test('should move towards player', () => {
      const behavior = new ChaseBehavior();
      const hostileNPC = createTestNPC('hostile', { x: 100, y: 100 }, true);
      hostileNPC.behaviorConfig.attackRange = 10;
      
      const context: AIContext = { playerPosition: { x: 200, y: 100 } };
      behavior.onEnter!(hostileNPC);
      
      const initialX = hostileNPC.character.transform.position.x;
      behavior.update(hostileNPC, 0.1, context);
      
      expect(hostileNPC.character.transform.position.x).toBeGreaterThan(initialX);
    });

    test('should only activate for hostile NPCs in detection range', () => {
      const behavior = new ChaseBehavior();
      testNPC.hostile = false;
      testNPC.behaviorConfig.detectionRange = 100;
      
      const context: AIContext = { playerPosition: { x: 150, y: 100 } };
      expect(behavior.canActivate!(testNPC, context)).toBe(false);
      
      testNPC.hostile = true;
      expect(behavior.canActivate!(testNPC, context)).toBe(true);
    });

    test('should not activate without player position', () => {
      const behavior = new ChaseBehavior();
      testNPC.hostile = true;
      
      expect(behavior.canActivate!(testNPC, {})).toBe(false);
    });

    test('should allow manual target setting', () => {
      const behavior = new ChaseBehavior();
      const target = { x: 300, y: 300 };
      
      behavior.setTarget(target);
      expect(behavior.getTarget()).toEqual(target);
    });
  });

  describe('FleeBehavior', () => {
    test('should move away from threat', () => {
      const behavior = new FleeBehavior();
      testNPC.character.transform.position = { x: 100, y: 100 };
      
      const context: AIContext = { playerPosition: { x: 150, y: 100 } };
      behavior.onEnter!(testNPC);
      behavior.update(testNPC, 0.1, context);
      
      // Should move left (away from player at 150)
      expect(testNPC.character.transform.position.x).toBeLessThan(100);
    });

    test('should only activate when health is low', () => {
      const behavior = new FleeBehavior();
      testNPC.character.stats.health = 100;
      testNPC.character.stats.maxHealth = 100;
      testNPC.behaviorConfig.fleeHealthThreshold = 0.2;
      
      const context: AIContext = { playerPosition: { x: 50, y: 50 } };
      expect(behavior.canActivate!(testNPC, context)).toBe(false);
      
      testNPC.character.stats.health = 15;
      expect(behavior.canActivate!(testNPC, context)).toBe(true);
    });

    test('should allow manual threat position', () => {
      const behavior = new FleeBehavior();
      behavior.setThreatPosition({ x: 200, y: 200 });
      
      behavior.update(testNPC, 0.1, {});
      // Should flee from set position
      expect(testNPC.character.transform.position.x).toBeLessThan(100);
    });
  });

  describe('AttackBehavior', () => {
    test('should attack when in range', () => {
      let attackCalled = false;
      const onAttack = () => { attackCalled = true; };
      const behavior = new AttackBehavior(100, onAttack);
      
      testNPC.hostile = true;
      testNPC.behaviorConfig.attackRange = 50;
      testNPC.character.transform.position = { x: 100, y: 100 };
      
      const context: AIContext = { playerPosition: { x: 120, y: 100 } };
      behavior.onEnter!(testNPC);
      behavior.update(testNPC, 0.2, context); // 200ms, should trigger attack
      
      expect(attackCalled).toBe(true);
    });

    test('should only activate for hostile NPCs in attack range', () => {
      const behavior = new AttackBehavior();
      testNPC.hostile = true;
      testNPC.behaviorConfig.attackRange = 50;
      
      // Out of range
      let context: AIContext = { playerPosition: { x: 200, y: 100 } };
      expect(behavior.canActivate!(testNPC, context)).toBe(false);
      
      // In range
      context = { playerPosition: { x: 120, y: 100 } };
      expect(behavior.canActivate!(testNPC, context)).toBe(true);
    });

    test('should allow setting attack callback', () => {
      const behavior = new AttackBehavior();
      let callbackValue = 0;
      
      behavior.setOnAttackCallback(() => { callbackValue = 42; });
      
      testNPC.hostile = true;
      testNPC.behaviorConfig.attackRange = 100;
      const context: AIContext = { playerPosition: { x: 110, y: 100 } };
      
      behavior.onEnter!(testNPC);
      behavior.update(testNPC, 0.1, context);
      
      expect(callbackValue).toBe(42);
    });
  });

  describe('WanderBehavior', () => {
    test('should initialize center position on enter', () => {
      const behavior = new WanderBehavior(100);
      testNPC.character.transform.position = { x: 50, y: 50 };
      
      behavior.onEnter!(testNPC);
      
      // After several updates, should stay within wander radius
      for (let i = 0; i < 10; i++) {
        behavior.update(testNPC, 0.1, {});
      }
      
      // Position should have changed
      const pos = testNPC.character.transform.position;
      const dist = Math.sqrt(Math.pow(pos.x - 50, 2) + Math.pow(pos.y - 50, 2));
      expect(dist).toBeLessThanOrEqual(200); // Should be within extended range
    });

    test('should always be able to activate', () => {
      const behavior = new WanderBehavior();
      expect(behavior.canActivate!(testNPC, {})).toBe(true);
    });

    test('should allow setting wander radius', () => {
      const behavior = new WanderBehavior(50);
      behavior.setWanderRadius(200);
      // Just verify it doesn't throw
      expect(() => behavior.update(testNPC, 0.1, {})).not.toThrow();
    });

    test('should allow setting center position', () => {
      const behavior = new WanderBehavior(50);
      behavior.setCenterPosition({ x: 500, y: 500 });
      
      behavior.update(testNPC, 0.1, {});
      // Just verify it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('FollowBehavior', () => {
    test('should follow player', () => {
      const behavior = new FollowBehavior(30);
      testNPC.character.transform.position = { x: 0, y: 0 };
      
      const context: AIContext = { playerPosition: { x: 100, y: 0 } };
      behavior.update(testNPC, 0.1, context);
      
      // Should have moved towards player
      expect(testNPC.character.transform.position.x).toBeGreaterThan(0);
    });

    test('should stop when close enough', () => {
      const behavior = new FollowBehavior(50);
      testNPC.character.transform.position = { x: 80, y: 100 };
      
      const context: AIContext = { playerPosition: { x: 100, y: 100 } };
      const initialX = testNPC.character.transform.position.x;
      
      behavior.update(testNPC, 0.1, context);
      
      // Should not have moved much (within follow distance)
      expect(Math.abs(testNPC.character.transform.position.x - initialX)).toBeLessThan(1);
    });

    test('should follow another NPC by ID', () => {
      const behavior = new FollowBehavior(30);
      const targetNPC = createTestNPC('target', { x: 200, y: 100 });
      testNPC.character.transform.position = { x: 0, y: 100 };
      
      behavior.setTargetId('target');
      
      const context: AIContext = { otherNPCs: [targetNPC] };
      behavior.update(testNPC, 0.1, context);
      
      // Should have moved towards target NPC
      expect(testNPC.character.transform.position.x).toBeGreaterThan(0);
    });

    test('should allow changing follow distance', () => {
      const behavior = new FollowBehavior(50);
      behavior.setFollowDistance(100);
      
      testNPC.character.transform.position = { x: 20, y: 100 };
      const context: AIContext = { playerPosition: { x: 100, y: 100 } };
      
      behavior.update(testNPC, 0.1, context);
      
      // Within new follow distance, should not move much
      expect(Math.abs(testNPC.character.transform.position.x - 20)).toBeLessThan(1);
    });

    test('should activate with player or other NPCs', () => {
      const behavior = new FollowBehavior();
      
      expect(behavior.canActivate!(testNPC, {})).toBe(false);
      expect(behavior.canActivate!(testNPC, { playerPosition: { x: 0, y: 0 } })).toBe(true);
      expect(behavior.canActivate!(testNPC, { otherNPCs: [testNPC] })).toBe(true);
    });
  });
});
