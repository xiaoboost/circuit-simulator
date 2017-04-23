// 单个器件的最大数量
const maxNumber = 100;

// 器件集合类，类方法只有查询操作
// 修改集合只能通过 mutations
function Collection() {
    this._hash = {};
    this.length = 0;
}
Collection.prototype = {
    has(id) {
        id = id.id || id;
        return (!!this._hash[id]);
    },
    find(id) {
        if (!id) {
            return (false);
        }
        const pre = id.split('-')[0];
        if (!this.has(pre)) {
            return (false);
        }
        return (this[this._hash[pre]]);
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
};
Object.setPrototypeOf(Collection.prototype, Array.prototype);

// 是否是器件对象
// TODO: 现在是包含id属性的就算，等之后器件数据结构定下来之后就能更精确的判断了
function isElectron(elec) {
    return !!elec.id;
}
function push(set, elec) {
    if (isElectron(elec) && !set.has(elec)) {
        set._hash[elec.id] = set.length;
        set[set.length ++] = elec;
    }
}
function pop(set) {
    const temp = Array.prototype.pop.call(set);
    if (temp) {
        delete this._hash[temp.id];
        return (temp);
    }
}
function deleted(set, elec) {
    const id = elec.id || elec;

    if (!set.has(id)) {
        return (false);
    }

    const sub = this.hash[id];
    this.splice(sub, 1);
    this.forEach((n, i) => (i > sub && this._hash[n.id]--));
    delete this._hash[sub];
}

export default {
    state: {
        Parts: new Collection(),
        Lines: new Collection()
    },
    mutations: {
        PUSH_PART(state, part) {
            const set = state.Parts;
            push(set, part);
            return set.length;
        },
        PUSH_LINE(state, line) {
            const set = state.Lines;
            push(set, line);
            return set.length;
        },
        POP_PART(state) {
            return pop(state.Parts);
        },
        POP_LINE(state) {
            return pop(state.Lines);
        },
        DELETE_PART(state, part) {
            return deleted(state.Parts, part);
        },
        DELETE_LINE(state, line) {
            return deleted(state.Parts, line);
        }
    }
};
