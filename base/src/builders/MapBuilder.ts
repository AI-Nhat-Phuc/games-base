/**
 * Map Builder - Creates and manages game maps
 */

import { Vector2D, Size } from '../core/types';

export interface Tile {
  id: string;
  sprite: HTMLImageElement | null;
  collision: boolean;
  properties?: Record<string, unknown>;
}

export interface TileLayer {
  name: string;
  tiles: (string | null)[][];
  visible: boolean;
  opacity: number;
}

export interface GameMap {
  name: string;
  tileSize: Size;
  mapSize: Size;
  layers: TileLayer[];
  tileset: Map<string, Tile>;
}

export class MapBuilder {
  private tileset: Map<string, Tile> = new Map();
  private layers: TileLayer[] = [];
  private tileSize: Size = { width: 32, height: 32 };
  private mapSize: Size = { width: 10, height: 10 };

  /**
   * Set tile size for the map
   */
  setTileSize(width: number, height: number): MapBuilder {
    this.tileSize = { width, height };
    return this;
  }

  /**
   * Set map size (in tiles)
   */
  setMapSize(width: number, height: number): MapBuilder {
    this.mapSize = { width, height };
    return this;
  }

  /**
   * Add a tile to the tileset
   */
  addTile(id: string, tile: Tile): MapBuilder {
    this.tileset.set(id, tile);
    return this;
  }

  /**
   * Create a new layer
   */
  createLayer(name: string): MapBuilder {
    const tiles: (string | null)[][] = [];
    for (let y = 0; y < this.mapSize.height; y++) {
      const row: (string | null)[] = [];
      for (let x = 0; x < this.mapSize.width; x++) {
        row.push(null);
      }
      tiles.push(row);
    }

    this.layers.push({
      name,
      tiles,
      visible: true,
      opacity: 1.0
    });
    return this;
  }

  /**
   * Set tile at position in a layer
   */
  setTile(layerIndex: number, x: number, y: number, tileId: string | null): MapBuilder {
    if (layerIndex < 0 || layerIndex >= this.layers.length) {
      throw new Error(`Layer index ${layerIndex} out of bounds`);
    }
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) {
      throw new Error(`Tile position (${x}, ${y}) out of bounds`);
    }

    this.layers[layerIndex].tiles[y][x] = tileId;
    return this;
  }

  /**
   * Get tile at position in a layer
   */
  getTile(layerIndex: number, x: number, y: number): string | null {
    if (layerIndex < 0 || layerIndex >= this.layers.length) {
      return null;
    }
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) {
      return null;
    }
    return this.layers[layerIndex].tiles[y][x];
  }

  /**
   * Build and return the map
   */
  build(): GameMap {
    return {
      name: 'game-map',
      tileSize: this.tileSize,
      mapSize: this.mapSize,
      layers: this.layers,
      tileset: this.tileset
    };
  }

  /**
   * Render the map to a canvas context
   */
  render(ctx: CanvasRenderingContext2D, map: GameMap, camera?: Vector2D): void {
    const cameraPos = camera || { x: 0, y: 0 };

    for (const layer of map.layers) {
      if (!layer.visible) continue;

      ctx.globalAlpha = layer.opacity;

      for (let y = 0; y < map.mapSize.height; y++) {
        for (let x = 0; x < map.mapSize.width; x++) {
          const tileId = layer.tiles[y][x];
          if (!tileId) continue;

          const tile = map.tileset.get(tileId);
          if (!tile || !tile.sprite) continue;

          const posX = x * map.tileSize.width - cameraPos.x;
          const posY = y * map.tileSize.height - cameraPos.y;

          ctx.drawImage(
            tile.sprite,
            posX,
            posY,
            map.tileSize.width,
            map.tileSize.height
          );
        }
      }

      ctx.globalAlpha = 1.0;
    }
  }

  /**
   * Check collision at world position
   */
  checkCollision(map: GameMap, worldX: number, worldY: number): boolean {
    const tileX = Math.floor(worldX / map.tileSize.width);
    const tileY = Math.floor(worldY / map.tileSize.height);

    for (const layer of map.layers) {
      if (!layer.visible) continue;

      const tileId = layer.tiles[tileY]?.[tileX];
      if (!tileId) continue;

      const tile = map.tileset.get(tileId);
      if (tile && tile.collision) {
        return true;
      }
    }

    return false;
  }
}
