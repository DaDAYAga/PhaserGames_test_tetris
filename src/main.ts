import Phaser from 'phaser';

// ===== 遊戲常數 =====
const COLS = 10;        // 棋盤寬度（10 格）
const ROWS = 20;        // 棋盤高度（20 格）
const BLOCK_SIZE = 30;  // 每格的像素大小

// 遊戲場景
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  // create() 在場景建立時執行一次
  create() {
    // 計算棋盤的起始位置（置中）
    const boardWidth = COLS * BLOCK_SIZE;
    const boardHeight = ROWS * BLOCK_SIZE;
    const offsetX = (800 - boardWidth) / 2;
    const offsetY = (600 - boardHeight) / 2;

    // 畫出棋盤格線
    this.drawBoard(offsetX, offsetY);
  }

  // 畫棋盤格線
  drawBoard(offsetX: number, offsetY: number) {
    const graphics = this.add.graphics();
    
    // 設定線條樣式：灰色、1px 寬
    graphics.lineStyle(1, 0x333333, 0.8);

    // 畫垂直線（11 條）
    for (let col = 0; col <= COLS; col++) {
      const x = offsetX + col * BLOCK_SIZE;
      graphics.moveTo(x, offsetY);
      graphics.lineTo(x, offsetY + ROWS * BLOCK_SIZE);
    }

    // 畫水平線（21 條）
    for (let row = 0; row <= ROWS; row++) {
      const y = offsetY + row * BLOCK_SIZE;
      graphics.moveTo(offsetX, y);
      graphics.lineTo(offsetX + COLS * BLOCK_SIZE, y);
    }

    // 執行繪製
    graphics.strokePath();

    // 畫棋盤外框（白色）
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeRect(offsetX, offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
  }
}

// 遊戲設定
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  scene: GameScene
};

// 啟動遊戲
new Phaser.Game(config);
