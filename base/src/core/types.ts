/**
 * Core types for the game engine
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Transform {
  position: Vector2D;
  rotation: number;
  scale: Vector2D;
}

export interface Sprite {
  image: HTMLImageElement | null;
  sourceRect?: Rect;
  size: Size;
}

export interface AnimationFrame {
  sprite: Sprite;
  duration: number;
}

export interface Animation {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
}
