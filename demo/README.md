# 🌾 Demo - Nông Trại Mini 2.5D

Đây là demo game nông trại nhỏ với giao diện **2.5D Isometric** được xây dựng sử dụng các concept từ PNP Game Engine.

![Farm Game 2.5D Demo](https://github.com/user-attachments/assets/fdab578b-d1eb-46cd-9075-5bb22ec1c120)

## 🎮 Tính năng

- **Giao diện 2.5D Isometric**: Góc nhìn isometric tạo chiều sâu cho game
- **Cánh đồng 10x10**: Lưới 100 ô có thể trồng cây với hiệu ứng 3D
- **Ngôi nhà 3D**: Thiết kế isometric với mái, tường, cửa sổ
- **Người chơi di chuyển**: Sử dụng phím W/A/S/D hoặc nhấp chuột với animation mượt mà
- **Xoay camera 2.5D**: Hỗ trợ xoay camera với các góc 0°, 90°, 180°, 270° (không cho phép góc xéo)
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

Di chuyển theo góc nhìn isometric (hướng di chuyển tự động điều chỉnh theo góc xoay camera):

| Phím / Nút | Hành động (tại góc 0°) |
|------------|------------------------|
| W / ⬆️ | Di chuyển lên-trái (↖) |
| S / ⬇️ | Di chuyển xuống-phải (↘) |
| A / ⬅️ | Di chuyển xuống-trái (↙) |
| D / ➡️ | Di chuyển lên-phải (↗) |

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

Demo này minh họa các concept từ PNP Game Engine với góc nhìn 2.5D:

1. **Game Loop**: Sử dụng `requestAnimationFrame` cho vòng lặp game mượt mà
2. **Isometric Rendering**: Chuyển đổi tọa độ grid sang tọa độ màn hình isometric
3. **Camera Rotation**: Hỗ trợ xoay camera 90° với 4 góc cố định (0°, 90°, 180°, 270°)
4. **Depth Sorting**: Vẽ tiles theo thứ tự từ xa đến gần để tạo hiệu ứng 3D (có xem xét góc xoay camera)
5. **Tile-based Map**: Bản đồ dựa trên lưới ô với rendering isometric (tương tự MapBuilder)
6. **Character Control**: Điều khiển nhân vật với keyboard và mouse input (tương tự CharacterBuilder + InputManager)
7. **Click-to-Move**: Chuyển đổi tọa độ màn hình sang tọa độ grid để di chuyển bằng chuột
8. **State Management**: Quản lý trạng thái cây trồng và người chơi
9. **Canvas 2.5D Rendering**: Vẽ đồ họa isometric với độ sâu và bóng đổ

## 📐 Isometric Math

Công thức chuyển đổi tọa độ từ grid sang màn hình (với hỗ trợ xoay camera):
```javascript
// Grid coordinates (gridX, gridY): Integer position in the 10x10 grid (0-9)
// Screen coordinates (screenX, screenY): Pixel position on canvas

// tileWidth = 64px, tileHeight = 32px
// offsetX = canvas center X, offsetY = top padding (80px)

// 1. Xoay tọa độ grid theo góc camera
rotatedX, rotatedY = rotateGridCoords(gridX, gridY, cameraAngle)

// 2. Chuyển đổi sang tọa độ màn hình isometric
screenX = (rotatedX - rotatedY) * (tileWidth / 2) + offsetX
screenY = (rotatedX + rotatedY) * (tileHeight / 2) + offsetY

// Chuyển đổi ngược từ màn hình sang grid (cho click-to-move)
// 1. Tính tọa độ grid từ màn hình
gx = ((screenX - offsetX) / (tileWidth/2) + (screenY - offsetY) / (tileHeight/2)) / 2
gy = ((screenY - offsetY) / (tileHeight/2) - (screenX - offsetX) / (tileWidth/2)) / 2

// 2. Xoay ngược theo góc camera
gridX, gridY = inverseRotateGridCoords(gx, gy, cameraAngle)
```

## 📁 Cấu trúc

```
demo/
├── README.md           # File này
└── farm-game.html      # Game nông trại mini 2.5D (tự chứa HTML + CSS + JS)
```

---

*Demo được tạo để minh họa khả năng 2.5D Isometric của PNP Game Engine*
