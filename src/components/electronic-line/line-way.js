import { $P } from '@/libraries/point';

// 导线路径类
function LineWay(args) {
    this.length = 0;

    if (!args) {
        args = [];
    } else if ($P.isPoint(args)) {
        args = [args];
    }

    args.forEach((n) => this.push(n));
}
LineWay.prototype = Object.create(Array.prototype);
Object.assign(LineWay.prototype, {
    constructor: LineWay,
    push(node) {
        this[this.length++] = $P(node);
        return (this.length);
    },
    unshift(...args) {
        const len = args.length;
        for (let i = this.length - 1; i >= 0; i--) {
            this[i + len] = this[i];
        }
        for (let i = 0; i < len; i++) {
            this[i] = $P(args[i]);
        }
        this.length = this.length + len;
        return (this.length);
    },
});

export { LineWay };
