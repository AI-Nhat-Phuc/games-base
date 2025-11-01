/**
 * Effect Builder - Creates and manages visual effects
 */

import { Vector2D, Color } from '../core/types';

export interface Particle {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  life: number;
  maxLife: number;
  size: number;
  color: Color;
  alpha: number;
}

export interface Effect {
  id: string;
  position: Vector2D;
  particles: Particle[];
  active: boolean;
  duration: number;
  elapsed: number;
}

export interface EffectConfig {
  particleCount: number;
  particleLife: number;
  particleSize: number;
  color: Color;
  spread: number;
  velocity: number;
  gravity?: number;
}

export class EffectBuilder {
  private effects: Map<string, Effect> = new Map();
  private nextId: number = 0;

  /**
   * Create a particle explosion effect
   */
  createExplosion(position: Vector2D, config: EffectConfig): string {
    const effectId = `explosion_${this.nextId++}`;
    const particles: Particle[] = [];

    for (let i = 0; i < config.particleCount; i++) {
      const angle = (Math.PI * 2 * i) / config.particleCount;
      const speed = config.velocity * (0.5 + Math.random() * 0.5);

      particles.push({
        position: { x: position.x, y: position.y },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        acceleration: { x: 0, y: config.gravity || 0 },
        life: config.particleLife,
        maxLife: config.particleLife,
        size: config.particleSize,
        color: config.color,
        alpha: 1.0
      });
    }

    const effect: Effect = {
      id: effectId,
      position,
      particles,
      active: true,
      duration: config.particleLife,
      elapsed: 0
    };

    this.effects.set(effectId, effect);
    return effectId;
  }

  /**
   * Create a trail effect
   */
  createTrail(position: Vector2D, color: Color): string {
    const effectId = `trail_${this.nextId++}`;
    const particles: Particle[] = [];

    for (let i = 0; i < 5; i++) {
      particles.push({
        position: { x: position.x, y: position.y },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        life: 0.5,
        maxLife: 0.5,
        size: 8 - i * 1.5,
        color,
        alpha: 1.0 - i * 0.15
      });
    }

    const effect: Effect = {
      id: effectId,
      position,
      particles,
      active: true,
      duration: 0.5,
      elapsed: 0
    };

    this.effects.set(effectId, effect);
    return effectId;
  }

  /**
   * Create a sparkle effect
   */
  createSparkle(position: Vector2D, color: Color): string {
    const effectId = `sparkle_${this.nextId++}`;
    const particles: Particle[] = [];

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 30;

      particles.push({
        position: { x: position.x, y: position.y },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        acceleration: { x: 0, y: 50 },
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1.0,
        size: 2 + Math.random() * 3,
        color,
        alpha: 1.0
      });
    }

    const effect: Effect = {
      id: effectId,
      position,
      particles,
      active: true,
      duration: 1.0,
      elapsed: 0
    };

    this.effects.set(effectId, effect);
    return effectId;
  }

  /**
   * Update all effects
   */
  update(deltaTime: number): void {
    const toRemove: string[] = [];

    for (const [id, effect] of this.effects) {
      if (!effect.active) {
        toRemove.push(id);
        continue;
      }

      effect.elapsed += deltaTime;
      if (effect.elapsed >= effect.duration) {
        effect.active = false;
        toRemove.push(id);
        continue;
      }

      // Update particles
      for (const particle of effect.particles) {
        particle.life -= deltaTime;
        if (particle.life <= 0) continue;

        // Update position
        particle.velocity.x += particle.acceleration.x * deltaTime;
        particle.velocity.y += particle.acceleration.y * deltaTime;
        particle.position.x += particle.velocity.x * deltaTime;
        particle.position.y += particle.velocity.y * deltaTime;

        // Update alpha
        particle.alpha = particle.life / particle.maxLife;
      }

      // Remove dead particles
      effect.particles = effect.particles.filter(p => p.life > 0);
      if (effect.particles.length === 0) {
        effect.active = false;
      }
    }

    // Remove inactive effects
    for (const id of toRemove) {
      this.effects.delete(id);
    }
  }

  /**
   * Render all effects
   */
  render(ctx: CanvasRenderingContext2D, camera?: Vector2D): void {
    const cameraPos = camera || { x: 0, y: 0 };

    for (const effect of this.effects.values()) {
      if (!effect.active) continue;

      for (const particle of effect.particles) {
        if (particle.life <= 0) continue;

        const x = particle.position.x - cameraPos.x;
        const y = particle.position.y - cameraPos.y;

        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = this.colorToString(particle.color);
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /**
   * Convert color object to CSS string
   */
  private colorToString(color: Color): string {
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);
    const a = color.a !== undefined ? color.a : 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Remove all effects
   */
  clear(): void {
    this.effects.clear();
  }

  /**
   * Get effect by id
   */
  getEffect(id: string): Effect | undefined {
    return this.effects.get(id);
  }

  /**
   * Get all active effects
   */
  getActiveEffects(): Effect[] {
    return Array.from(this.effects.values()).filter(e => e.active);
  }
}
