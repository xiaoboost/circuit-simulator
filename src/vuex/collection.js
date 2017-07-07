// 单个器件的最大数量
const maxNumber = 100;

// 器件集合类，类方法只有查询操作
// 修改集合只能通过 mutations
function Collection() {
    this.length = 0;
}
Collection.prototype = Object.create(Array.prototype);
Object.assign(Collection.prototype, {
    constructor: Collection,
    has(elec) {
        const id = elec.id || elec;
        return this.some((elec) => elec.id === id);
    },
    newId(input) {
        const temp = input.match(/^[^_]+(_[^_]+)?/),
            id = temp && temp[0];

        if (!temp) {
            throw ('器件ID格式错误');
        }

        let tempid = '', ans = void 0;
        //输入字符串没有下划线
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
});

// 是否是器件对象
function isElectron(elec) {
    return !!elec.id && (!!elec.params || !!elec.way);
}
function deleteElec(arr, id) {
    const i = arr.findIndex((elec) => elec.id === id);
    arr.splice(i, 1);
}
function moveToIndex(set, elec, to = 0) {
    const index = set.findIndex(elec);
    if (index === -1) { return (false); }

    to = (to < 0) ? (set.length + to) : to;
    if (index === to) { return (true); }

    elec = set[index];
    set.splice(index, 1);
    set.splice(to, 0, elec);

    return (true);
}

export default {
    state: {
        Parts: new Collection(),
        Lines: new Collection()
    },
    mutations: {
        PUSH_PART(state, part) {
            isElectron(part) && state.Parts.push(part);
        },
        POP_PART(state) {
            state.Parts.pop();
        },
        DELETE_PART(state, part) {
            deleteElec(state.Parts, part);
        },
        PUSH_LINE(state, line) {
            isElectron(line) && state.Parts.push(line);
        },
        POP_LINE(state) {
            state.Lines.pop();
        },
        DELETE_LINE(state, line) {
            deleteElec(state.Lines, line);
        },
        LINE_TO_TOP(state, line) {
            moveToIndex(state.Lines, line, -1);
        },
        LINE_TO_BOTTOM(state, line) {
            moveToIndex(state.Lines, line);
        }
    }
};
