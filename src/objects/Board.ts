import { COLS, ROWS } from '../config';

/**
 * 棋盤類別
 * 負責管理已固定方塊的狀態
 */
export class Board {
    // 二維陣列：grid[row][col] = 0 表示空格，其他數值表示方塊顏色
    private grid: number[][];

    constructor() {
        // 初始化空棋盤
        this.grid = this.createEmptyGrid();
    }

    // 建立空的棋盤陣列
    private createEmptyGrid(): number[][] {
        const grid: number[][] = [];
        
        for (let row = 0; row < ROWS; row++) {
            // 每一行都是一個長度為 COLS 的陣列，填滿 0
            grid.push(new Array(COLS).fill(0));
        }
        
        return grid;
    }

    // 取得某格的值
    getCell(row: number, col: number): number {
        // 超出邊界檢查
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            return -1;  // -1 表示超出邊界
        }
        return this.grid[row][col];
    }

    // 設定某格的值
    setCell(row: number, col: number, value: number): void {
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            this.grid[row][col] = value;
        }
    }

    // 檢查某格是否為空
    isEmpty(row: number, col: number): boolean {
        return this.getCell(row, col) === 0;
    }

    // 取得整個棋盤（用於繪製）
    getGrid(): number[][] {
        return this.grid;
    }
}
