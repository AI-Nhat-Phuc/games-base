/**
 * Asset Loader - Loads and manages game assets
 */

export class AssetLoader {
  private images: Map<string, HTMLImageElement> = new Map();
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private loadingPromises: Promise<void>[] = [];

  /**
   * Load an image
   */
  loadImage(key: string, url: string): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loadingPromises.push(promise);
    return promise;
  }

  /**
   * Load a sound
   */
  loadSound(key: string, url: string): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds.set(key, audio);
        resolve();
      };
      audio.onerror = () => {
        reject(new Error(`Failed to load sound: ${url}`));
      };
      audio.src = url;
    });

    this.loadingPromises.push(promise);
    return promise;
  }

  /**
   * Wait for all assets to load
   */
  async waitForAll(): Promise<void> {
    await Promise.all(this.loadingPromises);
    this.loadingPromises = [];
  }

  /**
   * Get an image
   */
  getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  /**
   * Get a sound
   */
  getSound(key: string): HTMLAudioElement | undefined {
    return this.sounds.get(key);
  }

  /**
   * Play a sound
   */
  playSound(key: string, loop: boolean = false): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.loop = loop;
      sound.currentTime = 0;
      sound.play().catch(err => console.error('Error playing sound:', err));
    }
  }

  /**
   * Stop a sound
   */
  stopSound(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}
