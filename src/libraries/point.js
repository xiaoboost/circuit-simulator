// 点和向量
class Point {
    constructor(a, b) {
        if (typeof a === 'number') {
            // 输入一（或二）个数
            this[0] = a;
            this[1] = !Number.isNaN(+b) ? +b : a;
        } else if (Point.isPoint(a) && !Point.isPoint(b)) {
            // 输入一个点
            this[0] = a[0];
            this[1] = a[1];
        } else if (Point.isPoint(a) && Point.isPoint(b)) {
            // 输入是两个点，当作向量处理
            this[0] = b[0] - a[0];
            this[1] = b[1] - a[1];
        }

        Object.defineProperty(this, 'length', {
            writable: false,
            enumerable: false,
            configurable: false,
            value: 2,
        });
    }

    static isPoint(a) {
        return (
            a instanceof Point ||
            (a instanceof Object &&
            typeof a[0] === 'number' &&
            typeof a[1] === 'number')
        );
    }

    // 加法
    add(arr, label = 1) {
        let sum = void 0;
        if (typeof arr === 'number') {
            sum = new Point(
                this[0] + arr * label,
                this[1] + arr * label
            );
        } else if (arr.length) {
            sum = new Point(
                this[0] + arr[0] * label,
                this[1] + arr[1] * label
            );
        }
        return (sum);
    }
    // 乘法
    mul(arr, label = 1) {
        let sum = void 0;
        if (typeof arr === 'number') {
            sum = new Point(
                this[0] * (label === -1) ? 1 / arr : arr,
                this[1] * (label === -1) ? 1 / arr : arr
            );
        } else if (arr.length) {
            sum = new Point(
                this[0] * ((label === -1) ? 1 / arr[0] : arr[0]),
                this[1] * ((label === -1) ? 1 / arr[1] : arr[1])
            );
        }
        return (sum);
    }
    // 向量相乘
    product(a) {
        return (this[0] * a[0] + this[1] * a[1]);
    }
    // 绝对值
    abs() {
        return (new Point(
            Math.abs(this[0]),
            Math.abs(this[1])
        ));
    }
    // 符号化
    sign() {
        return new Point(this.map((n) => Math.sign(n)));
    }
    // 到另一点的距离
    distance(p) {
        return Math.hypot(
            (this[0] - p[0]),
            (this[1] - p[1])
        );
    }
    // 单位化，符号不变，模变为 factor
    toUnit(factor = 1) {
        const scale = 1 / this.distance([0, 0]);
        return this.mul(scale * factor);
    }
    // 四舍五入
    round(n = 20) {
        return (new Point(
            Number.parseInt((this[0] / n).toFixed()) * n,
            Number.parseInt((this[1] / n).toFixed()) * n
        ));
    }
    roundToSmall(n = 20) {
        return (new Point(
            Number.parseInt((this[0] / n).toFixed()),
            Number.parseInt((this[1] / n).toFixed())
        ));
    }
    // 向下取整
    floor(n = 20) {
        return (new Point(
            Math.floor(this[0] / n) * n,
            Math.floor(this[1] / n) * n
        ));
    }
    floorToSmall(n = 20) {
        return (new Point(
            Math.floor(this[0] / n),
            Math.floor(this[1] / n)
        ));
    }
    // 是零向量
    isZero() {
        return (this[0] === 0 && this[1] === 0);
    }
    // 是否是整数点
    isInteger() {
        return (
            this.length === 2 &&
            this[0] === Math.floor(this[0]) &&
            this[1] === Math.floor(this[1])
        );
    }
    // 是否平行
    isParallel(vector) {
        return (!vector[0] && !vector[1])
            ? false
            : (this[0] * vector[1] === this[1] * vector[0]);
    }
    // 是否垂直
    isVertical(vector) {
        return (!(this[0] * vector[0] + this[1] * vector[1]));
    }
    // 方向相同，0向量输出false
    isSameDire(vector) {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) > 0
        );
    }
    // 方向相反，0向量输出false
    isOppoDire(vector) {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) < 0
        );
    }
    // 是否在线段内
    isInLine(segment) {
        // 点到线段两端的向量方向相反，即表示其在线段内
        const toStart = new Point(this, segment[0]),
            toEnd = new Point(this, (segment[1] || [Infinity, Infinity]));

        return (
            toEnd.isZero() ||
            toStart.isZero() ||
            toStart.isOppoDire(toEnd)
        );
    }
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
    }
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
    }
    // 在points中与this距离最短的点
    closest(points) {
        return !points.length
            ? false
            : new Point(points.reduce(
                (pre, next) =>
                    this.distance(pre) < this.distance(next) ? pre : next
            ));
    }
    // 以当前点为左上角，生成四方格坐标
    toGrid(len = 20) {
        return ([
            new Point(this),
            new Point(this[0] + len, this[1]),
            new Point(this[0], this[1] + len),
            new Point(this[0] + len, this[1] + len),
        ]);
    }
    join(str = ',') {
        return `${this[0]}${str}${this[1]}`;
    }
}

function $P(a = [0, 0], b) {
    return (new Point(a, b));
}

$P.isPoint = Point.isPoint;
$P.constructor = Point;

export { $P, Point };
