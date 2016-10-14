//节点类
function Point(arr) {
    this[0] = arr[0];
    this[1] = arr[1];
    this.length = 2;
    Object.seal(this);
}
Point.extend({
    //点
    isPoint(arr) {
        return(
            arr instanceof Point ||
            arr.length === 2 &&
            typeof arr[0] === "number" &&
            typeof arr[1] === "number"
        );
    },
    //线段
    isSegment(arr) {
        return(
            arr.length === 2 &&
            Point.isPoint(arr[0]) &&
            Point.isPoint(arr[1])
        );
    },
    //线段集
    isPolyline(arr) {
        for(let i = 0; i < arr.length; i++) {
            if(!Point.isSegment(arr[i])) {
                return(false);
            }
        }
        return(true);
    }
});
Point.prototype = {
    add(label = 1, a) {
        const sum = [],
            sign = (a === undefined) ? 1 : label,
            arr = (a === undefined) ? label : a;

        if (typeof arr === "number") {
            for (let i = 0; i < this.length; i++) {
                sum[i] = this[i] + arr * sign;
            }
        } else if (arr.length) {
            for (let i = 0; i < this.length; i++) {
                if (!arr[i]) {
                    sum[i] = this[i];
                } else {
                    sum[i] = this[i] + arr[i] * sign;
                }
            }
        } else {
            sum[0] = this[0];
            sum[1] = this[1];
        }
        return(new Point(sum));
    },
    //数组相乘
    mul(label = 1, a) {
        const sum = [],
            sign = (a === undefined) ? 1 : label;
        let arr = (a === undefined) ? label : a;

        if (typeof arr === "number") {
            arr = (sign === -1) ? 1 / arr : arr;
            for (let i = 0; i < this.length; i++) {
                sum[i] = this[i] * arr;
            }
        } else if (arr.length) {
            for (let i = 0; i < this.length; i++) {
                if (!arr[i]) {
                    sum[i] = this[i];
                } else {
                    const muled = (sign === -1) ? 1 / arr[i] : arr[i];
                    sum[i] = this[i] * muled;
                }
            }
        } else {
            sum[0] = this[0];
            sum[1] = this[1];
        }
        return(new Point(sum));
    },
    //是标准格式
    isStandarNode() {
        if(this.length !== 2 ||
            this[0] !== Math.floor(this[0]) ||
            this[1] !== Math.floor(this[1])) {
            return(false);
        }
        return(true);
    },
    //与另一点/线段/折线的最短距离
    distance(node) {
        //计算方式特殊，仅仅是为了表征距离的长短，并非实际的距离
        //对于点和点，是xy轴分别做差的绝对值相加
        //对于点和线，是和线的垂直距离的绝对值*2，如果点在线外，那么还要加上平行距离
        let ans = 0;
        if(Point.isPoint(node)) {
            //点
            for(let i = 0; i < 2; i++) {
                ans += this[i] - node[i];
            }
        } else if(Point.isSegment(node)) {
            //线段

        } else if(Point.isPolyline(node)) {
            //折线

        }
        return(ans);
    },
    //四舍五入
    round(n = 20) {
        return(new Point([
            Math.round(this[0] / n) * n,
            Math.round(this[1] / n) * n
        ]));
    },
    roundToSmall(n = 20) {
        return(new Point([
            Math.round(this[0] / n),
            Math.round(this[1] / n)
        ]));
    },
    //向下取整
    floor(n = 20) {
        return(new Point([
            Math.floor(this[0] / n) * n,
            Math.floor(this[1] / n) * n
        ]));
    },
    floorToSmall(n = 20) {
        return(new Point([
            Math.floor(this[0] / n),
            Math.floor(this[1] / n)
        ]));
    },
    //以当前点为左上角，生成四方格坐标
    toGrid() {
        return([
            new Point(this),
            new Point([this[0] + 20, this[1]]),
            new Point([this[0], this[1] + 20]),
            new Point([this[0] + 20, this[1] + 20])
        ]);
    }
};
Object.setPrototypeOf(Point.prototype, Array.prototype);

export { Point };