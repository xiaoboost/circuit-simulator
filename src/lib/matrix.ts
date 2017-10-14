import assert from './assertion';

/**
 * 是否是矩阵类
 *
 * @param {*} ma
 * @returns {ma is Matrix}
 */
function isMatrix(ma: any): ma is Matrix {
    return (ma instanceof Matrix);
}

/**
 * 输入的二维数组能否转化为矩阵
 *
 * @param {number[][]} ma
 * @returns {(false | { row: number; column: number })}
 */
function allowMatrix(ma: number[][]): false | { row: number; column: number } {
    // 记录行列数
    const row = ma.length, column = ma[0].length;
    // 行连续
    if (!Object.keys(ma).every((n, i) => +n === i)) {
        return (false);
    }
    // 列连续且列长均相等
    if (!Object.values(ma).every((col) => {
        return col && col.length === column &&
            Object.keys(col).every((n, i) => +n === i) &&
            Object.values(col).every((n) => typeof n === 'number');
    })) {
        return (false);
    }

    return ({ row, column });
}

/**
 * 矩阵类
 *
 * @class Matrix
 */
class Matrix {
    /**
     * 矩阵的行数
     *
     * @type {number}
     */
    row: number;

    /**
     * 矩阵的列数
     *
     * @type {number}
     */
    column: number;

    /**
     * 矩阵数据
     *  - 一维数组
     *  - 64位 double 类型浮点数
     *
     * @private
     * @type {Float64Array}
     */
    private _view: Float64Array;

    /**
     * Creates an instance of Matrix.
     * @param {(number | number[][] | Matrix)} row
     * @param {(number | 'E')} [column]
     * @param {number} [value=0]
     */
    constructor(row: number | number[][] | Matrix, column?: number | 'E', value: number = 0) {
        if (assert.isArray(row)) {
            // 从数组创建矩阵
            const data: number[] = [], size = allowMatrix(row);

            if (!size) {
                return;
            }

            this.row = size.row;
            this.column = size.column;
            row.forEach((n) => data.push(...n));

            const buffer = new ArrayBuffer(this.row * this.column * 8);
            this._view = new Float64Array(buffer);
            this._view.set(data);
        } else if (isMatrix(row)) {
            // 复制矩阵
            this.row = row.row;
            this.column = row.column;
            this._view = Float64Array.from(row._view);
        } else if (column === 'E') {
            // 单位矩阵
            this.row = row;
            this.column = row;
            const buffer = new ArrayBuffer(this.row * this.column * 8);
            this._view = new Float64Array(buffer);

            for (let i = 0; i < row; i++) {
                this._view[i * (row + 1)] = 1;
            }
        } else if (assert.isNumber(column)) {
            // 填充矩阵
            this.row = row;
            this.column = column;
            this._view = Float64Array.from(Array(row * column).fill(value));
        }
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

        const ans: number[] = [], start = row * this.column;
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

        if (column > this.column || column < 0) {
            throw new Error('(matrix) index of column out of bounds.');
        }

        const ans: number[] = [];
        for (let i = 0; i < this.row; i++) {
            ans[i] = this._view[column + i * this.column];
        }
        return ans;
    }
    /**
     * 输出字符串
     *
     * @returns {string}
     */
    toString(): string {
        const maxColumnLen: number[] = [];
        for (let i = 0; i < this.column; i++) {
            maxColumnLen.push(
                this.getColumn(i).map(String)
                    .reduce((len, item) =>  item.length > len ? item.length : len, 0),
            );
        }

        let str = '';
        for (let i = 0; i < this.row; i++) {
            str += this.getRow(i)
                .map((n) => String(n).padStart(maxColumnLen[i], ' '))
                .join(',  ') + ';\n';
        }
        return (str);
    }
    /**
     * 字符串连接
     *
     * @param {string} str
     * @returns {string}
     */
    join(str: string): string {
        return this._view.join(str);
    }
    /**
     * 交换坐标元素 a、b 所在行、列
     *
     * @param {[number, number]} a
     * @param {[number, number]} b
     * @returns {this}
     */
    exchange(a: [number, number], b: [number, number]): this {
        // 交换行
        if (a[0] !== b[0]) {
            const start = a[0] * this.column,
                end = b[0] * this.column;
            for (let i = 0; i < this.column; i++) {
                const temp = this._view[start + i];
                this._view[start + i] = this._view[end + i];
                this._view[end + i] = temp;
            }
        }
        // 交换列
        if (a[1] !== b[1]) {
            const start = a[1], end = b[1];
            for (let i = 0; i < this.row; i++) {
                const nowRow = i * this.column,
                    temp = this._view[nowRow + start];
                this._view[nowRow + start] = this._view[nowRow + end];
                this._view[nowRow + end] = temp;
            }
        }
        return (this);
    }
    /**
     * 矩阵乘法
     *   - this * ma
     *
     * @param {(number[][] | Matrix)} ma
     * @returns {Matrix}
     */
    mul(ma: number[][] | Matrix): Matrix {
        const a = isMatrix(ma) ? ma : (new Matrix(ma));

        if (this.column !== a.row) {
            throw new Error('this can not be multiplied with ma.');
        }

        // 乘法结果的行与列
        const row = this.row,
            column = a.column;

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
        const a = isMatrix(ma) ? ma : (new Matrix(ma));

        if (this.column !== a.row) {
            throw new Error('ma can not be multiplied with this.');
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
            throw new Error('Only the matrix can be decomposed.');
        }

        const n = this.row,             // 行列式的行数
            U = new Matrix(this),       // 上三角行列式
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
                L.exchange([k, 0], [tempsub, 0]);
                U.exchange([k, 0], [tempsub, 0]);
                P.exchange([k, 0], [tempsub, 0]);
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
     * @returns {(false | Matrix)}
     */
    inverse(): Matrix | false {
        const [L, U, P] = this.luDecompose(), n = this.row;
        for (let i = 0; i < U.row; i++) {
            if (!U.get(i, i)) {
                return (false);
            }
        }

        // L、U的逆矩阵初始化
        const li = new Matrix(n),
            ui = new Matrix(n);

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
     * forEach 迭代
     *  - 从第一行开始，从左至右
     *
     * @param {(value: number, position: [number, number]) => void} callback
     * @returns {this}
     */
    forEach(callback: (value: number, position: [number, number]) => void): this {
        for (let i = 0; i < this._view.length; i++) {
            const x = ~~(i / this.column), y = i % this.column;
            callback(this._view[i], [x, y]);
        }
        return (this);
    }
    /**
     * every 迭代
     *  - 从第一行开始，从左至右
     *
     * @param {(value: number, position: [number, number]) => boolean} callback
     * @returns {boolean}
     */
    every(callback: (value: number, position: [number, number]) => boolean): boolean {
        let ans;
        for (let i = 0; i < this._view.length; i++) {
            const x = ~~(i / this.column), y = i % this.column;
            ans = callback(this._view[i], [x, y]);

            if (!ans) {
                return (false);
            }
        }
        return (true);
    }
}

// function combination() {
//     //
// }

/**
 * new Matrix(row, column, value) 运算的封装
 *
 * @param {(number | number[][] | Matrix)} row
 * @param {(number | 'E')} [column]
 * @param {number} [value=0]
 * @returns {Matrix}
 */
function $M(row: number | number[][] | Matrix, column?: number | 'E', value: number = 0) {
    return new Matrix(row, column, value);
}

// 旋转矩阵
const rotates: [Matrix, Matrix, Matrix, Matrix] = [
    $M([[0, 1], [-1, 0]]),  // 顺时针
    $M([[0, -1], [1, 0]]),  // 逆时针
    $M([[1, 0], [0, -1]]),  // 沿 X 轴镜像
    $M([[-1, 0], [0, 1]]),  // 沿 Y 轴镜像
];

export { $M, rotates };
