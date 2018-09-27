import {
    isUndef,
    isArray,
    isNumber,
} from './utils';

/**
 * 矩阵类
 * @class Matrix
 */
export default class Matrix {
    /**
     * 矩阵的行数
     * @type {number}
     */
    row: number;

    /**
     * 矩阵的列数
     * @type {number}
     */
    column: number;

    /**
     * 矩阵数据
     *  - 一维数组
     *  - 64位 double 类型浮点数
     * @private
     * @type {Float64Array}
     */
    private _view: Float64Array;

    /**
     * Creates an instance of Matrix.
     * @param {number} row
     * @param {(number | 'E')} [column]
     * @param {number} [value=0]
     */
    constructor(order: number, value?: number | 'E');
    constructor(row: number, column: number, value?: number);
    constructor(row: number, column?: number | 'E', value = 0) {
        // 单位矩阵
        if (column === 'E') {
            this.row = row;
            this.column = row;
            this._view = new Float64Array(new ArrayBuffer(this.row * this.column * 8));

            for (let i = 0; i < row; i++) {
                this._view[i * (row + 1)] = 1;
            }
        }
        // 零矩阵
        else if (isUndef(column)) {
            this.row = row;
            this.column = row;
            this._view = Float64Array.from(Array(row * row).fill(0));
        }
        // 行列式
        else {
            this.row = row;
            this.column = column;
            this._view = Float64Array.from(Array(row * column).fill(value));
        }
    }

    static from(matrix: number[][] | Matrix) {
        let result: Matrix;

        // 从数组创建矩阵
        if (isArray(matrix)) {
            const { row, column } = calMatrixSize(matrix);
            const data = matrix.reduce((ans, item) => ans.concat(item), []);

            result = new Matrix(row, column);
            result._view.set(data);
        }
        // 复制矩阵
        else {
            result = new Matrix(matrix.row, matrix.column);
            result._view = Float64Array.from(matrix._view);
        }

        return result;
    }

    /**
     * 取出矩阵元素
     *
     * @param {number} i
     * @param {number} j
     * @returns {number}
     */
    get(i: number, j: number) {
        return this._view[i * this.column + j];
    }
    /**
     * 设置矩阵值
     *
     * @param {number} i
     * @param {number} j
     * @param {number} value
     */
    set(i: number, j: number, value: number) {
        this._view[i * this.column + j] = value;
    }
    /**
     * 取出矩阵某一行
     *
     * @param {number} row
     * @returns {number[]}
     */
    getRow(row: number): number[] {
        const index = row < 0 ? this.row + row : row;

        if (index > this.row || index < 0) {
            throw new Error('(matrix) index of row out of bounds.');
        }

        const ans: number[] = [], start = index * this.column;
        for (let i = 0; i < this.column; i++) {
            ans[i] = this._view[start + i];
        }
        return ans;
    }
    /**
     * 取出矩阵某一列
     *
     * @param {number} column
     * @returns {number[]}
     */
    getColumn(column: number): number[] {
        const index = column < 0 ? this.column + column : column;

        if (index > this.column || index < 0) {
            throw new Error('(matrix) index of column out of bounds.');
        }

        const ans: number[] = [];
        for (let i = 0; i < this.row; i++) {
            ans[i] = this._view[index + i * this.column];
        }
        return ans;
    }
    /**
     * 字符串连接
     *
     * @param {string} str
     * @returns {string}
     */
    join(str: string = ','): string {
        return this._view.join(str);
    }
    /**
     * 交换 from、to 所在的行
     *
     * @param {number} from
     * @param {number} to
     * @returns {this}
     */
    exchangeRow(from: number, to: number): this {
        if (from !== to) {
            const start = from * this.column;
            const end = to * this.column;

            for (let i = 0; i < this.column; i++) {
                const temp = this._view[start + i];
                this._view[start + i] = this._view[end + i];
                this._view[end + i] = temp;
            }
        }

        return this;
    }
    /**
     * 交换 from、to 所在的列
     *
     * @param {number} from
     * @param {number} to
     * @returns {this}
     */
    exchangeColumn(from: number, to: number): this {
        if (from !== to) {
            for (let i = 0; i < this.row; i++) {
                const nowRow = i * this.column;
                const temp = this._view[nowRow + from];

                this._view[nowRow + from] = this._view[nowRow + to];
                this._view[nowRow + to] = temp;
            }
        }

        return this;
    }
    /**
     * 矩阵乘法
     *   - this * ma
     *
     * @param {(number[][] | Matrix)} ma
     * @returns {Matrix}
     */
    mul(ma: number[][] | Matrix): Matrix {
        const a = (ma instanceof Matrix) ? ma : (Matrix.from(ma));

        if (this.column !== a.row) {
            throw new Error('(matrix) this can not be multiplied with ma.');
        }

        // 乘法结果的行与列
        const row = this.row;
        const column = a.column;

        // 乘法计算
        const ans = new Matrix(row, column);
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                let value = ans.get(i, j);
                for (let sub = 0; sub < this.column; sub++) {
                    value += this.get(i, sub) * a.get(sub, j);
                }
                ans.set(i, j, value);
            }
        }

        return (ans);
    }
    /**
     * 矩阵乘法
     *   - ma * this
     *
     * @param {(number[][] | Matrix)} ma
     * @returns {Matrix}
     */
    multo(ma: number[][] | Matrix): Matrix {
        const a = (ma instanceof Matrix) ? ma : (Matrix.from(ma));

        if (this.column !== a.row) {
            throw new Error('(matrix) ma can not be multiplied with this.');
        }

        return a.mul(this);
    }
    /**
     * 列主元 LU 三角分解，返回 L、U、P 矩阵
     *
     * @returns {[Matrix, Matrix, Matrix]}
     */
    luDecompose(): [Matrix, Matrix, Matrix] {
        if (this.row !== this.column) {
            throw new Error('(matrix) only the matrix can be decomposed.');
        }

        const n = this.row,             // 行列式的行数
            U = Matrix.from(this),      // 上三角行列式
            L = new Matrix(n),          // 下三角行列式
            P = new Matrix(n, 'E');     // 变换行列式，初始为单位矩阵

        for (let k = 0; k < n; k++) {
            if (k > 0) {
                for (let i = k; i < n; i++) {
                    L.set(i, k - 1, U.get(i, k - 1) / U.get(k - 1, k - 1));
                    for (let j = k; j < n; j++) {
                        const temp = U.get(i, j) - L.get(i, k - 1) * U.get(k - 1, j);
                        U.set(i, j, temp);
                    }
                    U.set(i, k - 1, 0);
                }
            }
            if (k < n - 1) {
                // 取绝对值最大的系数为主元
                let tempmax = 0, tempsub = 0;
                for (let i = k; i < n; i++) {
                    const now = Math.abs(U.get(i, k));
                    if (now > tempmax) {
                        tempmax = now;
                        tempsub = i;
                    }
                }
                // 交换主元
                L.exchangeRow(k, tempsub);
                U.exchangeRow(k, tempsub);
                P.exchangeRow(k, tempsub);
            }
        }
        // 下三角对角线为1
        for (let i = 0; i < n; i++) {
            L.set(i, i, 1);
        }
        return ([L, U, P]);
    }
    /**
     * 基于LU分解的矩阵求逆
     *
     * @returns {Matrix}
     */
    inverse(): Matrix {
        const [L, U, P] = this.luDecompose(), n = this.row;

        for (let i = 0; i < U.row; i++) {
            if (U.get(i, i) === 0) {
                throw new Error('(matrix) this matrix has no inverse.');
            }
        }

        // L、U的逆矩阵初始化
        const li = new Matrix(n), ui = new Matrix(n);

        // U的逆矩阵
        for (let i = 0; i < n; i++) {
            ui.set(i, i, 1 / U.get(i, i));
            for (let j = i - 1; j >= 0; j--) {
                let s = 0;
                for (let k = j + 1; k <= i; k++) {
                    s -= U.get(j, k) * ui.get(k, i);
                }
                ui.set(j, i, s / U.get(j, j));
            }
        }
        // L的逆矩阵
        for (let i = 0; i < n; i++) {
            li.set(i, i, 1);
            for (let j = i + 1; j < n; j++) {
                let s = li.get(j, i);
                for (let k = i; k <= j - 1; k++) {
                    s -= L.get(j, k) * li.get(k, i);
                }
                li.set(j, i, s);
            }
        }
        // ul的逆矩阵相乘得到原矩阵的逆矩阵
        const ans = ui.mul(li).mul(P);
        return (ans);
    }
    /**
     * map 迭代
     *  - 从第一行开始，从左至右
     *
     * @param {(value: number, position: [number, number]) => number} callback
     * @returns {this}
     */
    map(callback: (value: number, position: [number, number]) => number): this {
        for (let i = 0; i < this._view.length; i++) {
            const x = ~~(i / this.column), y = i % this.column;
            this.set(x, y, callback(this._view[i], [x, y]));
        }
        return (this);
    }
}

/**
 * 输入的二维数组能否转化为矩阵
 *
 * @param {number[][]} ma
 * @returns {{ row: number; column: number })}
 */
function calMatrixSize(ma: number[][]): { row: number; column: number } {
    // 记录行列数
    const row = ma.length, column = ma[0].length;

    // 行连续
    if (!Object.keys(ma).every((n, i) => +n === i)) {
        throw new Error('(matrix) this is not a matrix.');
    }

    // 列连续且列长均相等
    if (!ma.every((col) =>
            isArray(col) && col.length === column &&
            Object.keys(col).every((n, i) => +n === i) &&
            Object.values(col).every((n) => isNumber(n) && !Number.isNaN(n)),
    )) {
        throw new Error('(matrix) this is not a matrix.');
    }

    return ({ row, column });
}
