// 单个器件的最大数量
const maxNumber = 50;

function isElectron(part) {
    return !!part.id;
}

function Collection(parts) {
    this._hash = {};
    for (let i = 0; i < parts.length; i++) {
        this.push(parts[i]);
    }
}
Collection.prototype = {
    constructor: Collection,
    push(part) {
        if (isElectron(part) && !this.has(part)) {
            this._hash[part.id] = this.length;
            this[this.length] = part;
        }
    },
    pop() {
        const pop = this[this.length - 1];
        this.length = this.length - 1;
        delete this._hash[pop.id];
        return (pop);
    },
    has(id) {
        id = id.id || id;
        return (!!this._hash[id]);
    },
    // 从已有器件中推算新ID
    newId(input) {
        const temp = input.match(/^[^_]+(_[^_]+)?/),
            id = temp && temp[0];

        if (!temp) {
            throw ('器件ID格式错误');
        }
        let tempid = '', ans = void 0;
        // 输入字符串没有下划线
        if (id.indexOf('_') === -1) {
            tempid = id + '_';
        } else if (!this.has(input)) {
            return (input);
        } else {
            tempid = id.split('_')[0] + '_';
        }

        for (let i = 1; i <= maxNumber; i++) {
            ans = tempid + i;
            if (!this.has(ans)) {
                return (ans);
            }
        }
        throw ('器件数量超出最大限制');
    }
};
Object.setPrototypeOf(Collection.prototype, Array.prototype);

export { Collection };
