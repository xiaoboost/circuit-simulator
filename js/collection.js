//单个器件的最大值
const maxNumber = 50;

//器件堆栈类
function PartsCollection(parts) {
    if(typeof parts === "number") {
        //当输入为一个数字时，将会返回一个普通数组
        const ans = new Array(parts);
        return(ans);
    }
    this.hash = {};
    this.current = {};
    this.length = 0;
    //输入不为空
    if(parts !== undefined) {
        if(!(parts instanceof Array)) {
            this.push(parts);
        }
        for(let i = 0; i < parts.length; i++) {
            this.push(parts[i]);
        }
    }

    Object.defineProperties(this, {
        hash: {
            configurable: false,
            writable: false,
            enumerable: false
        },
        length: {
            configurable: false,
            enumerable: false
        },
        current: {
            configurable: false,
            enumerable: false
        }
    });
}
PartsCollection.prototype = {
    constructor: PartsCollection,
    //器件压栈
    push (part) {
        if (!part.elementDOM) {
            return(false);
        }
        if(this.has(part)) {
            const insert = this.hash[part.id],
                insertElem = part,
                top = this.length - 1,
                topElem = this[top];
            this[top] = insertElem;
            this[insert] = topElem;
            this.hash[insertElem] = top;
            this.hash[topElem] = insert;
        } else {
            this[this.length ++] = part;
            this.hash[part.id] = this.length - 1;
        }
        return(this);
    },
    //栈顶器件弹出
    pop () {
        const temp = Array.prototype.pop.call(this);
        if (temp) {
            delete this.hash[temp.id];
            return (temp);
        }
    },
    //根据器件ID返回器件对象
    findPart (tempid) {
        if(!tempid) { return(false); }

        const id = tempid.split("-")[0];
        if (!this.has(id)) {
            return(false);
        }
        return(this[this.hash[id]]);
    },
    //删除器件
    deletePart (part) {
        let tempid;
        if (typeof part === "string") {
            tempid = part;
        } else if ((part.elementDOM && part.input) || (part.id.indexOf("line") !== -1)) {
            tempid = part.id;
        } else {
            throw("输入参数必须是字符串或者器件对象");
        }
        if(this.hash[tempid] === undefined) return(false);
        const sub = this.hash[tempid];      //要删除的器件下标
        this.splice(sub, 1);                //删除器件
        //被删除器件之后的全部器件在hash表中的记录全部减1
        for (let i = sub; i < this.length; i++) {
            this.hash[this[i].id] --;
        }
        delete this.hash[tempid];           //删除hash表中的记录
    },
    //删除器件集合
    deleteParts (temp) {
        const parts = (temp instanceof PartsCollection) ? temp : new PartsCollection(temp);
        const ans = new PartsCollection(this);
        this.deleteAll();
        ans.forEach((n) => (parts.has(n) || this.push(n)));
    },
    //集合是否包含该器件
    has (part) {
        let tempid;
        if (typeof  part === "string") {
            tempid = part.split("-")[0];
        } else {
            tempid = part.id;
        }
        return(this.hash[tempid] !== undefined);
    },
    //从已有器件中推算新ID
    newId (input) {
        let tempid;
        for (let i = 1; i <= maxNumber; i++) {
            tempid = input + i;
            if (!this.has(tempid)) {
                return (tempid);
            }
        }
        throw("器件数量超出最大限制");
    },
    //器件堆栈清空
    deleteAll () {
        for(let i = 0; i < this.length; i++) {
            this[i].toNormal();
            delete this.hash[this[i].id];
            delete this[i];
        }
        this.length = 0;
    },
    //复制器件堆栈
    selectAll (parts) {
        for (let i = 0; i < parts.length; i++) {
            this.push(parts[i]);
        }
    },
    //枚举器件
    forEach(callback) {
        for(let i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    },
    //同Array的every
    every(callback) {
        for (let i = 0; i < this.length; i++) {
            if (!callback(this[i], i, this)) {
                return (false);
            }
        }
        return (true);
    },
    //分割连通图，返回连通图数组
    connectGraph() {
        const partsArea = [],   //电路连通区域
            partsHash = {};     //电路所有器件Hash查询表

        //连接表初始化
        this.forEach((n) => partsHash[n.id] = true);
        //扫描所有器件，分割电路连通图区域
        this.forEach(function(n) {
            if (partsHash[n.id]) {
                //当前连通区域初始化
                const parts = new PartsCollection(n),
                    ans = new PartsCollection();
                //由初始器件搜索当前连通区域
                while (parts.length) {
                    const item = parts.pop();       //栈顶元素弹出
                    partsHash[item.id] = false;     //当前器件访问标志
                    ans.push(item);                 //当前区域器件入栈
                    item.connect.join(" ").split(" ").forEach(function(n) {
                        const tempPart = partsAll.findPart(n);
                        //attention:
                        if (tempPart.partType === "网络标号") {

                        } else {
                            if (partsHash[tempPart.id] && !parts.has(tempPart))
                                parts.push(tempPart);
                        }
                    });
                }
                partsArea.push(ans);
            }
        });
        return(partsArea);
    }
};
Object.setPrototypeOf(PartsCollection.prototype, Array.prototype);

//全局器件集合
const partsAll = new PartsCollection(),
    partsNow = new PartsCollection();

export { partsAll, partsNow, PartsCollection };