# Phaser 3 學習筆記

## 目錄
- [場景生命週期](#場景生命週期)
- [繪圖相關](#繪圖相關)
- [遊戲物件](#遊戲物件)

---

## 場景生命週期

| 方法 | 說明 | 執行時機 |
|------|------|----------|
| `preload()` | 載入資源（圖片、音效） | 場景開始前 |
| `create()` | 初始化遊戲物件 | 資源載入完成後，執行一次 |
| `update()` | 遊戲主迴圈 | 每幀執行（約 60 次/秒） |

```typescript
class GameScene extends Phaser.Scene {
  preload() { /* 載入資源 */ }
  create() { /* 初始化 */ }
  update() { /* 每幀更新 */ }
}
```

---

## 繪圖相關

### Graphics（畫線、畫形狀）

```typescript
const graphics = this.add.graphics();

// 設定線條樣式
graphics.lineStyle(寬度, 顏色, 透明度);
// 例：graphics.lineStyle(2, 0xffffff, 1);

// 畫線
graphics.moveTo(x1, y1);  // 移動到起點
graphics.lineTo(x2, y2);  // 畫線到終點
graphics.strokePath();     // 執行繪製

// 畫矩形外框
graphics.strokeRect(x, y, 寬, 高);

// 畫填滿矩形
graphics.fillStyle(顏色, 透明度);
graphics.fillRect(x, y, 寬, 高);
```

---

## 遊戲物件

### Rectangle（矩形）

```typescript
this.add.rectangle(x, y, 寬, 高, 顏色);
```

> ⚠️ 注意：`x`, `y` 是**中心點**位置，不是左上角！

### Text（文字）

```typescript
this.add.text(x, y, '文字內容', {
  fontSize: '32px',
  color: '#ffffff'
}).setOrigin(0.5);  // 設定原點為中心
```

---

## 顏色格式

Phaser 使用 16 進位數字表示顏色：

| 顏色 | 數值 |
|------|------|
| 白色 | `0xffffff` |
| 黑色 | `0x000000` |
| 紅色 | `0xff0000` |
| 綠色 | `0x00ff00` |
| 藍色 | `0x0000ff` |
| 黃色 | `0xffff00` |
| 青色 | `0x00ffff` |
| 紫色 | `0xff00ff` |

---

## 本專案自訂函數

### drawBoard()
畫出 10x20 的棋盤格線。

### drawPiece(shape, col, row, color)
在棋盤上畫一個俄羅斯方塊。

| 參數 | 型別 | 說明 |
|------|------|------|
| `shape` | `number[][]` | 形狀陣列，1 代表有方塊 |
| `col` | `number` | 棋盤第幾列（從 0 開始） |
| `row` | `number` | 棋盤第幾行（從 0 開始） |
| `color` | `number` | 顏色（16 進位） |

```typescript
// 範例：在第 4 列、第 0 行畫一個黃色 O 形方塊
this.drawPiece(O_SHAPE, 4, 0, 0xffff00);
```
