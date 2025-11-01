/**
 * Character Builder - Creates and manages game characters
 */

import { Vector2D, Size, Transform, Animation, Sprite } from '../core/types';

export interface CharacterStats {
  health: number;
  maxHealth: number;
  speed: number;
  strength?: number;
  defense?: number;
}

export interface Character {
  id: string;
  name: string;
  transform: Transform;
  size: Size;
  sprite: Sprite;
  animations: Map<string, Animation>;
  currentAnimation: string | null;
  stats: CharacterStats;
  properties?: Record<string, unknown>;
}

export class CharacterBuilder {
  private characters: Map<string, Character> = new Map();

  /**
   * Create a new character
   */
  createCharacter(
    id: string,
    name: string,
    position: Vector2D,
    size: Size,
    stats: CharacterStats
  ): Character {
    const character: Character = {
      id,
      name,
      transform: {
        position,
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      size,
      sprite: {
        image: null,
        size
      },
      animations: new Map(),
      currentAnimation: null,
      stats,
      properties: {}
    };

    this.characters.set(id, character);
    return character;
  }

  /**
   * Get character by id
   */
  getCharacter(id: string): Character | undefined {
    return this.characters.get(id);
  }

  /**
   * Set character sprite
   */
  setSprite(characterId: string, sprite: Sprite): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    character.sprite = sprite;
    return this;
  }

  /**
   * Add animation to character
   */
  addAnimation(characterId: string, animation: Animation): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    character.animations.set(animation.name, animation);
    return this;
  }

  /**
   * Set current animation
   */
  setAnimation(characterId: string, animationName: string): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    if (!character.animations.has(animationName)) {
      throw new Error(`Animation ${animationName} not found for character ${characterId}`);
    }
    character.currentAnimation = animationName;
    return this;
  }

  /**
   * Move character
   */
  moveCharacter(characterId: string, deltaX: number, deltaY: number): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    character.transform.position.x += deltaX;
    character.transform.position.y += deltaY;
    return this;
  }

  /**
   * Set character position
   */
  setPosition(characterId: string, x: number, y: number): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    character.transform.position.x = x;
    character.transform.position.y = y;
    return this;
  }

  /**
   * Update character stats
   */
  updateStats(characterId: string, stats: Partial<CharacterStats>): CharacterBuilder {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character ${characterId} not found`);
    }
    Object.assign(character.stats, stats);
    return this;
  }

  /**
   * Render character to canvas
   */
  render(ctx: CanvasRenderingContext2D, character: Character, camera?: Vector2D): void {
    const cameraPos = camera || { x: 0, y: 0 };
    const x = character.transform.position.x - cameraPos.x;
    const y = character.transform.position.y - cameraPos.y;

    ctx.save();
    
    // Apply transformations
    ctx.translate(x + character.size.width / 2, y + character.size.height / 2);
    ctx.rotate(character.transform.rotation);
    ctx.scale(character.transform.scale.x, character.transform.scale.y);
    ctx.translate(-character.size.width / 2, -character.size.height / 2);

    // Draw sprite or placeholder
    if (character.sprite.image) {
      if (character.sprite.sourceRect) {
        const src = character.sprite.sourceRect;
        ctx.drawImage(
          character.sprite.image,
          src.x, src.y, src.width, src.height,
          0, 0, character.size.width, character.size.height
        );
      } else {
        ctx.drawImage(
          character.sprite.image,
          0, 0, character.size.width, character.size.height
        );
      }
    } else {
      // Draw placeholder
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, character.size.width, character.size.height);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(0, 0, character.size.width, character.size.height);
    }

    ctx.restore();

    // Draw health bar
    this.renderHealthBar(ctx, character, x, y);
  }

  /**
   * Render health bar above character
   */
  private renderHealthBar(ctx: CanvasRenderingContext2D, character: Character, x: number, y: number): void {
    const barWidth = character.size.width;
    const barHeight = 4;
    const barY = y - 10;

    // Background
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x, barY, barWidth, barHeight);

    // Health
    const healthPercent = character.stats.health / character.stats.maxHealth;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, barY, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(x, barY, barWidth, barHeight);
  }

  /**
   * Update character (call every frame)
   */
  update(_character: Character, _deltaTime: number): void {
    // Animation update logic can be added here
    // For now, this is a placeholder
  }
}
