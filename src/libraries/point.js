const u = undefined;

//点和向量
function Point(a, b) {
    if (typeof a === 'number') {
        // 输入一个点
        this[0] = a;
        this[1] = !Number.isNaN(+b) ? +b : a;
    } else if (isPoint(a) && b === u) {
        // 输入一个点
        this[0] = a[0];
        this[1] = a[1];
    } else if (isPoint(a) && isPoint(b)) {
        // 输入是两个点，当作向量处理
        this[0] = b[0] - a[0];
        this[1] = b[1] - a[1];
    }
}
Point.prototype = {
    // 构造函数
    constructor: Point,
    // 默认长度为 2
    length: 2,
    // 加法，如果输入数组，那么逐个相加
    add(label = 1, a) {
        const sum = new Point(0, 0),
            sign = (a === u) ? 1 : label,
            arr = (a === u) ? label : a;

        if (typeof arr === 'number') {
            sum[0] = this[0] + arr * sign;
            sum[1] = this[1] + arr * sign;
        } else if (arr.length) {
            sum[0] = this[0] + arr[0] * sign;
            sum[1] = this[1] + arr[1] * sign;
        }
        return (sum);
    },
    // 乘法，如果输入数组，那么逐个相乘
    mul(label = 1, a) {
        const sum = new Point(0, 0),
            sign = (a === u) ? 1 : label,
            arr = (a === u) ? label : a;

        if (typeof arr === 'number') {
            const temp = (sign === -1) ? 1 / arr : arr;
            sum[0] = this[0] * temp;
            sum[1] = this[1] * temp;
        } else if (arr.length) {
            for (let i = 0; i < 2; i++) {
                const muled = (sign === -1) ? 1 / arr[i] : arr[i];
                sum[i] = this[i] * muled;
            }
        }
        return (sum);
    },
    // 向量相乘
    product(a) {
        return (this[0] * a[0] + this[1] * a[1]);
    },
    // 绝对值
    abs() {
        return (new Point(
            Math.abs(this[0]),
            Math.abs(this[1])
        ));
    },
    // 到另一点的距离
    disPoint(p) {
        return Math.sqrt(
            (this[0] - p[0]) * (this[0] - p[0]) +
            (this[1] - p[1]) * (this[1] - p[1])
        );
    },
    // 单位化，符号不变，模变为 factor
    toUnit(factor = 1) {
        const a = +this[0], b = +this[1];

        if (!a && !b) {
            return (new Point(0, 0));
        }

        const scale = 1 / Math.sqrt(a * a + b * b);
        return (new Point(a * scale * factor, b * scale * factor));
    },
    // 四舍五入
    round(n = 20) {
        return (new Point(
            Math.round(this[0] / n) * n,
            Math.round(this[1] / n) * n
        ));
    },
    roundToSmall(n = 20) {
        return (new Point(
            Math.round(this[0] / n),
            Math.round(this[1] / n)
        ));
    },
    // 向下取整
    floor(n = 20) {
        return (new Point(
            Math.floor(this[0] / n) * n,
            Math.floor(this[1] / n) * n
        ));
    },
    floorToSmall(n = 20) {
        return (new Point(
            Math.floor(this[0] / n),
            Math.floor(this[1] / n)
        ));
    },
    // 是否是整数点
    isInteger() {
        return (this.length === 2 &&
            this[0] === Math.floor(this[0]) &&
            this[1] === Math.floor(this[1]));
    },
    // 是否平行
    isParallel(vector) {
        return (this[0]*vector[1] === this[1]*vector[0]);
    },
    // 是否垂直
    isVertical(vector) {
        return (!(this[0]*vector[0] + this[1]*vector[1]));
    },
    // 方向相同，0向量输出false
    isSameDire(vector) {
        const vc1 = this.toUnit(),
            vc2 = Point.prototype.toUnit.call(vector);
        return (vc1.isEqual(vc2));
    },
    // 方向相反，0向量输出false
    isOppoDire(vector) {
        const vc1 = this.toUnit().mul(-1),
            vc2 = Point.prototype.toUnit.call(vector);
        return (vc1.isEqual(vc2));
    }
};
Object.setPrototypeOf(Point.prototype, Array.prototype);

function isPoint(a) {
    return (
        a instanceof Point ||
        (a instanceof Object &&
        typeof a[0] === 'number' &&
        typeof a[1] === 'number')
    );
}
function $P(a, b) {
    return (new Point(a, b));
}

export { $P };
