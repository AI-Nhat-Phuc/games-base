# 🎮 Demo - PNP Game Engine

Các demo game được xây dựng sử dụng các concept từ PNP Game Engine.

---

## 🤖 AI NPC Demo

Demo minh họa **AI NPC Package** - hệ thống tạo và quản lý NPC với trí tuệ nhân tạo.

### Tính năng AI NPC

- **NPCBuilder**: Tạo và quản lý nhiều NPC cùng lúc
- **Behavior System**: Hệ thống hành vi AI
  - `IdleBehavior`: NPC đứng yên, nghỉ ngơi
  - `PatrolBehavior`: NPC tuần tra theo waypoints
  - `ChaseBehavior`: NPC đuổi theo player khi phát hiện
  - `WanderBehavior`: NPC đi lang thang ngẫu nhiên
- **Auto Behavior Selection**: Tự động chọn hành vi phù hợp dựa trên context
- **Dialog System**: Hệ thống hội thoại NPC
- **NPC Types**: Các loại NPC (friendly, hostile, merchant, neutral)

### Các NPC trong Demo

| NPC | Loại | Hành vi | Mô tả |
|-----|------|---------|-------|
| 🛡️ Lính Canh | neutral | Patrol | Tuần tra theo đường đi cố định |
| 👹 Quái Vật | hostile | Chase/Wander | Đuổi theo player khi phát hiện |
| 💰 Thương Nhân | merchant | Idle | Đứng tại chỗ bán hàng |
| 👨‍🌾 Dân Làng | friendly | Wander | Đi lang thang quanh làng |

### Chạy Demo

```bash
# Mở file trong trình duyệt
open demo/ai-npc-demo.html  # macOS
xdg-open demo/ai-npc-demo.html  # Linux
start demo/ai-npc-demo.html  # Windows
```

---

## 🌾 Nông Trại Mini 2.5D

Đây là demo game nông trại nhỏ với giao diện **Top-Down** (nhìn từ trên xuống) được xây dựng sử dụng các concept từ PNP Game Engine.

## 🎮 Tính năng

- **Giao diện Top-Down**: Góc nhìn từ trên xuống với các ô vuông dễ nhìn
- **Cánh đồng 10x10**: Lưới 100 ô có thể trồng cây
- **Ngôi nhà**: Thiết kế đơn giản với mái, tường, cửa sổ
- **Người chơi di chuyển**: Sử dụng phím W/A/S/D hoặc nhấp chuột với animation mượt mà
- **Xoay camera**: Hỗ trợ xoay camera với các góc 0°, 90°, 180°, 270° (không cho phép góc xéo)
- **Hệ thống cây trồng**: 4 loại cây (Cà rốt, Cà chua, Ngô, Lúa mì)
- **Hiệu ứng đẹp mắt**: Sparkle effect, water droplets, progress bars
- **Quy trình canh tác**:
  1. Di chuyển đến ô đất trống
  2. Chọn loại cây muốn trồng
  3. Gieo hạt (tốn tiền)
  4. Tưới nước để cây phát triển
  5. Đợi cây qua các giai đoạn
  6. Thu hoạch khi cây trưởng thành (nhận tiền)

## 🕹️ Hướng dẫn điều khiển

### Di chuyển nhân vật

Có thể di chuyển bằng **bàn phím** hoặc **chuột**:

| Phương thức | Cách sử dụng |
|-------------|--------------|
| **Bàn phím** | Sử dụng phím W/A/S/D hoặc mũi tên |
| **Chuột** | Nhấp chuột vào ô đất để di chuyển đến đó |

Di chuyển trực quan theo hướng trên màn hình (hướng di chuyển tự động điều chỉnh theo góc xoay camera):

| Phím / Nút | Hành động |
|------------|-----------|
| W / ⬆️ | Di chuyển lên (↑) |
| S / ⬇️ | Di chuyển xuống (↓) |
| A / ⬅️ | Di chuyển trái (←) |
| D / ➡️ | Di chuyển phải (→) |

### Xoay Camera

Game hỗ trợ xoay camera với **4 góc cố định**: 0°, 90°, 180°, 270° (không cho phép các góc xéo để đảm bảo điều khiển thuận tiện).

| Phím / Nút | Hành động |
|------------|-----------|
| Q | Xoay camera trái (ngược chiều kim đồng hồ) |
| E | Xoay camera phải (theo chiều kim đồng hồ) |
| ⟲ Q / E ⟳ | Nút UI để xoay camera |

## 🌱 Loại cây trồng

| Cây | Giai đoạn | Thời gian | Chi phí | Thu hoạch |
|-----|-----------|-----------|---------|-----------|
| 🥕 Cà rốt | 3 | 3 giây | 5💰 | 15💰 |
| 🍅 Cà chua | 4 | 4 giây | 10💰 | 25💰 |
| 🌽 Ngô | 5 | 5 giây | 15💰 | 40💰 |
| 🌾 Lúa mì | 3 | 2.5 giây | 3💰 | 10💰 |

## 🚀 Chạy Demo

Mở file `farm-game.html` trong trình duyệt web:

```bash
# Sử dụng http-server
npx http-server . -p 8080
# Sau đó mở http://localhost:8080/demo/farm-game.html

# Hoặc đơn giản mở trực tiếp trong trình duyệt
open demo/farm-game.html  # macOS
xdg-open demo/farm-game.html  # Linux
start demo/farm-game.html  # Windows
```

## 🏗️ Kỹ thuật sử dụng

Demo này minh họa các concept từ PNP Game Engine với góc nhìn Top-Down:

1. **Game Loop**: Sử dụng `requestAnimationFrame` cho vòng lặp game mượt mà
2. **Top-Down Rendering**: Vẽ lưới vuông từ trên xuống
3. **Camera Rotation**: Hỗ trợ xoay camera 90° với 4 góc cố định (0°, 90°, 180°, 270°)
4. **Tile-based Map**: Bản đồ dựa trên lưới ô vuông (tương tự MapBuilder)
5. **Character Control**: Điều khiển nhân vật với keyboard và mouse input (tương tự CharacterBuilder + InputManager)
6. **Click-to-Move**: Chuyển đổi tọa độ màn hình sang tọa độ grid để di chuyển bằng chuột
7. **State Management**: Quản lý trạng thái cây trồng và người chơi
8. **Canvas Rendering**: Vẽ đồ họa 2D

## 📐 Coordinate Math

Công thức chuyển đổi tọa độ từ grid sang màn hình (với hỗ trợ xoay camera):
```javascript
// Grid coordinates (gridX, gridY): Integer position in the 10x10 grid (0-9)
// Screen coordinates (screenX, screenY): Pixel position on canvas

// tileSize = 50px
// offsetX, offsetY = padding (50px)

// 1. Xoay tọa độ grid theo góc camera
rotatedX, rotatedY = rotateGridCoords(gridX, gridY, cameraAngle)

// 2. Chuyển đổi sang tọa độ màn hình (top-down)
screenX = rotatedX * tileSize + offsetX + tileSize / 2
screenY = rotatedY * tileSize + offsetY + tileSize / 2

// Chuyển đổi ngược từ màn hình sang grid (cho click-to-move)
// 1. Tính tọa độ grid từ màn hình
gx = Math.floor((screenX - offsetX) / tileSize)
gy = Math.floor((screenY - offsetY) / tileSize)

// 2. Xoay ngược theo góc camera
gridX, gridY = inverseRotateGridCoords(gx, gy, cameraAngle)
```

## 📁 Cấu trúc

```
demo/
├── README.md           # File này
└── farm-game.html      # Game nông trại mini (tự chứa HTML + CSS + JS)
```

---

*Demo được tạo để minh họa khả năng của PNP Game Engine*
