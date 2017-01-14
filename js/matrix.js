//矩阵构造函数，新矩阵内部的数组全部是新的，不会引用输入的数组的任何数据
function Matrix(row, column = row, value = 0) {
    if (row instanceof Array) {
        const temp = Matrix.isMatrix(row);
        if (temp) {
            for (let i = 0; i < row.length; i++) {
                this[i] = Array.clone(row[i]);
            }
            this.row = temp[0];
            this.column = temp[1];
            this.length = this.row;
        } else {
            throw ('数组格式错误，无法创建矩阵');
        }
    } else {
        if ((column === 'I') || (column === 'E') || (value === 'I') || (value === 'E')) {
            for (let i = 0; i < row; i++) {
                this[i] = new Array(row).fill(0);
                this[i][i] = 1;
            }
            column = row;
        } else {
            for (let i = 0; i < row; i++) {
                this[i] = new Array(column).fill(value);
            }
        }
        //保留length参数主要是供Array的方法使用
        this.row = row;
        this.column = column;
        this.length = row;
    }
    //矩阵创建之后就不能更改，想要更改只能在此基础上创建一个新的矩阵
    //属性不可枚举，不可更改
    Object.defineProperties(this, {
        row: {
            configurable: false,
            enumerable: false,
            writable: false
        },
        column: {
            configurable: false,
            enumerable: false,
            writable: false
        },
        length: {
            configurable: false,
            enumerable: false,
            writable: false
        }
    });
    //封闭矩阵
    Object.sealAll(this);
}
//实例方法
Matrix.prototype = {
    constructor: Matrix,
    //交换坐标元素a、b所在行、列
    exchange(a, b) {
        //交换行
        if (a[0] !== b[0]) {
            const temp = this[a[0]];
            this[a[0]] = this[b[0]];
            this[b[0]] = temp;
        }
        //交换列
        if (a[1] !== b[1]) {
            for (let i = 0; i < this.length; i++) {
                const temp = this[i][a[1]];
                this[i][a[1]] = this[i][b[1]];
                this[i][b[1]] = temp;
            }
        }
    },
    //this * ma
    mul(ma) {
        //以输入数据创建矩阵
        const a = (ma instanceof Matrix) ? ma : (new Matrix(ma));
        if (this.column !== a.row) {
            throw ('这两个矩阵无法相乘');
        }
        //乘法结果的行与列
        const row = this.row,
            column = a.column;

        //乘法计算
        const ans = new Matrix(row, column);
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                for (let sub = 0; sub < this.column; sub++) {
                    ans[i][j] += this[i][sub] * a[sub][j];
                }
            }
        }

        return ((row === 1) && (column === 1))
            ? ans[0][0]
            : ans;
    },
    //ma * this
    multo(ma) {
        //以输入数据创建矩阵
        const a = (ma instanceof Matrix) ? ma : (new Matrix(ma));
        //交换相乘双方
        return this.mul.call(a, this);
    },
    //列主元LU三角分解，返回LUP矩阵
    luDecompose() {
        if (this.row !== this.column)
            throw ('这不是行列式，无法三角分解');

        const n = this.row;             //行列式的行数
        const U = Matrix.clone(this);   //上三角行列式
        const L = new Matrix(n);        //下三角行列式
        const P = new Matrix(n, 'E');   //变换行列式，初始为单位矩阵

        for (let k = 0; k < n; k++) {
            if (k > 0) {
                for (let i = k; i < n; i++) {
                    L[i][k - 1] = U[i][k - 1] / U[k - 1][k - 1];
                    for (let j = k; j < n; j++)
                        U[i][j] -= L[i][k - 1] * U[k - 1][j];
                    U[i][k - 1] = 0;
                }
            }
            if (k < n - 1) {
                let tempmax = 0, tempsub = 0;       //取最大的系数为主元
                for (let i = k; i < n; i++) {
                    if (Math.abs(U[i][k]) > tempmax) {
                        tempmax = Math.abs(U[i][k]);
                        tempsub = i;
                    }
                }
                L.exchange([k, 0], [tempsub, 0]);   //交换主元
                U.exchange([k, 0], [tempsub, 0]);
                P.exchange([k, 0], [tempsub, 0]);
            }
        }
        for (let i = 0; i < n; i++)                 //下三角对角线为1
            L[i][i] = 1;
        return ([L, U, P]);
    },
    //基于LU分解的矩阵求逆
    inverse() {
        const [L, U, P] = this.luDecompose(), n = this.row;
        for (let i = 0; i < U.row; i++)
            if (!U[i][i]) throw ('逆矩阵不存在');

        //L、U的逆矩阵初始化
        const li = new Matrix(n);
        const ui = new Matrix(n);
        //U的逆矩阵
        for (let i = 0; i < n; i++) {
            ui[i][i] = 1 / U[i][i];
            for (let j = i - 1; j >= 0; j--) {
                let s = 0;
                for (let k = j + 1; k <= i; k++) {
                    s += U[j][k] * ui[k][i];
                }
                ui[j][i] = -s / U[j][j];
            }
        }
        //L的逆矩阵
        for (let i = 0; i < n; i++) {
            li[i][i] = 1;
            for (let j = i + 1; j < n; j++) {
                for (let k = i; k <= j - 1; k++) {
                    li[j][i] -= L[j][k] * li[k][i];
                }
            }
        }
        //ul的逆矩阵相乘得到原矩阵的逆矩阵
        const ans = ui.mul(li).mul(P);
        return (ans);
    },
    //枚举矩阵元素
    forEach(callback) {
        if (this instanceof Matrix) {
            for (let i = 0; i < this.row; i++)
                for (let j = 0; j < this.column; j++) {
                    callback(this[i][j], [i, j], this);
                }
        } else if (this instanceof Array) {
            const range = Matrix.isMatrix(this);
            if (range) {
                for (let i = 0; i < range[0]; i++)
                    for (let j = 0; j < range[1]; j++) {
                        callback(this[i][j], [i, j], this);
                    }
            } else {
                throw ('只有矩阵或者类似矩阵的数组才能调用此方法');
            }
        } else {
            throw ('只有矩阵或者类似矩阵的数组才能调用此方法');
        }
    },
    //矩阵转置
    transpose() {
        const ans = new Matrix(this.column, this.row);
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                ans[j][i] = this[i][j];
            }
        }
        return (ans);
    },
    //向右串联矩阵，原矩阵不变，返回新矩阵
    concatRight(...args) {
        let main = Matrix.clone(this);
        for (let x = 0; x < args.length; x++) {
            const ma = args[x],
                rc = Matrix.isMatrix(ma),
                [row, column] = rc ? rc : [];

            if (!row) {
                throw ('无法串联矩阵');
            }

            const ans = new Matrix(row, main.column + column);
            //添加main矩阵元素到ans
            main.forEach((n, [i, j]) => ans[i][j] = n);
            //添加ma矩阵元素到main
            Matrix.prototype.forEach.call(ma, ((n, [i, j]) => ans[i][j + main.column] = n));
            main = ans;
        }
        return (main);
    },
    //向下串联矩阵，原矩阵不变，返回新矩阵
    concatDown(...args) {
        let main = Matrix.clone(this);
        for (let x = 0; x < args.length; x++) {
            const ma = args[x],
                rc = Matrix.isMatrix(ma),
                [row, column] = rc ? rc : [];

            if (!row) {
                throw ('无法串联矩阵');
            }

            const ans = new Matrix(main.row + row, column);
            //添加this矩阵元素到ans
            main.forEach((n, [i, j]) => ans[i][j] = n);
            //添加ma矩阵元素到ans
            Matrix.prototype.forEach.call(ma, ((n, [i, j]) => ans[i + main.row][j] = n));
            main = ans;
        }
        return (main);
    },
    //选取矩阵的一部分，返回新矩阵
    slice(a, b) {
        //输入格式检查
        if ((!(a instanceof Array)) || (a.length !== 2) || (typeof a[0] !== 'number') || (typeof a[1] !== 'number') ||
            (!(b instanceof Array)) && (b.length !== 2) || (typeof b[0] !== 'number') || (typeof b[1] !== 'number') ||
            (a[0] < 0) || (b[0] < 0) || (a[1] < 0) || (b[1] < 0) ||
            (a[0] > this.row) || (b[0] > this.row) || (a[1] > this.column) || (b[1] > this.column)) {
            throw ('输入坐标错误');
        }

        const start = [], end = [];
        [start[0], end[0]] = a[0] < b[0] ? [a[0], b[0]] : [b[0], a[0]];
        [start[1], end[1]] = a[1] < b[1] ? [a[1], b[1]] : [b[1], a[1]];

        const ans = new Matrix(end[0] - start[0] + 1, end[1] - start[1] + 1);
        for (let i = start[0]; i <= end[0]; i++) {
            for (let j = start[1]; j <= end[1]; j++) {
                ans[i - start[0]][j - start[1]] = this[i][j];
            }
        }
        return (ans);
    },
    //输出string
    vision() {
        for (let i = 0; i < this.row; i++) {
            console.log(this[i].join(', '));
        }
    }
};
//矩阵类的静态方法
Matrix.extend({
    //验证矩阵ma是否是矩阵，如果是，那么返回[行数，列数]，否则返回false
    //下标必须从0开始，下标必须连续，不得含有非数字元素
    isMatrix(ma) {
        if (ma instanceof Matrix) {
            return ([ma.row, ma.column]);
        }
        let subx = -1, columnMax = -1;
        for (const i in ma) if (ma.hasOwnProperty(i)) {                       //枚举矩阵行下标
            if ((parseInt(i) - subx === 1) && (ma[i] instanceof Array)) {   //下标连续且第一个下标下的元素也是数组
                const row = ma[i];
                let suby = -1;
                for (const j in row) if (row.hasOwnProperty(j)) {             //枚举当前行
                    if ((parseInt(j) - suby === 1) &&                       //下标连续，并且当前元素是数字
                        (typeof row[j] === 'number')) {
                        suby++;
                    } else {
                        return (false);
                    }
                }
                if (columnMax === -1) {
                    columnMax = suby;
                } else if (columnMax !== suby) {
                    return (false);
                }
            } else {
                return (false);
            }
            subx++;
        }
        return ([subx + 1, columnMax + 1]);
    },
    //矩阵组合
    combination(ma) {
        if (!(ma && (ma instanceof Array)))
            throw ('无法组合矩阵');
        for (let i = 0; i < ma.length - 1; i++)
            if (!(ma[i] && (ma[i] instanceof Array) && (ma[i + 1] instanceof Array) && (ma[i].length === ma[i + 1].length)))
                throw ('无法组合矩阵');
        //每一行的行
        const RowInRow = [];
        for (let i = 0; i < ma.length; i++) {
            let Row = undefined;
            for (let j = 0; j < ma[i].length; j++) {
                if ((typeof ma[i][j] !== 'number') && (typeof ma[i][j] !== 'string')) {
                    let tempRow;
                    if (ma[i][j] instanceof Matrix) {
                        tempRow = ma[i][j].row;
                    } else {
                        tempRow = Object.isMatrix(ma[i][j])[0];
                    }
                    if ((Row !== undefined) && (Row !== tempRow))
                        throw ('无法组合矩阵');
                    Row = tempRow;
                }
            }
            RowInRow.push(Row);
        }
        //每一列的列
        const ColumnInColumn = [];
        for (let j = 0; j < ma[0].length; j++) {
            let Column = undefined;
            for (let i = 0; i < ma.length; i++) {
                if ((typeof ma[i][j] !== 'number') && (typeof ma[i][j] !== 'string')) {
                    let tempColumn;
                    if (ma[i][j] instanceof Matrix) {
                        tempColumn = ma[i][j].column;
                    } else {
                        tempColumn = Object.isMatrix(ma[i][j])[1];
                    }
                    if ((Column !== undefined) && (Column !== tempColumn))
                        throw ('无法组合矩阵');
                    Column = tempColumn;
                }
            }
            ColumnInColumn.push(Column);
        }
        //串联所有矩阵
        let ColumnMatrix;
        for (let i = 0; i < ma.length; i++) {
            let RowMatrix;
            for (let j = 0; j < ma[i].length; j++) {
                let temp;
                if (!((ma[i][j] instanceof Matrix) && (ma[i][j] instanceof Array)))
                    temp= new Matrix(RowInRow[i], ColumnInColumn[j], ma[i][j]);
                else temp = ma[i][j];

                if (RowMatrix) RowMatrix = RowMatrix.concatRight(temp);
                else RowMatrix = temp;
            }
            if (ColumnMatrix) ColumnMatrix = ColumnMatrix.concatDown(RowMatrix);
            else ColumnMatrix = RowMatrix;
        }
        return (ColumnMatrix);
    },
    //复制当前矩阵
    clone(ma) {
        if (!(ma instanceof Matrix)) throw ('只有矩阵才能调用此方法');
        const ans = new Matrix(ma.row, ma.column);
        ma.forEach((item, [i, j]) => ans[i][j] = item);
        return (ans);
    }
});
//矩阵类继承Array方法
Object.setPrototypeOf(Matrix.prototype, Array.prototype);

export { Matrix };
