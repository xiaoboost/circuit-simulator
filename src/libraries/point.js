//点和向量
class Point {
    constructor(a, b) {
        if (a instanceof Point) {
            // 复制
            this[0] = a[0];
            this[1] = a[1];
        } else if (isPoint(a) && isPoint(b)) {
            // 输入是两个点，当作向量处理
            this[0] = b[0] - a[0];
            this[1] = b[1] - a[1];
        } else if (isPoint(a)) {
            // 输入是点
            this[0] = a[0];
            this[1] = a[1];
        }
    }
}


function isPoint(a) {
    return (
        a instanceof Object &&
        a instanceof Point ||
        typeof a[0] === 'number' &&
        typeof a[1] === 'number'
    );
}
function $P(a, b) {
    return (new Point(a, b));
}

export { $P };
