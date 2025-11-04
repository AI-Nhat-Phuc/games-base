/**
 * Tests for MapBuilder
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { MapBuilder } from '../MapBuilder';

describe('MapBuilder', () => {
  let builder: MapBuilder;

  beforeEach(() => {
    builder = new MapBuilder();
  });

  describe('setTileSize', () => {
    test('should set tile size', () => {
      builder.setTileSize(64, 64);
      const map = builder.build();

      expect(map.tileSize.width).toBe(64);
      expect(map.tileSize.height).toBe(64);
    });

    test('should support chaining', () => {
      const result = builder.setTileSize(32, 32);
      expect(result).toBe(builder);
    });
  });

  describe('setMapSize', () => {
    test('should set map size', () => {
      builder.setMapSize(20, 15);
      const map = builder.build();

      expect(map.mapSize.width).toBe(20);
      expect(map.mapSize.height).toBe(15);
    });

    test('should support chaining', () => {
      const result = builder.setMapSize(10, 10);
      expect(result).toBe(builder);
    });
  });

  describe('addTile', () => {
    test('should add tile to tileset', () => {
      const tile = {
        id: 'grass',
        sprite: null,
        collision: false
      };

      builder.addTile('grass', tile);
      const map = builder.build();

      expect(map.tileset.has('grass')).toBe(true);
      expect(map.tileset.get('grass')).toEqual(tile);
    });

    test('should support chaining', () => {
      const tile = {
        id: 'stone',
        sprite: null,
        collision: true
      };

      const result = builder.addTile('stone', tile);
      expect(result).toBe(builder);
    });
  });

  describe('createLayer', () => {
    test('should create a new layer with empty tiles', () => {
      builder.setMapSize(5, 5);
      builder.createLayer('ground');
      const map = builder.build();

      expect(map.layers.length).toBe(1);
      expect(map.layers[0].name).toBe('ground');
      expect(map.layers[0].visible).toBe(true);
      expect(map.layers[0].opacity).toBe(1.0);
      expect(map.layers[0].tiles.length).toBe(5);
      expect(map.layers[0].tiles[0].length).toBe(5);
      expect(map.layers[0].tiles[0][0]).toBeNull();
    });

    test('should support multiple layers', () => {
      builder.createLayer('ground');
      builder.createLayer('objects');
      const map = builder.build();

      expect(map.layers.length).toBe(2);
      expect(map.layers[0].name).toBe('ground');
      expect(map.layers[1].name).toBe('objects');
    });

    test('should support chaining', () => {
      const result = builder.createLayer('test');
      expect(result).toBe(builder);
    });
  });

  describe('setTile', () => {
    beforeEach(() => {
      builder.setMapSize(10, 10);
      builder.createLayer('ground');
    });

    test('should set tile at valid position', () => {
      builder.setTile(0, 5, 5, 'grass');
      
      expect(builder.getTile(0, 5, 5)).toBe('grass');
    });

    test('should set tile to null', () => {
      builder.setTile(0, 3, 3, 'stone');
      builder.setTile(0, 3, 3, null);
      
      expect(builder.getTile(0, 3, 3)).toBeNull();
    });

    test('should throw error for invalid layer index', () => {
      expect(() => builder.setTile(5, 0, 0, 'grass')).toThrow('Layer index 5 out of bounds');
      expect(() => builder.setTile(-1, 0, 0, 'grass')).toThrow('Layer index -1 out of bounds');
    });

    test('should throw error for out of bounds position', () => {
      expect(() => builder.setTile(0, 10, 5, 'grass')).toThrow('Tile position (10, 5) out of bounds');
      expect(() => builder.setTile(0, 5, 10, 'grass')).toThrow('Tile position (5, 10) out of bounds');
      expect(() => builder.setTile(0, -1, 5, 'grass')).toThrow('Tile position (-1, 5) out of bounds');
    });

    test('should throw error for reserved property names', () => {
      expect(() => builder.setTile(0, 0, 0, '__proto__')).toThrow('Invalid tile ID: reserved property name');
      expect(() => builder.setTile(0, 0, 0, 'constructor')).toThrow('Invalid tile ID: reserved property name');
      expect(() => builder.setTile(0, 0, 0, 'prototype')).toThrow('Invalid tile ID: reserved property name');
    });

    test('should support chaining', () => {
      const result = builder.setTile(0, 0, 0, 'grass');
      expect(result).toBe(builder);
    });
  });

  describe('getTile', () => {
    beforeEach(() => {
      builder.setMapSize(10, 10);
      builder.createLayer('ground');
    });

    test('should get tile at valid position', () => {
      builder.setTile(0, 3, 4, 'stone');
      
      expect(builder.getTile(0, 3, 4)).toBe('stone');
    });

    test('should return null for empty tiles', () => {
      expect(builder.getTile(0, 5, 5)).toBeNull();
    });

    test('should return null for invalid layer index', () => {
      expect(builder.getTile(5, 0, 0)).toBeNull();
      expect(builder.getTile(-1, 0, 0)).toBeNull();
    });

    test('should return null for out of bounds position', () => {
      expect(builder.getTile(0, 10, 5)).toBeNull();
      expect(builder.getTile(0, 5, 10)).toBeNull();
      expect(builder.getTile(0, -1, 5)).toBeNull();
    });
  });

  describe('build', () => {
    test('should build map with all properties', () => {
      builder.setTileSize(32, 32);
      builder.setMapSize(15, 10);
      builder.createLayer('ground');
      builder.addTile('grass', {
        id: 'grass',
        sprite: null,
        collision: false
      });

      const map = builder.build();

      expect(map.name).toBe('game-map');
      expect(map.tileSize).toEqual({ width: 32, height: 32 });
      expect(map.mapSize).toEqual({ width: 15, height: 10 });
      expect(map.layers.length).toBe(1);
      expect(map.tileset.size).toBe(1);
    });
  });

  describe('render', () => {
    test('should render visible layers', () => {
      builder.setMapSize(3, 3);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      
      const map = builder.build();
      const ctx = {
        globalAlpha: 1,
        drawImage: jest.fn()
      } as any;

      builder.render(ctx, map);

      expect(ctx.globalAlpha).toBe(1);
    });

    test('should skip invisible layers', () => {
      builder.setMapSize(2, 2);
      builder.createLayer('ground');
      const map = builder.build();
      map.layers[0].visible = false;

      const ctx = {
        globalAlpha: 1,
        drawImage: jest.fn()
      } as any;

      builder.render(ctx, map);

      expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    test('should apply layer opacity', () => {
      builder.setMapSize(2, 2);
      builder.createLayer('ground');
      const map = builder.build();
      map.layers[0].opacity = 0.5;

      const ctx = {
        globalAlpha: 1,
        drawImage: jest.fn()
      } as any;

      builder.render(ctx, map);

      expect(ctx.globalAlpha).toBe(1); // Reset to 1 after rendering
    });

    test('should apply camera offset', () => {
      const mockImage = {} as HTMLImageElement;
      builder.setMapSize(2, 2);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      builder.addTile('grass', {
        id: 'grass',
        sprite: mockImage,
        collision: false
      });
      builder.setTile(0, 0, 0, 'grass');
      
      const map = builder.build();
      const camera = { x: 10, y: 20 };
      const ctx = {
        globalAlpha: 1,
        drawImage: jest.fn()
      } as any;

      builder.render(ctx, map, camera);

      expect(ctx.drawImage).toHaveBeenCalledWith(mockImage, -10, -20, 32, 32);
    });
  });

  describe('checkCollision', () => {
    test('should return true for collision tile', () => {
      builder.setMapSize(10, 10);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      builder.addTile('wall', {
        id: 'wall',
        sprite: null,
        collision: true
      });
      builder.setTile(0, 5, 5, 'wall');
      
      const map = builder.build();
      
      // Position in world coordinates (tile 5,5 = 160, 160)
      expect(builder.checkCollision(map, 160, 160)).toBe(true);
    });

    test('should return false for non-collision tile', () => {
      builder.setMapSize(10, 10);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      builder.addTile('grass', {
        id: 'grass',
        sprite: null,
        collision: false
      });
      builder.setTile(0, 3, 3, 'grass');
      
      const map = builder.build();
      
      expect(builder.checkCollision(map, 96, 96)).toBe(false);
    });

    test('should return false for empty tiles', () => {
      builder.setMapSize(10, 10);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      
      const map = builder.build();
      
      expect(builder.checkCollision(map, 64, 64)).toBe(false);
    });

    test('should skip invisible layers', () => {
      builder.setMapSize(10, 10);
      builder.setTileSize(32, 32);
      builder.createLayer('ground');
      builder.addTile('wall', {
        id: 'wall',
        sprite: null,
        collision: true
      });
      builder.setTile(0, 2, 2, 'wall');
      
      const map = builder.build();
      map.layers[0].visible = false;
      
      expect(builder.checkCollision(map, 64, 64)).toBe(false);
    });
  });
});
