import { COLS, ROWS, BLOCK_SIZE } from '../config';

// ===== 方塊形狀定義 =====
export const SHAPES = {
    O: [
        [1, 1],
        [1, 1]
    ]
};

// ===== 方塊顏色 =====
export const COLORS = {
    O: 0xffff00  // 黃色
};

// ===== 方塊類別 =====
export class Tetromino {
    public shape: number[][];
    public color: number;
    public col: number;
    public row: number;

    constructor(type: keyof typeof SHAPES = 'O') {
        this.shape = SHAPES[type];
        this.color = COLORS[type];
        this.col = Math.floor((COLS - this.shape[0].length) / 2);  // 置中
        this.row = 0;
    }

    // 取得方塊寬度
    get width(): number {
        return this.shape[0].length;
    }

    // 取得方塊高度
    get height(): number {
        return this.shape.length;
    }

    // 往左移動
    moveLeft(): boolean {
        if (this.col > 0) {
            this.col -= 1;
            return true;
        }
        return false;
    }

    // 往右移動
    moveRight(): boolean {
        if (this.col + this.width < COLS) {
            this.col += 1;
            return true;
        }
        return false;
    }

    // 往下移動
    moveDown(): boolean {
        if (this.row + this.height < ROWS) {
            this.row += 1;
            return true;
        }
        return false;
    }

    // 硬降（直接落到底部）
    hardDrop(): void {
        this.row = ROWS - this.height;
    }

    // 嘗試移動（帶方向）
    tryMove(dir: number): boolean {
        if (dir === -1) {
            return this.moveLeft();
        } else if (dir === 1) {
            return this.moveRight();
        }
        return false;
    }
}
