//点和向量
class Point {
    constructor(arr) {
        if (arr instanceof Point) {
            // 复制
            this[0] = arr[0];
            this[1] = arr[1];
        } else if (Point.isPoint(arr)) {
            // 输入是点
            this[0] = arr[0];
            this[1] = arr[1];
        } else if (Point.isVector(arr)){
            // 输入是向量
            this[0] = arr[1][0] - arr[0][0];
            this[1] = arr[1][1] - arr[0][1];
        }
        this.length = 2;
        Object.defineProperty(this, 'length', {
            configurable: false,
            enumerable: false,
            writable: false
        });
    }
}

function $Pi(...args) {
    return (new Point(...args));
}

Object.assign($Pi, Point);

export { $Pi };
