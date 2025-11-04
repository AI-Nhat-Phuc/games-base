/**
 * Tests for EffectBuilder
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { EffectBuilder } from '../EffectBuilder';
import { Color, Vector2D } from '../../core/types';

describe('EffectBuilder', () => {
  let builder: EffectBuilder;

  beforeEach(() => {
    builder = new EffectBuilder();
  });

  describe('createExplosion', () => {
    test('should create explosion effect with particles', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 10,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      const effectId = builder.createExplosion(position, config);

      expect(effectId).toMatch(/^explosion_\d+$/);
      const effect = builder.getEffect(effectId);
      expect(effect).toBeDefined();
      expect(effect?.particles.length).toBe(10);
      expect(effect?.position).toEqual(position);
      expect(effect?.active).toBe(true);
    });

    test('should create particles with correct properties', () => {
      const position: Vector2D = { x: 50, y: 50 };
      const color: Color = { r: 0, g: 1, b: 0 };
      const config = {
        particleCount: 5,
        particleLife: 2.0,
        particleSize: 8,
        color,
        spread: 100,
        velocity: 50
      };

      const effectId = builder.createExplosion(position, config);
      const effect = builder.getEffect(effectId);

      expect(effect?.particles[0].life).toBe(2.0);
      expect(effect?.particles[0].maxLife).toBe(2.0);
      expect(effect?.particles[0].size).toBe(8);
      expect(effect?.particles[0].color).toEqual(color);
      expect(effect?.particles[0].alpha).toBe(1.0);
    });

    test('should apply gravity when provided', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const color: Color = { r: 1, g: 1, b: 0 };
      const config = {
        particleCount: 3,
        particleLife: 1.0,
        particleSize: 4,
        color,
        spread: 50,
        velocity: 100,
        gravity: 9.8
      };

      const effectId = builder.createExplosion(position, config);
      const effect = builder.getEffect(effectId);

      expect(effect?.particles[0].acceleration.y).toBe(9.8);
    });
  });

  describe('createTrail', () => {
    test('should create trail effect', () => {
      const position: Vector2D = { x: 200, y: 200 };
      const color: Color = { r: 0, g: 0, b: 1 };

      const effectId = builder.createTrail(position, color);

      expect(effectId).toMatch(/^trail_\d+$/);
      const effect = builder.getEffect(effectId);
      expect(effect).toBeDefined();
      expect(effect?.particles.length).toBe(5);
      expect(effect?.position).toEqual(position);
    });

    test('should create particles with decreasing size and alpha', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 1 };

      const effectId = builder.createTrail(position, color);
      const effect = builder.getEffect(effectId);

      // Check that size decreases
      expect(effect?.particles[0].size).toBeGreaterThan(effect?.particles[1].size!);
      expect(effect?.particles[1].size).toBeGreaterThan(effect?.particles[2].size!);

      // Check that alpha decreases
      expect(effect?.particles[0].alpha).toBeGreaterThan(effect?.particles[1].alpha!);
      expect(effect?.particles[1].alpha).toBeGreaterThan(effect?.particles[2].alpha!);
    });
  });

  describe('createSparkle', () => {
    test('should create sparkle effect', () => {
      const position: Vector2D = { x: 150, y: 150 };
      const color: Color = { r: 1, g: 1, b: 1 };

      const effectId = builder.createSparkle(position, color);

      expect(effectId).toMatch(/^sparkle_\d+$/);
      const effect = builder.getEffect(effectId);
      expect(effect).toBeDefined();
      expect(effect?.particles.length).toBe(10);
      expect(effect?.position).toEqual(position);
    });

    test('should create particles with random velocity', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 1, b: 0 };

      const effectId = builder.createSparkle(position, color);
      const effect = builder.getEffect(effectId);

      // Check that particles have different velocities
      const velocities = effect?.particles.map(p => p.velocity.x);
      const uniqueVelocities = new Set(velocities);
      expect(uniqueVelocities.size).toBeGreaterThan(1);
    });
  });

  describe('update', () => {
    test('should update particle positions', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100,
        gravity: 50 // Add gravity to ensure y position changes
      };

      const effectId = builder.createExplosion(position, config);
      const effect = builder.getEffect(effectId);
      const initialX = effect?.particles[0].position.x!;
      const initialY = effect?.particles[0].position.y!;

      builder.update(0.016); // ~60fps frame

      const updatedEffect = builder.getEffect(effectId);
      // At least one position should change
      const xChanged = updatedEffect?.particles[0].position.x !== initialX;
      const yChanged = updatedEffect?.particles[0].position.y !== initialY;
      expect(xChanged || yChanged).toBe(true);
    });

    test('should decrease particle life', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      const effectId = builder.createExplosion(position, config);
      const effect = builder.getEffect(effectId);
      const initialLife = effect?.particles[0].life!;

      builder.update(0.1);

      const updatedEffect = builder.getEffect(effectId);
      expect(updatedEffect?.particles[0].life).toBeLessThan(initialLife);
    });

    test('should update particle alpha based on life', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      const effectId = builder.createExplosion(position, config);

      builder.update(0.5);

      const effect = builder.getEffect(effectId);
      expect(effect?.particles[0].alpha).toBeLessThan(1.0);
    });

    test('should remove dead particles', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 5,
        particleLife: 0.1,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      const effectId = builder.createExplosion(position, config);

      builder.update(0.2); // More than particle life

      const effect = builder.getEffect(effectId);
      expect(effect).toBeUndefined(); // Effect should be removed
    });

    test('should deactivate effect when duration expires', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 5,
        particleLife: 0.5,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      const effectId = builder.createExplosion(position, config);

      builder.update(1.0); // More than duration

      const effect = builder.getEffect(effectId);
      expect(effect).toBeUndefined();
    });
  });

  describe('render', () => {
    test('should render active effects', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 3,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      builder.createExplosion(position, config);

      const ctx = {
        save: jest.fn(),
        restore: jest.fn(),
        globalAlpha: 1,
        fillStyle: '',
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn()
      } as any;

      builder.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    test('should apply camera offset', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 1.0,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 0
      };

      builder.createExplosion(position, config);

      const camera: Vector2D = { x: 50, y: 50 };
      const ctx = {
        save: jest.fn(),
        restore: jest.fn(),
        globalAlpha: 1,
        fillStyle: '',
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn()
      } as any;

      builder.render(ctx, camera);

      // Particle at 100,100 with camera at 50,50 should render at 50,50
      expect(ctx.arc).toHaveBeenCalledWith(50, 50, 5, 0, Math.PI * 2);
    });

    test('should skip inactive effects', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 0.1,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      builder.createExplosion(position, config);
      builder.update(1.0); // Deactivate the effect

      const ctx = {
        arc: jest.fn()
      } as any;

      builder.render(ctx);

      expect(ctx.arc).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    test('should remove all effects', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };

      builder.createTrail(position, color);
      builder.createSparkle(position, color);

      expect(builder.getActiveEffects().length).toBe(2);

      builder.clear();

      expect(builder.getActiveEffects().length).toBe(0);
    });
  });

  describe('getEffect', () => {
    test('should return effect by id', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };

      const effectId = builder.createTrail(position, color);
      const effect = builder.getEffect(effectId);

      expect(effect).toBeDefined();
      expect(effect?.id).toBe(effectId);
    });

    test('should return undefined for non-existent effect', () => {
      const effect = builder.getEffect('nonexistent');
      expect(effect).toBeUndefined();
    });
  });

  describe('getActiveEffects', () => {
    test('should return all active effects', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };

      builder.createTrail(position, color);
      builder.createSparkle(position, color);

      const activeEffects = builder.getActiveEffects();
      expect(activeEffects.length).toBe(2);
      expect(activeEffects.every(e => e.active)).toBe(true);
    });

    test('should not include inactive effects', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const color: Color = { r: 1, g: 0, b: 0 };
      const config = {
        particleCount: 1,
        particleLife: 0.1,
        particleSize: 5,
        color,
        spread: 50,
        velocity: 100
      };

      builder.createExplosion(position, config);
      builder.update(1.0); // Deactivate

      const activeEffects = builder.getActiveEffects();
      expect(activeEffects.length).toBe(0);
    });
  });
});
