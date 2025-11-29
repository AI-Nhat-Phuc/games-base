# 🌾 Demo - Nông Trại Mini 2.5D

Đây là demo game nông trại nhỏ với giao diện **2.5D Isometric** được xây dựng sử dụng các concept từ PNP Game Engine.

![Farm Game 2.5D Demo](https://github.com/user-attachments/assets/fdab578b-d1eb-46cd-9075-5bb22ec1c120)

## 🎮 Tính năng

- **Giao diện 2.5D Isometric**: Góc nhìn isometric tạo chiều sâu cho game
- **Cánh đồng 10x10**: Lưới 100 ô có thể trồng cây với hiệu ứng 3D
- **Ngôi nhà 3D**: Thiết kế isometric với mái, tường, cửa sổ
- **Người chơi di chuyển**: Sử dụng phím W/A/S/D với animation mượt mà
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

Di chuyển theo góc nhìn isometric:

| Phím | Hành động |
|------|-----------|
| W | Di chuyển lên-trái (↖) |
| S | Di chuyển xuống-phải (↘) |
| A | Di chuyển xuống-trái (↙) |
| D | Di chuyển lên-phải (↗) |

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
3. **Depth Sorting**: Vẽ tiles theo thứ tự từ xa đến gần để tạo hiệu ứng 3D
4. **Tile-based Map**: Bản đồ dựa trên lưới ô với rendering isometric (tương tự MapBuilder)
5. **Character Control**: Điều khiển nhân vật với keyboard input (tương tự CharacterBuilder + InputManager)
6. **State Management**: Quản lý trạng thái cây trồng và người chơi
7. **Canvas 2.5D Rendering**: Vẽ đồ họa isometric với độ sâu và bóng đổ

## 📐 Isometric Math

Công thức chuyển đổi tọa độ từ grid sang màn hình:
```javascript
// Grid coordinates (gridX, gridY): Integer position in the 10x10 grid (0-9)
// Screen coordinates (screenX, screenY): Pixel position on canvas

// tileWidth = 64px, tileHeight = 32px
// offsetX = canvas center X, offsetY = top padding (80px)

screenX = (gridX - gridY) * (tileWidth / 2) + offsetX
screenY = (gridX + gridY) * (tileHeight / 2) + offsetY
```

## 📁 Cấu trúc

```
demo/
├── README.md           # File này
└── farm-game.html      # Game nông trại mini 2.5D (tự chứa HTML + CSS + JS)
```

---

*Demo được tạo để minh họa khả năng 2.5D Isometric của PNP Game Engine*
