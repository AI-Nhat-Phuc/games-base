/**
 * Tests for CharacterBuilder
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { CharacterBuilder } from '../CharacterBuilder';
import { Vector2D, Size, Animation, Sprite } from '../../core/types';

describe('CharacterBuilder', () => {
  let builder: CharacterBuilder;

  beforeEach(() => {
    builder = new CharacterBuilder();
  });

  describe('createCharacter', () => {
    test('should create a character with given properties', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const size: Size = { width: 50, height: 50 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      const character = builder.createCharacter('hero', 'Hero', position, size, stats);

      expect(character.id).toBe('hero');
      expect(character.name).toBe('Hero');
      expect(character.transform.position).toEqual(position);
      expect(character.size).toEqual(size);
      expect(character.stats).toEqual(stats);
      expect(character.sprite.image).toBeNull();
      expect(character.currentAnimation).toBeNull();
      expect(character.animations.size).toBe(0);
    });

    test('should initialize transform with default rotation and scale', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 50, maxHealth: 50, speed: 3 };

      const character = builder.createCharacter('npc', 'NPC', position, size, stats);

      expect(character.transform.rotation).toBe(0);
      expect(character.transform.scale).toEqual({ x: 1, y: 1 });
    });
  });

  describe('getCharacter', () => {
    test('should return created character by id', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      builder.createCharacter('test', 'Test', position, size, stats);
      const character = builder.getCharacter('test');

      expect(character).toBeDefined();
      expect(character?.id).toBe('test');
    });

    test('should return undefined for non-existent character', () => {
      const character = builder.getCharacter('nonexistent');
      expect(character).toBeUndefined();
    });
  });

  describe('setSprite', () => {
    test('should set sprite for character', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };
      const sprite: Sprite = {
        image: null,
        size: { width: 64, height: 64 }
      };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.setSprite('hero', sprite);

      const character = builder.getCharacter('hero');
      expect(character?.sprite).toEqual(sprite);
    });

    test('should throw error for non-existent character', () => {
      const sprite: Sprite = {
        image: null,
        size: { width: 64, height: 64 }
      };

      expect(() => builder.setSprite('nonexistent', sprite)).toThrow('Character nonexistent not found');
    });
  });

  describe('addAnimation', () => {
    test('should add animation to character', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };
      const animation: Animation = {
        name: 'walk',
        frames: [],
        loop: true
      };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.addAnimation('hero', animation);

      const character = builder.getCharacter('hero');
      expect(character?.animations.has('walk')).toBe(true);
      expect(character?.animations.get('walk')).toEqual(animation);
    });

    test('should throw error for non-existent character', () => {
      const animation: Animation = {
        name: 'walk',
        frames: [],
        loop: true
      };

      expect(() => builder.addAnimation('nonexistent', animation)).toThrow('Character nonexistent not found');
    });
  });

  describe('setAnimation', () => {
    test('should set current animation for character', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };
      const animation: Animation = {
        name: 'run',
        frames: [],
        loop: true
      };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.addAnimation('hero', animation);
      builder.setAnimation('hero', 'run');

      const character = builder.getCharacter('hero');
      expect(character?.currentAnimation).toBe('run');
    });

    test('should throw error for non-existent character', () => {
      expect(() => builder.setAnimation('nonexistent', 'walk')).toThrow('Character nonexistent not found');
    });

    test('should throw error for non-existent animation', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      builder.createCharacter('hero', 'Hero', position, size, stats);

      expect(() => builder.setAnimation('hero', 'walk')).toThrow('Animation walk not found for character hero');
    });
  });

  describe('moveCharacter', () => {
    test('should move character by delta values', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.moveCharacter('hero', 10, -5);

      const character = builder.getCharacter('hero');
      expect(character?.transform.position.x).toBe(110);
      expect(character?.transform.position.y).toBe(195);
    });

    test('should throw error for non-existent character', () => {
      expect(() => builder.moveCharacter('nonexistent', 10, 10)).toThrow('Character nonexistent not found');
    });
  });

  describe('setPosition', () => {
    test('should set character position', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.setPosition('hero', 50, 75);

      const character = builder.getCharacter('hero');
      expect(character?.transform.position.x).toBe(50);
      expect(character?.transform.position.y).toBe(75);
    });

    test('should throw error for non-existent character', () => {
      expect(() => builder.setPosition('nonexistent', 10, 10)).toThrow('Character nonexistent not found');
    });
  });

  describe('updateStats', () => {
    test('should update character stats partially', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      builder.createCharacter('hero', 'Hero', position, size, stats);
      builder.updateStats('hero', { health: 80, speed: 7 });

      const character = builder.getCharacter('hero');
      expect(character?.stats.health).toBe(80);
      expect(character?.stats.maxHealth).toBe(100);
      expect(character?.stats.speed).toBe(7);
    });

    test('should throw error for non-existent character', () => {
      expect(() => builder.updateStats('nonexistent', { health: 50 })).toThrow('Character nonexistent not found');
    });
  });

  describe('render', () => {
    test('should render character with placeholder when no sprite', () => {
      const position: Vector2D = { x: 50, y: 50 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      const character = builder.createCharacter('hero', 'Hero', position, size, stats);

      // Mock canvas context
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
      } as any;

      builder.render(ctx, character);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.fillRect).toHaveBeenCalled();
      expect(ctx.strokeRect).toHaveBeenCalled();
    });

    test('should apply camera offset when rendering', () => {
      const position: Vector2D = { x: 100, y: 100 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };
      const camera: Vector2D = { x: 50, y: 50 };

      const character = builder.createCharacter('hero', 'Hero', position, size, stats);

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
      } as any;

      builder.render(ctx, character, camera);

      // Character at 100,100 with camera at 50,50 should render at 50,50
      expect(ctx.translate).toHaveBeenCalledWith(66, 66); // 50 + 32/2, 50 + 32/2
    });
  });

  describe('update', () => {
    test('should call update without errors', () => {
      const position: Vector2D = { x: 0, y: 0 };
      const size: Size = { width: 32, height: 32 };
      const stats = { health: 100, maxHealth: 100, speed: 5 };

      const character = builder.createCharacter('hero', 'Hero', position, size, stats);

      expect(() => builder.update(character, 0.016)).not.toThrow();
    });
  });
});
