# 🎮 Demo - PNP Game Engine

Game demos built using concepts from the PNP Game Engine.

---

## 🤖 AI NPC Demo

A demo showcasing the **AI NPC Package** - a system for creating and managing NPCs with artificial intelligence.

### AI NPC Features

- **NPCBuilder**: Create and manage multiple NPCs simultaneously
- **Behavior System**: AI behavior system
  - `IdleBehavior`: NPC stands still, resting
  - `PatrolBehavior`: NPC patrols along waypoints
  - `ChaseBehavior`: NPC chases the player when detected
  - `WanderBehavior`: NPC wanders randomly
- **Auto Behavior Selection**: Automatically selects appropriate behavior based on context
- **Dialog System**: NPC dialogue system
- **NPC Types**: Various NPC types (friendly, hostile, merchant, neutral)

### NPCs in the Demo

| NPC | Type | Behavior | Description |
|-----|------|----------|-------------|
| 🛡️ Guard | neutral | Patrol | Patrols along a fixed path |
| 👹 Monster | hostile | Chase/Wander | Chases player when detected |
| 💰 Merchant | merchant | Idle | Stands in place selling goods |
| 👨‍🌾 Villager | friendly | Wander | Wanders around the village |

### Running the Demo

```bash
# Open the file in a browser
open demo/ai-npc-demo.html  # macOS
xdg-open demo/ai-npc-demo.html  # Linux
start demo/ai-npc-demo.html  # Windows
```

---

## 🌾 Mini Farm 2.5D

This is a small farming game demo with a **Top-Down** view (looking from above) built using concepts from the PNP Game Engine.

## 🎮 Features

- **Top-Down View**: Overhead perspective with easy-to-see square tiles
- **10x10 Field**: 100-cell grid for planting crops
- **House**: Simple design with roof, walls, and windows
- **Player Movement**: Use W/A/S/D keys or mouse click with smooth animation
- **Camera Rotation**: Supports camera rotation at angles 0°, 90°, 180°, 270° (diagonal angles not allowed)
- **Crop System**: 4 types of crops (Carrot, Tomato, Corn, Wheat)
- **Visual Effects**: Sparkle effect, water droplets, progress bars
- **Farming Process**:
  1. Move to an empty plot
  2. Select the type of crop to plant
  3. Sow seeds (costs money)
  4. Water to help the crop grow
  5. Wait for the crop to pass through growth stages
  6. Harvest when mature (earn money)

## 🕹️ Controls Guide

### Character Movement

You can move using **keyboard** or **mouse**:

| Method | Usage |
|--------|-------|
| **Keyboard** | Use W/A/S/D keys or arrow keys |
| **Mouse** | Click on a plot to move there |

Movement follows the visual direction on screen (movement direction automatically adjusts based on camera rotation):

| Key / Button | Action |
|--------------|--------|
| W / ⬆️ | Move up (↑) |
| S / ⬇️ | Move down (↓) |
| A / ⬅️ | Move left (←) |
| D / ➡️ | Move right (→) |

### Camera Rotation

The game supports camera rotation with **4 fixed angles**: 0°, 90°, 180°, 270° (diagonal angles are not allowed to ensure convenient controls).

| Key / Button | Action |
|--------------|--------|
| Q | Rotate camera left (counter-clockwise) |
| E | Rotate camera right (clockwise) |
| ⟲ Q / E ⟳ | UI buttons for camera rotation |

## 🌱 Crop Types

| Crop | Stages | Growth Time | Cost | Harvest |
|------|--------|-------------|------|---------|
| 🥕 Carrot | 3 | 3 seconds | 5💰 | 15💰 |
| 🍅 Tomato | 4 | 4 seconds | 10💰 | 25💰 |
| 🌽 Corn | 5 | 5 seconds | 15💰 | 40💰 |
| 🌾 Wheat | 3 | 2.5 seconds | 3💰 | 10💰 |

## 🚀 Running the Demo

Open the `farm-game.html` file in a web browser:

```bash
# Using http-server
npx http-server . -p 8080
# Then open http://localhost:8080/demo/farm-game.html

# Or simply open directly in the browser
open demo/farm-game.html  # macOS
xdg-open demo/farm-game.html  # Linux
start demo/farm-game.html  # Windows
```

## 🏗️ Technical Implementation

This demo illustrates concepts from PNP Game Engine with a Top-Down view:

1. **Game Loop**: Uses `requestAnimationFrame` for smooth game loop
2. **Top-Down Rendering**: Draws square grid from above
3. **Camera Rotation**: Supports 90° camera rotation with 4 fixed angles (0°, 90°, 180°, 270°)
4. **Tile-based Map**: Map based on square grid (similar to MapBuilder)
5. **Character Control**: Character control with keyboard and mouse input (similar to CharacterBuilder + InputManager)
6. **Click-to-Move**: Converts screen coordinates to grid coordinates for mouse movement
7. **State Management**: Manages crop and player states
8. **Canvas Rendering**: 2D graphics rendering

## 📐 Coordinate Math

Formula for converting coordinates from grid to screen (with camera rotation support):
```javascript
// Grid coordinates (gridX, gridY): Integer position in the 10x10 grid (0-9)
// Screen coordinates (screenX, screenY): Pixel position on canvas

// tileSize = 50px
// offsetX, offsetY = padding (50px)

// 1. Rotate grid coordinates based on camera angle
rotatedX, rotatedY = rotateGridCoords(gridX, gridY, cameraAngle)

// 2. Convert to screen coordinates (top-down)
screenX = rotatedX * tileSize + offsetX + tileSize / 2
screenY = rotatedY * tileSize + offsetY + tileSize / 2

// Reverse conversion from screen to grid (for click-to-move)
// 1. Calculate grid coordinates from screen
gx = Math.floor((screenX - offsetX) / tileSize)
gy = Math.floor((screenY - offsetY) / tileSize)

// 2. Reverse rotation based on camera angle
gridX, gridY = inverseRotateGridCoords(gx, gy, cameraAngle)
```

## 📁 Structure

```
demo/
├── README.md           # This file (English)
├── README.vi.md        # Vietnamese version
├── ai-npc-demo.html    # AI NPC demo
└── farm-game.html      # Mini farm game (self-contained HTML + CSS + JS)
```

---

*Demo created to showcase the capabilities of PNP Game Engine*
