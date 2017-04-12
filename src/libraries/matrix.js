// 矩阵类
class Matrix {
    constructor(row, column = row, value = 0) {
        const data = [];
        if (row instanceof Array) {
            const size = Matrix.isMatrix(row);

            this.row = size.row;
            this.column = size.column;
            row.forEach((n) => data.push(...n));
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

    static isMatrix() {
        //
    }
    static clone() {
        //
    }
    static combination() {
        //
    }

    get(i, j) {
        i = i >= 0 ? i : (this.row + i);
        j = j >= 0 ? j : (this.column + j);

        return this.view[i * this.row + j];
    }
}

export { Matrix };
