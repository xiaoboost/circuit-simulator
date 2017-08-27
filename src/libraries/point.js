const u = undefined;

// 点和向量
function Point(a, b) {
    if (typeof a === 'number') {
        // 输入一（或二）个数
        this[0] = a;
        this[1] = !Number.isNaN(+b) ? +b : a;
    } else if (isPoint(a) && !isPoint(b)) {
        // 输入一个点
        this[0] = a[0];
        this[1] = a[1];
    } else if (isPoint(a) && isPoint(b)) {
        // 输入是两个点，当作向量处理
        this[0] = b[0] - a[0];
        this[1] = b[1] - a[1];
    }
}
Point.prototype = Object.create(Array.prototype);
Object.assign(Point.prototype, {
    // 构造函数
    constructor: Point,
    // 默认长度为 2
    length: 2,
    // 加法，如果输入数组，那么逐个相加
    add(label, a) {
        const sign = (a === u) ? 1 : label,
            arr = (a === u) ? label : a;

        let sum = void 0;
        if (typeof arr === 'number') {
            sum = $P(
                this[0] + arr * sign,
                this[1] + arr * sign
            );
        } else if (arr.length) {
            sum = $P(
                this[0] + arr[0] * sign,
                this[1] + arr[1] * sign
            );
        }
        return (sum);
    },
    // 乘法，如果输入数组，那么逐个相乘
    mul(label, a) {
        const sign = (a === u) ? 1 : label,
            arr = (a === u) ? label : a;

        let sum = void 0;
        if (typeof arr === 'number') {
            const temp = (sign === -1) ? 1 / arr : arr;
            sum = $P(this[0] * temp, this[1] * temp);
        } else if (arr.length) {
            sum = $P(0, 0);
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
    // 符号化
    sign() {
        return $P(this.map((n) => Math.sign(n)));
    },
    // 到另一点的距离
    distance(p) {
        return Math.hypot(
            (this[0] - p[0]),
            (this[1] - p[1])
        );
    },
    // 单位化，符号不变，模变为 factor
    toUnit(factor = 1) {
        const scale = 1 / this.distance([0, 0]);
        return this.mul(scale * factor);
    },
    // 四舍五入
    round(n = 20) {
        return (new Point(
            Number.parseInt((this[0] / n).toFixed()) * n,
            Number.parseInt((this[1] / n).toFixed()) * n
        ));
    },
    roundToSmall(n = 20) {
        return (new Point(
            Number.parseInt((this[0] / n).toFixed()),
            Number.parseInt((this[1] / n).toFixed())
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
    // 是零向量
    isZero() {
        return (this[0] === 0 && this[1] === 0);
    },
    // 是否是整数点
    isInteger() {
        return (
            this.length === 2 &&
            this[0] === Math.floor(this[0]) &&
            this[1] === Math.floor(this[1])
        );
    },
    // 是否平行
    isParallel(vector) {
        return (!vector[0] && !vector[1])
            ? false
            : (this[0] * vector[1] === this[1] * vector[0]);
    },
    // 是否垂直
    isVertical(vector) {
        return (!(this[0] * vector[0] + this[1] * vector[1]));
    },
    // 方向相同，0向量输出false
    isSameDire(vector) {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) > 0
        );
    },
    // 方向相反，0向量输出false
    isOppoDire(vector) {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) < 0
        );
    },
    // 是否在线段内
    isInLine(segment) {
        // 点到线段两端的向量方向相反，即表示其在线段内
        const toStart = $P(this, segment[0]),
            toEnd = $P(this, (segment[1] || [Infinity, Infinity]));

        return (
            toEnd.isZero() ||
            toStart.isZero() ||
            toStart.isOppoDire(toEnd)
        );
    },
    // 以中心点和四角点，枚举范围内的所有点
    around(margin, fn) {
        let label = false;
        const stop = () => (label = true);

        for (let i = this[0] + margin[0][0]; i <= this[0] + margin[1][0]; i++) {
            for (let j = this[1] + margin[0][1]; j <= this[1] + margin[1][1]; j++) {
                fn(i, j, stop);
                if (label) { return (false); }
            }
        }
        return (true);
    },
    aroundInf(fn, fa = 1) {
        const ans = fn(this) ? [Array.from(this)] : [];
        for (let m = 1; !ans.length; m++) {
            for (let i = 0; i < m; i++) {
                const x = i * fa, y = (m - i) * fa,
                    around = (!x)
                        ? [[0, y], [0, -y], [y, 0], [-y, 0]]
                        : [[x, y], [x, -y], [-x, y], [-x, -y]],
                    points = around.map((n) => this.add(n));

                ans.push(...points.filter((point) => fn(point)));

                if (ans.length) { break; }
            }
        }
        return ans;
    },
    // 在points中与this距离最短的点
    closest(points) {
        return !points.length
            ? false
            : $P(points.reduce(
                (pre, next) =>
                    this.distance(pre) < this.distance(next) ? pre : next
            ));
    },
    // 以当前点为左上角，生成四方格坐标
    toGrid(len = 20) {
        return ([
            new $P(this),
            new $P(this[0] + len, this[1]),
            new $P(this[0], this[1] + len),
            new $P(this[0] + len, this[1] + len),
        ]);
    },
});

function isPoint(a) {
    return (
        a instanceof Point ||
        (a instanceof Object &&
        typeof a[0] === 'number' &&
        typeof a[1] === 'number')
    );
}
function $P(a = [0, 0], b) {
    return (new Point(a, b));
}
$P.isPoint = isPoint;
$P.constructor = Point;

export { $P };
