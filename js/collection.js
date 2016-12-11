//单个器件的最大数量
const maxNumber = 50;

//器件堆栈类
function PartsCollection(parts) {
    if (typeof parts === "number") {
        return (new PartsCollection());
    }
    this.hash = {};
    this.current = {};
    this.length = 0;
    //输入不为空
    if (parts !== undefined) {
        if (!(parts instanceof Array)) {
            this.push(parts);
        }
        for (let i = 0; i < parts.length; i++) {
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
    push(part) {
        if (!part.elementDOM) {
            return (false);
        }
        if (this.has(part)) {
            const insert = this.hash[part.id],
                insertElem = part,
                top = this.length - 1,
                topElem = this[top];
            this[top] = insertElem;
            this[insert] = topElem;
            this.hash[insertElem] = top;
            this.hash[topElem] = insert;
        }
        else {
            this[this.length++] = part;
            this.hash[part.id] = this.length - 1;
        }
        return (this);
    },
    //栈顶器件弹出
    pop() {
        const temp = Array.prototype.pop.call(this);
        if (temp) {
            delete this.hash[temp.id];
            return (temp);
        }
    },
    //根据器件ID返回器件对象
    findPart(tempid) {
        if (!tempid) {
            return (false);
        }

        const id = tempid.split("-")[0];
        if (!this.has(id)) {
            return (false);
        }
        return (this[this.hash[id]]);
    },
    //删除器件
    deletePart(part) {
        let tempid;
        if (typeof part === "string") {
            tempid = part;
        }
        else if ((part.elementDOM && part.input) || (part.id.indexOf("line") !== -1)) {
            tempid = part.id;
        }
        else {
            throw("输入参数必须是字符串或者器件对象");
        }

        if (this.hash[tempid] === undefined) {
            return (false);
        }
        //要删除的器件下标
        const sub = this.hash[tempid];
        this.splice(sub, 1);

        //被删除器件之后的全部器件在hash表中的记录全部减1
        for (let i = sub; i < this.length; i++) {
            this.hash[this[i].id]--;
        }
        //删除hash表中的记录
        delete this.hash[tempid];
    },
    //删除器件集合
    deleteParts(temp) {
        const parts = (temp instanceof PartsCollection) ? temp : new PartsCollection(temp);
        const ans = new PartsCollection(this);
        this.deleteAll();
        ans.forEach((n) => (parts.has(n) || this.push(n)));
    },
    //集合是否包含该器件
    has(part) {
        let tempid;
        if (typeof  part === "string") {
            tempid = part.split("-")[0];
        }
        else {
            tempid = part.id;
        }
        return (this.hash[tempid] !== undefined);
    },
    //从已有器件中推算新ID
    newId(input) {
        const temp = input.match(/^[^_]+(_[^_]+)?/),
            id = temp && temp[0];

        if (!temp) {
            throw("器件ID格式错误");
        }

        let tempid = "", ans;
        //输入字符串没有下划线
        if (id.indexOf("_") === -1) {
            tempid = id + "_";
        }
        else if (!this.has(input)) {
            return (input);
        }
        else {
            tempid = id.split("_")[0] + "_";
        }

        for (let i = 1; i <= maxNumber; i++) {
            ans = tempid + i;
            if (!this.has(ans)) {
                return (ans);
            }
        }
        throw("器件数量超出最大限制");
    },
    //器件堆栈清空
    deleteAll() {
        for (let i = 0; i < this.length; i++) {
            this[i].toNormal();
            delete this.hash[this[i].id];
            delete this[i];
        }
        this.length = 0;
        this.current = {};
    },
    //分割连通图，返回连通图数组
    connectGraph() {
        const partsArea = [],   //电路连通区域
            partsHash = {};     //电路所有器件Hash查询表

        //连接表初始化
        this.forEach((n) => partsHash[n.id] = true);
        //扫描所有器件，分割电路连通图区域
        this.forEach(function (n) {
            if (partsHash[n.id]) {
                //当前连通区域初始化
                const parts = new PartsCollection(n),
                    ans = new PartsCollection();
                //由初始器件搜索当前连通区域
                while (parts.length) {
                    const item = parts.pop();       //栈顶元素弹出
                    partsHash[item.id] = false;     //当前器件访问标志
                    ans.push(item);                 //当前区域器件入栈
                    item.connect.join(" ").split(" ").forEach(function (n) {
                        const tempPart = partsAll.findPart(n);
                        //attention:
                        if (tempPart.partType === "网络标号") {

                        }
                        else {
                            if (partsHash[tempPart.id] && !parts.has(tempPart))
                                parts.push(tempPart);
                        }
                    });
                }
                partsArea.push(ans);
            }
        });
        return (partsArea);
    },
    //所有器件的几何中心点
    center() {
        //所有器件的节点集合
        let nodes = [];
        for (let i = 0; i < this.length; i++) {
            //导线为所有节点集合，器件则是它本身的几何中心
            const node = this[i].way
                ? this[i].way.nodeCollection()
                : this[i].position.round();

            nodes = nodes.concat(node);
        }

        const nodeX = nodes.map((n) => n[0]),
            nodeY = nodes.map((n) => n[1]);

        return ([
            (Math.minOfArray(nodeX) + Math.maxOfArray(nodeX)) / 2,
            (Math.minOfArray(nodeY) + Math.maxOfArray(nodeY)) / 2
        ]);
    },
    //同Array的forEach
    forEach(callback) {
        for (let i = 0; i < this.length; i++) {
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
    //同Array的filter
    filter(callback) {
        const ans = new PartsCollection();
        for (let i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                ans.push(this[i]);
            }
        }
        return (ans);
    }
};
Object.setPrototypeOf(PartsCollection.prototype, Array.prototype);

//全局器件集合
const partsAll = new PartsCollection(),
    partsNow = new PartsCollection();

export { partsAll, partsNow, PartsCollection };