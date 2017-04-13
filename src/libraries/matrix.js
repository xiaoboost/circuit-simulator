// 矩阵类
class Matrix {
    constructor(row, column = row, value = 0) {
        const data = [];
        if (row instanceof Array) {
            const size = Matrix.isMatrix(row);
            this.row = size.row;
            this.column = size.column;
            row.forEach((n) => data.push(...n));
        } else if (row instanceof Matrix) {
            data.push(...row.view);
            this.row = row.row;
            this.column = row.column;
        } else {
            if (/[EI]/.test(column) || /[EI]/.test(value)) {
                for (let i = 0; i < row; i++) {
                    const temp = new Array(row).fill(0);
                    temp[i] = 1;
                    data.push(...temp);
                }
                column = row;
            } else {
                for (let i = 0; i < row; i++) {
                    data.push(...Array(column).fill(value));
                }
            }
            this.row = row;
            this.column = column;
        }

        // 开辟内存空间
        this.buffer = new ArrayBuffer(this.row * this.column * 8);
        this.view = new Float64Array(this.buffer);
        data.forEach((n, i) => this.view[i] = n);

        // 矩阵所有属性为只读
        Object.defineProperties(this, {
            row: { writable: false },
            column: { writable: false },
            buffer: { writable: false },
            view: { writable: false }
        });
    }

    static isMatrix(ma) {
        if (ma instanceof Matrix) {
            return ({ row: ma.row, column: ma.column });
        }

        // 记录行列数
        const row = ma.length, column = ma[0].length;
        // 行连续
        if (!Object.keys(ma).every((n, i) => n === i)) {
            return (false);
        }
        // 列连续切列长均相等
        if (!Object.values(ma).every((col) => {
            return col.length === column &&
                Object.keys(col).every((n, i) => n === i) &&
                Object.values(col).every((n) => !Number.isNaN(+n));
        })) {
            return (false);
        }

        return ({ row, column });
    }
    static combination() {
        //
    }

    // 取出矩阵元素
    get(i, j) {
        i = i >= 0 ? i : (this.row + i);
        j = j >= 0 ? j : (this.column + j);

        return this.view[i * this.row + j];
    }
    // 设置矩阵值
    set(i, j, value) {
        i = i >= 0 ? i : (this.row + i);
        j = j >= 0 ? j : (this.column + j);

        this.view[i * this.row + j] = value;
    }
    // 输出字符串
    join(str) {
        return this.view.join(str);
    }

    // 交换坐标元素a、b所在行、列
    exchange(a, b) {
        // 交换行
        if (a[0] !== b[0]) {
            const start = a[0] * this.row,
                end = b[0] * this.row;
            for (let i = 0; i < this.row; i++) {
                const temp = this.view[start + i];
                this.view[start + i] = this.view[end + i];
                this.view[end + i] = temp;
            }
        }
        // 交换列
        if (a[1] !== b[1]) {
            const start = a[1] * this.column,
                end = b[1] * this.column;
            for (let i = 0; i < this.column; i++) {
                const nowRow = i * this.row,
                    temp = this.view[nowRow + start];
                this.view[nowRow + start] = this.view[nowRow + end];
                this.view[nowRow + end] = temp;
            }
        }
    }
    // this * ma
    mul(ma) {
        const a = (ma instanceof Matrix)
            ? ma
            : (new Matrix(ma));

        if (this.column !== a.row) {
            return (false);
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
    // ma * this
    multo(ma) {
        const a = (ma instanceof Matrix)
            ? ma
            : new Matrix(ma);

        return a.mul(this);
    }
}

export { Matrix };
