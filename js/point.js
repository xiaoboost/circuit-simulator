//在备选值中选出最大或者最小的
function selectMax(ref, alts, func){
    let max = -Infinity, sub;
    for(let i = 0; i < alts.length; i++) {
        if(alts[i]) {
            const res = func(ref, alts[i]);
            if(res > max) {
                max = res;
                sub = i;
            }
        }
    }
    if(sub !== undefined) {
        return({
            value: alts[sub],
            sub: sub
        });
    } else {
        return(false);
    }
}
function selectMin(ref, alts, func){
    let min = Infinity, sub;
    for(let i = 0; i < alts.length; i++) {
        if(alts[i]) {
            const res = func(ref, alts[i]);
            if (res < min) {
                min = res;
                sub = i;
            }
        }
    }
    if(sub !== undefined) {
        return({
            value: alts[sub],
            sub: sub
        });
    } else {
        return(false);
    }
}
//向量相乘
function vectorProduct(a, b) {
    return (a[0] * b[0] + a[1] * b[1]);
}
//点与点的距离
function nodeDistance(a, b) {
    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]));
}

//点和向量
function Point(arr) {
    if(Point.isPoint(arr)) {
        //输入是点
        this[0] = arr[0];
        this[1] = arr[1];
    } else if(Point.isVector(arr)){
        //输入是向量
        this[0] = arr[1][0] - arr[0][0];
        this[1] = arr[1][1] - arr[0][1];
    }
    this.length = 2;
}
//是否是点
Point.extend({
    isPoint(arr) {
        return (
            arr instanceof Point ||
            typeof arr[0] === "number" &&
            typeof arr[1] === "number"
        );
    },
    isVector(arr) {
        return(
            Point.isPoint(arr[0]) &&
            Point.isPoint(arr[1])
        )
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
    //单位化，符号不变，数值变为1
    toUnit() {
        for(let i = 0; i < 2; i++) {
            if(this[i] > 0) {
                this[i] = 1;
            } else if(this[i] < 0) {
                this[i] = -1;
            }
        }
    },
    //是否是标准格式
    isStandarNode() {
        if(this.length !== 2 ||
            this[0] !== Math.floor(this[0]) ||
            this[1] !== Math.floor(this[1])) {
            return(false);
        }
        return(true);
    },
    //是否平行
    isParallel(vector) {
        return(this[0]*vector[1] === this[1]*vector[0]);
    },
    //是否垂直
    isVertical(vector) {
        return(!!(this[0]*vector[0] + this[1]*vector[1]));
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
    },
    //在vectors中与this最为相似的向量
    similar(vectors) {
        return selectMax(this, vectors, vectorProduct);
    },
    //在points中与this距离最短的点
    closest(points) {
        return selectMin(this, points, nodeDistance)
    },
    //在points中与this距离最远的点
    farest(points) {
        return selectMax(this, points, nodeDistance)
    }
};
Object.setPrototypeOf(Point.prototype, Array.prototype);

export { Point };