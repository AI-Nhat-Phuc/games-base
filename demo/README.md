# 🌾 Demo - Nông Trại Mini

Đây là demo game nông trại nhỏ được xây dựng sử dụng các concept từ PNP Game Engine.

## 🎮 Tính năng

- **Cánh đồng 10x10**: Lưới 100 ô có thể trồng cây
- **Ngôi nhà**: Nằm ở góc trên trái của bản đồ
- **Người chơi di chuyển**: Sử dụng phím W/A/S/D hoặc click vào nút
- **Hệ thống cây trồng**: 4 loại cây (Cà rốt, Cà chua, Ngô, Lúa mì)
- **Quy trình canh tác**:
  1. Di chuyển đến ô đất trống
  2. Chọn loại cây muốn trồng
  3. Gieo hạt (tốn tiền)
  4. Tưới nước để cây phát triển
  5. Đợi cây qua các giai đoạn
  6. Thu hoạch khi cây trưởng thành (nhận tiền)

## 🕹️ Hướng dẫn điều khiển

| Phím | Hành động |
|------|-----------|
| W | Di chuyển lên |
| A | Di chuyển trái |
| S | Di chuyển xuống |
| D | Di chuyển phải |

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

Demo này minh họa các concept từ PNP Game Engine:

1. **Game Loop**: Sử dụng `requestAnimationFrame` cho vòng lặp game mượt mà
2. **Tile-based Map**: Bản đồ dựa trên lưới ô (tương tự MapBuilder)
3. **Character Control**: Điều khiển nhân vật với keyboard input (tương tự CharacterBuilder + InputManager)
4. **State Management**: Quản lý trạng thái cây trồng và người chơi
5. **Canvas Rendering**: Vẽ đồ họa 2D sử dụng Canvas API

## 📁 Cấu trúc

```
demo/
├── README.md           # File này
└── farm-game.html      # Game nông trại mini (tự chứa HTML + CSS + JS)
```

---

*Demo được tạo để minh họa khả năng của PNP Game Engine*
