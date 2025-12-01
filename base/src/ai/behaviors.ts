/**
 * AI Behaviors - Pre-built behaviors for NPCs
 */

import { Vector2D } from '../core/types';
import { AIBehavior, AIContext, NPC } from './types';

/**
 * Calculate distance between two points
 */
function distance(a: Vector2D, b: Vector2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalize a vector
 */
function normalize(v: Vector2D): Vector2D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

/**
 * Idle Behavior - NPC stands still and waits
 */
export class IdleBehavior implements AIBehavior {
  name = 'idle';
  private idleTime = 0;
  private maxIdleTime: number;

  constructor(maxIdleTime: number = 3000) {
    this.maxIdleTime = maxIdleTime;
  }

  update(npc: NPC, deltaTime: number, _context: AIContext): void {
    this.idleTime += deltaTime * 1000;
    
    // Update animation if available
    if (npc.character.animations.has('idle')) {
      npc.character.currentAnimation = 'idle';
    }
  }

  canActivate(_npc: NPC, _context: AIContext): boolean {
    return true;
  }

  onEnter(_npc: NPC): void {
    this.idleTime = 0;
  }

  onExit(_npc: NPC): void {
    this.idleTime = 0;
  }

  /**
   * Check if idle time has exceeded the maximum
   */
  isIdleComplete(): boolean {
    return this.idleTime >= this.maxIdleTime;
  }
}

/**
 * Patrol Behavior - NPC moves between waypoints
 */
export class PatrolBehavior implements AIBehavior {
  name = 'patrol';
  private currentWaypointIndex = 0;
  private waitTime = 0;
  private isWaiting = false;

  update(npc: NPC, deltaTime: number, _context: AIContext): void {
    const config = npc.behaviorConfig;
    const waypoints = config.patrolPoints;
    
    if (!waypoints || waypoints.length === 0) return;

    const currentWaypoint = waypoints[this.currentWaypointIndex];
    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, currentWaypoint);

    // Check if arrived at waypoint
    if (dist < 5) {
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.waitTime = 0;
      }

      this.waitTime += deltaTime * 1000;

      // Wait at waypoint
      if (this.waitTime >= (config.patrolWaitTime || 1000)) {
        this.isWaiting = false;
        this.moveToNextWaypoint(config.patrolLoop ?? true, waypoints.length);
      }

      // Update animation to idle while waiting
      if (npc.character.animations.has('idle')) {
        npc.character.currentAnimation = 'idle';
      }
    } else {
      // Move towards waypoint
      const direction = normalize({
        x: currentWaypoint.x - npcPos.x,
        y: currentWaypoint.y - npcPos.y
      });

      const speed = npc.character.stats.speed * deltaTime;
      npc.character.transform.position.x += direction.x * speed;
      npc.character.transform.position.y += direction.y * speed;

      // Update animation to walk
      if (npc.character.animations.has('walk')) {
        npc.character.currentAnimation = 'walk';
      }
    }
  }

  private moveToNextWaypoint(loop: boolean, waypointCount: number): void {
    this.currentWaypointIndex++;
    if (this.currentWaypointIndex >= waypointCount) {
      if (loop) {
        this.currentWaypointIndex = 0;
      } else {
        this.currentWaypointIndex = waypointCount - 1;
      }
    }
  }

  canActivate(npc: NPC, _context: AIContext): boolean {
    const waypoints = npc.behaviorConfig.patrolPoints;
    return waypoints !== undefined && waypoints.length > 0;
  }

  onEnter(_npc: NPC): void {
    this.currentWaypointIndex = 0;
    this.waitTime = 0;
    this.isWaiting = false;
  }

  onExit(_npc: NPC): void {
    this.waitTime = 0;
    this.isWaiting = false;
  }

  /**
   * Get current waypoint index
   */
  getCurrentWaypointIndex(): number {
    return this.currentWaypointIndex;
  }

  /**
   * Set current waypoint index
   */
  setCurrentWaypointIndex(index: number): void {
    this.currentWaypointIndex = index;
  }
}

/**
 * Chase Behavior - NPC chases a target (usually the player)
 */
export class ChaseBehavior implements AIBehavior {
  name = 'chase';
  private target: Vector2D | null = null;

  update(npc: NPC, deltaTime: number, context: AIContext): void {
    // Use player position as target if available
    this.target = context.playerPosition || this.target;
    
    if (!this.target) return;

    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, this.target);
    const attackRange = npc.behaviorConfig.attackRange ?? 30;

    // Stop chasing if within attack range
    if (dist <= attackRange) {
      return;
    }

    // Move towards target
    const direction = normalize({
      x: this.target.x - npcPos.x,
      y: this.target.y - npcPos.y
    });

    // Chase speed is slightly faster than normal
    const chaseSpeedMultiplier = 1.2;
    const speed = npc.character.stats.speed * chaseSpeedMultiplier * deltaTime;
    npc.character.transform.position.x += direction.x * speed;
    npc.character.transform.position.y += direction.y * speed;

    // Update animation to run if available, otherwise walk
    if (npc.character.animations.has('run')) {
      npc.character.currentAnimation = 'run';
    } else if (npc.character.animations.has('walk')) {
      npc.character.currentAnimation = 'walk';
    }
  }

  canActivate(npc: NPC, context: AIContext): boolean {
    if (!context.playerPosition) return false;
    
    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, context.playerPosition);
    const detectionRange = npc.behaviorConfig.detectionRange ?? 100;
    
    return dist <= detectionRange && npc.hostile;
  }

  onEnter(_npc: NPC): void {
    this.target = null;
  }

  onExit(_npc: NPC): void {
    this.target = null;
  }

  /**
   * Manually set the chase target
   */
  setTarget(target: Vector2D): void {
    this.target = target;
  }

  /**
   * Get current target
   */
  getTarget(): Vector2D | null {
    return this.target;
  }
}

/**
 * Flee Behavior - NPC runs away from a threat
 */
export class FleeBehavior implements AIBehavior {
  name = 'flee';
  private threatPosition: Vector2D | null = null;

  update(npc: NPC, deltaTime: number, context: AIContext): void {
    // Use player position as threat if available
    this.threatPosition = context.playerPosition || this.threatPosition;
    
    if (!this.threatPosition) return;

    const npcPos = npc.character.transform.position;
    
    // Move away from threat
    const direction = normalize({
      x: npcPos.x - this.threatPosition.x,
      y: npcPos.y - this.threatPosition.y
    });

    // Flee speed is faster than normal
    const fleeSpeedMultiplier = 1.5;
    const speed = npc.character.stats.speed * fleeSpeedMultiplier * deltaTime;
    npc.character.transform.position.x += direction.x * speed;
    npc.character.transform.position.y += direction.y * speed;

    // Update animation to run if available
    if (npc.character.animations.has('run')) {
      npc.character.currentAnimation = 'run';
    } else if (npc.character.animations.has('walk')) {
      npc.character.currentAnimation = 'walk';
    }
  }

  canActivate(npc: NPC, context: AIContext): boolean {
    if (!context.playerPosition) return false;
    
    const healthPercent = npc.character.stats.health / npc.character.stats.maxHealth;
    const fleeThreshold = npc.behaviorConfig.fleeHealthThreshold ?? 0.2;
    
    // Flee if health is low
    return healthPercent <= fleeThreshold;
  }

  onEnter(_npc: NPC): void {
    this.threatPosition = null;
  }

  onExit(_npc: NPC): void {
    this.threatPosition = null;
  }

  /**
   * Manually set the threat position
   */
  setThreatPosition(position: Vector2D): void {
    this.threatPosition = position;
  }
}

/**
 * Attack Behavior - NPC attacks a target
 */
export class AttackBehavior implements AIBehavior {
  name = 'attack';
  private attackCooldown = 0;
  private attackInterval: number;
  private onAttackCallback?: (npc: NPC, targetPosition: Vector2D) => void;

  constructor(attackInterval: number = 1000, onAttack?: (npc: NPC, targetPosition: Vector2D) => void) {
    this.attackInterval = attackInterval;
    this.onAttackCallback = onAttack;
  }

  update(npc: NPC, deltaTime: number, context: AIContext): void {
    if (!context.playerPosition) return;

    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, context.playerPosition);
    const attackRange = npc.behaviorConfig.attackRange ?? 30;

    // Only attack if within range
    if (dist > attackRange) return;

    this.attackCooldown -= deltaTime * 1000;

    if (this.attackCooldown <= 0) {
      // Perform attack
      if (npc.character.animations.has('attack')) {
        npc.character.currentAnimation = 'attack';
      }

      // Call attack callback if provided
      if (this.onAttackCallback) {
        this.onAttackCallback(npc, context.playerPosition);
      }

      this.attackCooldown = this.attackInterval;
    }
  }

  canActivate(npc: NPC, context: AIContext): boolean {
    if (!context.playerPosition || !npc.hostile) return false;
    
    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, context.playerPosition);
    const attackRange = npc.behaviorConfig.attackRange ?? 30;
    
    return dist <= attackRange;
  }

  onEnter(_npc: NPC): void {
    this.attackCooldown = 0;
  }

  onExit(_npc: NPC): void {
    this.attackCooldown = 0;
  }

  /**
   * Set the attack callback
   */
  setOnAttackCallback(callback: (npc: NPC, targetPosition: Vector2D) => void): void {
    this.onAttackCallback = callback;
  }
}

/**
 * Wander Behavior - NPC randomly moves around
 */
export class WanderBehavior implements AIBehavior {
  name = 'wander';
  private targetPosition: Vector2D | null = null;
  private wanderRadius: number;
  private centerPosition: Vector2D | null = null;
  private waitTime = 0;
  private isWaiting = false;
  private maxWaitTime: number;

  constructor(wanderRadius: number = 100, maxWaitTime: number = 2000) {
    this.wanderRadius = wanderRadius;
    this.maxWaitTime = maxWaitTime;
  }

  update(npc: NPC, deltaTime: number, _context: AIContext): void {
    const npcPos = npc.character.transform.position;

    // Initialize center position
    if (!this.centerPosition) {
      this.centerPosition = { x: npcPos.x, y: npcPos.y };
    }

    // Generate new target if needed
    if (!this.targetPosition) {
      this.targetPosition = this.generateRandomTarget(this.centerPosition);
    }

    // Check if arrived at target
    const dist = distance(npcPos, this.targetPosition);
    if (dist < 5) {
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.waitTime = 0;
      }

      this.waitTime += deltaTime * 1000;

      // Wait, then pick new target
      if (this.waitTime >= this.maxWaitTime) {
        this.isWaiting = false;
        this.targetPosition = this.generateRandomTarget(this.centerPosition);
      }

      // Update animation to idle while waiting
      if (npc.character.animations.has('idle')) {
        npc.character.currentAnimation = 'idle';
      }
    } else {
      // Move towards target
      const direction = normalize({
        x: this.targetPosition.x - npcPos.x,
        y: this.targetPosition.y - npcPos.y
      });

      const speed = npc.character.stats.speed * deltaTime;
      npc.character.transform.position.x += direction.x * speed;
      npc.character.transform.position.y += direction.y * speed;

      // Update animation to walk
      if (npc.character.animations.has('walk')) {
        npc.character.currentAnimation = 'walk';
      }
    }
  }

  private generateRandomTarget(center: Vector2D): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * this.wanderRadius;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  }

  canActivate(_npc: NPC, _context: AIContext): boolean {
    return true;
  }

  onEnter(npc: NPC): void {
    this.centerPosition = { 
      x: npc.character.transform.position.x, 
      y: npc.character.transform.position.y 
    };
    this.targetPosition = null;
    this.waitTime = 0;
    this.isWaiting = false;
  }

  onExit(_npc: NPC): void {
    this.targetPosition = null;
    this.waitTime = 0;
    this.isWaiting = false;
  }

  /**
   * Set wander radius
   */
  setWanderRadius(radius: number): void {
    this.wanderRadius = radius;
  }

  /**
   * Set center position for wandering
   */
  setCenterPosition(position: Vector2D): void {
    this.centerPosition = position;
  }
}

/**
 * Follow Behavior - NPC follows a target at a distance
 */
export class FollowBehavior implements AIBehavior {
  name = 'follow';
  private followDistance: number;
  private targetId: string | null = null;

  constructor(followDistance: number = 50) {
    this.followDistance = followDistance;
  }

  update(npc: NPC, deltaTime: number, context: AIContext): void {
    // Follow player by default if no specific target
    let targetPos = context.playerPosition;

    // Check if following another NPC
    if (this.targetId && context.otherNPCs) {
      const targetNPC = context.otherNPCs.find(n => n.id === this.targetId);
      if (targetNPC) {
        targetPos = targetNPC.character.transform.position;
      }
    }

    if (!targetPos) return;

    const npcPos = npc.character.transform.position;
    const dist = distance(npcPos, targetPos);

    // Only move if too far from target
    if (dist > this.followDistance) {
      const direction = normalize({
        x: targetPos.x - npcPos.x,
        y: targetPos.y - npcPos.y
      });

      const speed = npc.character.stats.speed * deltaTime;
      npc.character.transform.position.x += direction.x * speed;
      npc.character.transform.position.y += direction.y * speed;

      // Update animation to walk
      if (npc.character.animations.has('walk')) {
        npc.character.currentAnimation = 'walk';
      }
    } else {
      // Update animation to idle when close enough
      if (npc.character.animations.has('idle')) {
        npc.character.currentAnimation = 'idle';
      }
    }
  }

  canActivate(_npc: NPC, context: AIContext): boolean {
    return context.playerPosition !== undefined || (context.otherNPCs !== undefined && context.otherNPCs.length > 0);
  }

  onEnter(_npc: NPC): void {
    // Nothing to initialize
  }

  onExit(_npc: NPC): void {
    // Nothing to clean up
  }

  /**
   * Set the target NPC ID to follow
   */
  setTargetId(id: string): void {
    this.targetId = id;
  }

  /**
   * Set follow distance
   */
  setFollowDistance(distance: number): void {
    this.followDistance = distance;
  }
}
