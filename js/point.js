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

function vectorProduct(a, b) {
    return exPoint.prototype.product.call(a, b);
}
function nodeDistance(node, end) {
    return exPoint.prototype.distance.call(node, end);
}

//点和向量
function exPoint(arr) {
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
exPoint.prototype = {
    //加法，如果输入数组，那么逐个相加
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
        return(new exPoint(sum));
    },
    //乘法，如果输入数组，那么逐个相乘
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
        return(new exPoint(sum));
    },
    //向量相乘
    product(a) {
        return(this[0] * a[0] + this[1] * a[1]);
    },
    //单位化，符号不变，数值变为1
    toUnit() {
        const scale = 1 / Math.sqrt(this[0] * this[0] + this[1] * this[1]);
        return(new exPoint([this[0] * scale, this[1] * scale]));
    },
    //是否是整数点
    isInteger() {
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
    //方向相同，0向量输出false
    isSameDire(vector) {
        const vc1 = this.toUnit(),
            vc2 = Point.prototype.toUnit.call(vector);
        return(vc1.isEqual(vc2));
    },
    //方向相反，0向量输出false
    isOppoDire(vector) {
        const vc1 = this.toUnit().mul(-1),
            vc2 = Point.prototype.toUnit.call(vector);
        return(vc1.isEqual(vc2));
    },
    //在某线段范围内
    inLine(line) {
        if(line[0][0] === line[1][0] && line[0][0] === this[0]) {
            return (
                (this[1] >= line[0][1] && this[1] <= line[1][1]) ||
                (this[1] <= line[0][1] && this[1] >= line[1][1])
            );
        } else if(line[0][1] === line[1][1] && line[0][1] === this[1]) {
            return(
                (this[0] >= line[0][0] && this[0] <= line[1][0]) ||
                (this[0] <= line[0][0] && this[0] >= line[1][0])
            );
        }
    },
    //点到点或线的距离
    distance(end) {
        if(end[0].length) {
            //end是线段
            //垂直为1，水平为0
            const sub = +(end[0][1] !== end[1][1]);
            if (((this[sub] <= end[0][sub]) && (this[sub] >= end[1][sub])) ||
                ((this[sub] >= end[0][sub]) && (this[sub] <= end[1][sub]))) {
                //this在线段x或y轴范围内
                return(Math.abs(this[1 - sub] - end[0][1 - sub]));
            } else {
                //否则，取线段起点或终点中和this距离小的
                return(Math.min(
                    Math.abs(this[0] - end[0][0]) + Math.abs(this[1] - end[0][1]),
                    Math.abs(this[0] - end[1][0]) + Math.abs(this[1] - end[1][1])
                ));
            }
        } else {
            //end是点
            return(Math.abs(this[0] - end[0]) + Math.abs(this[1] - end[1]));
        }
    },
    //四舍五入
    round(n = 20) {
        return(new exPoint([
            Math.round(this[0] / n) * n,
            Math.round(this[1] / n) * n
        ]));
    },
    roundToSmall(n = 20) {
        return(new exPoint([
            Math.round(this[0] / n),
            Math.round(this[1] / n)
        ]));
    },
    //向下取整
    floor(n = 20) {
        return(new exPoint([
            Math.floor(this[0] / n) * n,
            Math.floor(this[1] / n) * n
        ]));
    },
    floorToSmall(n = 20) {
        return(new exPoint([
            Math.floor(this[0] / n),
            Math.floor(this[1] / n)
        ]));
    },
    //以当前点为左上角，生成四方格坐标
    toGrid() {
        return([
            new exPoint(this),
            new exPoint([this[0] + 20, this[1]]),
            new exPoint([this[0], this[1] + 20]),
            new exPoint([this[0] + 20, this[1] + 20])
        ]);
    },
    //在vectors中与this夹角最小的向量
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
Object.setPrototypeOf(exPoint.prototype, Array.prototype);

//对外暴露的构造函数
function Point(...args) {
    return (new exPoint(...args));
}
Point.extend({
    isPoint(arr) {
        return (
            arr instanceof exPoint ||
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
Point.prototype = exPoint.prototype;

export { Point };