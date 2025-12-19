# Phaser 3 學習筆記

## 目錄
- [場景生命週期](#場景生命週期)
- [繪圖相關](#繪圖相關)
- [遊戲物件](#遊戲物件)
- [鍵盤輸入](#鍵盤輸入)
- [遊戲機制](#遊戲機制)

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

### drawCurrentPiece()
繪製當前方塊，會先清除舊的再畫新的。

```typescript
drawCurrentPiece() {
    // 清除舊的方塊圖形
    this.pieceGraphics.forEach(rect => rect.destroy());
    this.pieceGraphics = [];

    // 畫新的方塊...
}
```

### tryMove(dir)
嘗試移動方塊，會檢查邊界。

| 參數 | 型別 | 說明 |
|------|------|------|
| `dir` | `number` | 移動方向：-1 左、1 右 |

```typescript
tryMove(dir: number) {
    const newCol = this.currentCol + dir;
    if (newCol < 0) return;  // 左邊界
    if (newCol + O_SHAPE[0].length > COLS) return;  // 右邊界
    this.currentCol = newCol;
    this.drawCurrentPiece();
}
```

### hardDrop()
硬降（Hard Drop）- 直接落到最底部。

```typescript
hardDrop() {
    // 計算最底部的位置
    const maxRow = ROWS - O_SHAPE.length;
    
    // 直接移動到最底部
    this.currentRow = maxRow;
    this.drawCurrentPiece();
    
    // 重置下落計時器
    this.dropTimer = 0;
}
```

---

## 鍵盤輸入

### 建立按鍵監聽

```typescript
// 方向鍵（內建）
this.cursors = this.input.keyboard!.createCursorKeys();

// 單獨按鍵
this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
```

### 按鍵狀態判斷

```typescript
// 持續按住
if (this.leftKey.isDown) { ... }

// 剛按下（只觸發一次）
if (Phaser.Input.Keyboard.JustDown(this.leftKey)) { ... }
```

### 常用 KeyCodes

| 按鍵 | KeyCodes |
|------|----------|
| 方向鍵 | `UP`, `DOWN`, `LEFT`, `RIGHT` |
| 空白鍵 | `SPACE` |
| Enter | `ENTER` |
| ESC | `ESC` |
| 字母 | `A`, `B`, `C`... |

---

## 遊戲機制

### update() 參數

```typescript
update(_time: number, delta: number) {
    // _time: 遊戲開始到現在的總毫秒數（底線表示未使用）
    // delta: 距離上一幀的毫秒數（約 16ms）
}
```

### 計時器模式

```typescript
// 累積時間
this.dropTimer += delta;

// 達到間隔就執行
if (this.dropTimer >= this.dropInterval) {
    this.dropTimer = 0;
    // 執行動作...
}
```

### DAS 機制（Delayed Auto Shift）

俄羅斯方塊的標準按鍵處理：
1. **首次按下**：立即移動
2. **持續按住**：延遲一段時間後開始連續移動
3. **連續移動**：以固定間隔重複移動

```typescript
// 相關變數
private moveDelay: number = 200;     // 首次延遲（ms）
private moveInterval: number = 250;  // 連續間隔（ms）
private moveTimer: number = 0;
private lastMoveDir: number = 0;     // -1 左, 1 右, 0 無

// 邏輯
if (dir !== 0) {
    if (this.lastMoveDir !== dir) {
        // 方向改變，立即移動
        this.tryMove(dir);
        this.moveTimer = 0;
        this.lastMoveDir = dir;
        return;
    }

    this.moveTimer += delta;
    const interval = this.moveTimer < this.moveDelay 
        ? this.moveDelay 
        : this.moveInterval;

    if (this.moveTimer >= interval) {
        this.moveTimer = this.moveDelay;
        this.tryMove(dir);
    }
} else {
    this.moveTimer = 0;
    this.lastMoveDir = 0;
}
```
