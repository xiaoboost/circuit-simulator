//图纸记录的类
function MapHash() {}
MapHash.prototype = {
    //以小坐标取得节点属性
    getSingleValueBySmalle(node) {
        if (!this[node[0]]) return (false);
        else if (!this[node[0]][node[1]]) return (false);
        return (this[node[0]][node[1]]);
    },
    //以原坐标取得节点属性
    getSingleValueByOrigin(node) {
        return (this.getSingleValueBySmalle([node[0] / 20, node[1] / 20]));
    },
    //以小坐标强制设定节点属性，默认为覆盖模式
    setSingleValueBySmalle(node, attribute, flag = false) {
        if (!this[node[0]]) {
            this[node[0]] = [];
        }
        if (flag) {
            //删除原来的属性
            this[node[0]][node[1]] = {};
        } else if (!this[node[0]][node[1]]) {
            //覆盖模式下只有当节点为空的之后才会重新创建
            this[node[0]][node[1]] = {};
        }
        for (let i in attribute) if (attribute.hasOwnProperty(i)) {
            this[node[0]][node[1]][i] = attribute[i];
        }
    },
    //以原坐标强制设定节点属性，节点已经有的被新的覆盖，旧的不删除
    setSingleValueByOrigin(node, attribute, flag = false) {
        this.setSingleValueBySmalle([node[0] / 20, node[1] / 20], attribute, flag);
    },
    //以小坐标删除节点
    deleteSingleValueBySmalle(node) {
        if (this.getSingleValueBySmalle(node)) {
            delete this[node[0]][node[1]];
        }
        if (Object.isEmpty(this[node[0]])) {
            delete this[node[0]];
        }
    },
    //给节点添加连接关系，如果重复那么就忽略
    pushConnectPointBySmalle(node, connect) {
        let nodeStatus = this.getSingleValueBySmalle(node);
        if (!nodeStatus) return (false);
        if (nodeStatus && !nodeStatus.connect) {
            nodeStatus.connect = [];
        }
        nodeStatus = nodeStatus.connect;
        for (let j = 0; j < nodeStatus.length; j++) {
            if ((nodeStatus[j][0] === connect[0]) &&
                (nodeStatus[j][1] === connect[1])) {
                return (false);
            }
        }
        nodeStatus.push(connect);
        return (true);
    },
    //从鼠标当前坐标判断连接在交错节点的导线应该拔出哪一个
    findLinesByCrossPoint(mousePosition) {
        const nodeRound = [
                Math.round(mousePosition[0] * 0.05) * 20,
                Math.round(mousePosition[1] * 0.05) * 20
            ],
            tempConnect = this.getSingleValueByOrigin(nodeRound).connect;
        //求离鼠标最近的方向
        let minPoint = [[0, 20], [0, -20], [20, 0], [-20, 0]].reduce(function (pre, next) {
            const preDistance = Math.abs(mousePosition[0] - nodeRound[0] - pre[0]) +
                    Math.abs(mousePosition[1] - nodeRound[1] - pre[1]),
                nextDistance = Math.abs(mousePosition[0] - nodeRound[0] - next[0]) +
                    Math.abs(mousePosition[1] - nodeRound[1] - next[1]);
            if (preDistance < nextDistance) return (pre);
            else return (next);
        }).map((n, i) => (nodeRound[i] + n) * 0.05);
        //根据上面求得的方向得到坐标
        //minPoint = [(nodeRound[0] + minPoint[0]) * 0.05, (nodeRound[1] + minPoint[1]) * 0.05];

        //交错节点扩展的节点和当前离鼠标最近的节点是否有交集
        if (!tempConnect.some((n) => n.isEqual(minPoint))) {
            return ([]);
        }
        const expandStatus = this.getSingleValueBySmalle(minPoint);
        let line;
        if (expandStatus.form === "line" || expandStatus.form === "line-point") {
            line = partsAll.findPartObj(expandStatus.id);
        } else if (expandStatus.form === "part-point") {
            const tempPastConnect = expandStatus.id.split("-");
            const tempPart = partsAll.findPartObj(tempPastConnect[0]);
            line = partsAll.findPartObj(tempPart.connect[parseInt(tempPastConnect[1])]);
        }
        const linesId = this.getSingleValueByOrigin(nodeRound).id.split(" "), lines = [];
        for (let i = 0; i < linesId.length; i++) {
            if (linesId[i] !== line.id) {
                lines.push(partsAll.findPartObj(linesId[i]));
            }
        }
        return ([line, lines]);
    },
    //nodelast和node是否在同一个导线上
    nodeInConnectBySmall(nodelast, node) {
        //判断node是否在nodelast的连接表中，两个参数均为small
        //node必须已经确定是line属性，nodelast是否是line属性在此函数内判断
        const nodelastStatus = this.getSingleValueBySmalle(nodelast);
        if (nodelastStatus && (nodelastStatus.form === "line" || nodelastStatus.form === "cross-point")) {
            for (let i = 0; i < nodelastStatus.connect.length; i++) {
                if (nodelastStatus.connect[i][0] === node[0] && nodelastStatus.connect[i][1] === node[1])
                    return (true);
            }
        }
        return (false);
    },
    //设置器件标志位
    makePartSign(id, position, point, range) {
        for (let j = position[1] - range[0]; j <= position[1] + range[2]; j++) {
            for (let i = position[0] - range[1]; i <= position[0] + range[3]; i++) {
                //删除原来的属性，并赋值新的属性
                this.setSingleValueBySmalle([i, j], {
                    id: id,
                    form: "part"
                }, true);
            }
        }
        for (let i = 0; i < point.length; i++) {
            this.setSingleValueBySmalle([position[0] + point[i][0] / 20, position[1] + point[i][1] / 20], {
                id: id + "-" + i,
                form: "part-point",
                connect: []
            }, true);
        }
    },
    //删除器件标志位
    deletePartSign(position, point, range) {
        for (let i = position[0] - range[1]; i <= position[0] + range[3]; i++) {
            for (let j = position[1] - range[0]; j <= position[1] + range[2]; j++) {
                this.deleteSingleValueBySmalle([i, j]);
            }
        }
        for (let i = 0; i < point.length; i++) {
            this.deleteSingleValueBySmalle([position[0] + point[i][0] / 20, position[1] + point[i][1] / 20]);
        }
    },
    //给导线设置或者删除标志位
    makeLineSign(id, way) {
        //设定导线相邻两点的属性
        function setLineNode(map, nodelast, nodenow, id) {
            let tempStatus = map.getSingleValueBySmalle(nodenow);
            if (!tempStatus) {
                map.setSingleValueBySmalle(nodenow, {
                    form: "line",
                    id: id,
                    connect: []
                });
            } else if (tempStatus.form !== "cross-point" && tempStatus.form !== "part-point") {
                map.setSingleValueBySmalle(nodenow, {
                    id: id
                });
            }
            if (nodelast[0]) {
                map.pushConnectPointBySmalle(nodenow, nodelast);
                map.pushConnectPointBySmalle(nodelast, nodenow);
            }
        }

        let last = [], tempx = 0, tempy = 0;
        for (let i = 0; i < way.length - 1; i++) {
            let Constant = 0, Vector = 0, nodestart = 0, nodeend = 0, sub = 0;
            if (way[i][0] !== way[i + 1][0]) sub = 1;
            Constant = way[i][sub];
            nodestart = way[i][1 - sub];
            nodeend = way[i + 1][1 - sub];
            Vector = (nodeend - nodestart) / Math.abs(nodeend - nodestart) * 20;
            for (let j = nodestart; j !== nodeend; j += Vector) {
                tempx = ((1 - sub) * Constant + sub * j) / 20;
                tempy = (sub * Constant + (1 - sub) * j) / 20;
                setLineNode(this, last, [tempx, tempy], id);
                last = [tempx, tempy];
            }
        }
        last = [tempx, tempy];
        tempx = (way[way.length - 1][0]) / 20;
        tempy = (way[way.length - 1][1]) / 20;
        if (!this.getSingleValueBySmalle([tempx, tempy])) {
            setLineNode(this, last, [tempx, tempy], id);
            this[tempx][tempy].form = "line-point";
        } else {
            setLineNode(this, last, [tempx, tempy], id);
        }

        //假如起点和终点是交错节点，那么就要加入当前导线的id
        [way[0], way[way.length - 1]].forEach((n) => {
            const tempStatus = this.getSingleValueByOrigin(n);
            if (tempStatus && tempStatus.form === "cross-point" && tempStatus.id.search(id) === -1) {
                if (!tempStatus.id) {   //当前ID为空，那么直接赋值
                    tempStatus.id = id;
                } else {                //当前ID不为空，那么向原ID后面追加当前ID
                    tempStatus.id += " " + id;
                }
            }
        });
    },
    //删除导线标志位
    deleteLineSign(id, way) {
        const map = this;
        
        //设定导线相邻两点的属性
        function deleteLineNode(nodelast,nodenow) {
            function deleteConnect(status, connect) {
                if (!status) return (false);
                for (let i = 0; i < status.length; i++) {
                    if ((status[i][0] === connect[0]) && (status[i][1] === connect[1])) {
                        status.splice(i, 1);
                        return (true);
                    }
                }
                return (false);
            }
            if (nodelast[0]) {
                const lastStatus = map.getSingleValueBySmalle(nodelast);
                if (lastStatus && lastStatus.connect.length === 1) {
                    if (lastStatus.form !== "part-point") {
                        delete map[nodelast[0]][nodelast[1]];
                    } else map.setSingleValueBySmalle(nodelast, {connect: []});
                    if (Object.isEmpty(map[nodelast[0]])) delete map[nodelast[0]];
                } else if (lastStatus && lastStatus.connect.length > 1) {
                    deleteConnect(lastStatus.connect, nodenow);
                }
                const nowStatus = map.getSingleValueBySmalle(nodenow);
                if (nowStatus)
                    deleteConnect(nowStatus.connect, nodelast);
            }
        }

        let temp_last = [], tempx = 0, tempy = 0;
        for (let i = 0; i < way.length - 1; i++) {
            let Constant = 0, Vector = 0, nodestart = 0, nodeend = 0, sub = 0;
            if (way[i][0] !== way[i + 1][0]) sub = 1;
            Constant = way[i][sub];
            nodestart = way[i][1 - sub];
            nodeend = way[i + 1][1 - sub];
            Vector = (nodeend - nodestart) / Math.abs(nodeend - nodestart) * 20;
            for (let j = nodestart; j !== nodeend; j += Vector) {
                tempx = ((1 - sub) * Constant + sub * j) / 20;
                tempy = (sub * Constant + (1 - sub) * j) / 20;
                deleteLineNode(temp_last, [tempx, tempy]);
                temp_last = [tempx, tempy];
            }
        }
        tempx = (way[way.length - 1][0]) / 20;
        tempy = (way[way.length - 1][1]) / 20;
        deleteLineNode(temp_last, [tempx, tempy]);
        if (map.getSingleValueBySmalle([tempx, tempy]).form === "line-point") {
            delete map[tempx][tempy];
            if (Object.isEmpty(map[tempx])) delete map[tempx];
        }

        //假如起点和终点是交错节点，那么就要从交错节点id中删去当前导线id
        const tempId = id;
        [way[0], way[way.length - 1]].forEach(function(n) {
            const tempStatus = map.getSingleValueByOrigin(n);
            if (tempStatus && tempStatus.form === "cross-point") {
                tempStatus.id = tempStatus.id.split(" ").filter((n) => n !== tempId).join(" ");
            }
        });
    },
    //以node为中心，寻找最近的可行点，callback为判断标准函数，由外部输入
    nodeRound(node, mouse, callback) {
        const ans = [];
        let m = 0;
        while (!ans.length) {
            for (let k = 0; k <= m; k++) {
                for (let i = node[0] - m * 20; i <= node[0] + m * 20; i += 20) {
                    for (let j = node[1] - m * 20; j <= node[1] + m * 20; j += 20) {
                        if (Math.abs(i - node[0]) + Math.abs(j - node[1]) === (k + m) * 20) {
                            if (!callback([i, j], this)) {
                                ans.push([i, j]);
                            }
                        }
                    }
                    if (ans.length) break;
                }
            }
            m++;
        }
        const tempvector = [mouse[0] - node[0], mouse[1] - node[1]];
        const vectors = ans.map((item) => [item[0] - node[0], item[1] - node[1]]);
        return (ans[Math.vectorSimilar(tempvector, vectors)]);
    },
    //判断当前点是不是导线
    isLine(node, flag = "origin") {
        const tempStatus = (flag === "origin") ?
            this.getSingleValueByOrigin(node) :
            this.getSingleValueBySmalle(node);

        return (
            tempStatus &&
            tempStatus.form === "line" ||
            tempStatus.form === "cross-node"
        );
    },
    //当前点是器件
    isPart(node, flag = "origin") {
        const tempStatus = (flag === "origin") ?
            this.getSingleValueByOrigin(node) :
            this.getSingleValueBySmalle(node);

        return (
            tempStatus &&
            tempStatus.form === "part" ||
            tempStatus.form === "part-point"
        );
    },
    //当前点是器件但不是管脚
    isPartNotPoint(node, flag = "origin") {
        const tempStatus = (flag === "origin") ?
            this.getSingleValueByOrigin(node) :
            this.getSingleValueBySmalle(node);

        return (
            tempStatus &&
            tempStatus.form === "part"
        );
    },
    //在[start、end]范围中沿着vector直行，求最后一点的坐标
    alongTheLineBySmall(start, end, vector) {
        //start点必须在某个导线上，此函数将会沿着vector的方向，返回在导线上的最后一点
        if (vector[0]) vector[0] /= Math.abs(vector[0]);
        else vector[1] /= Math.abs(vector[1]);
        let node = [start[0], start[1]], endFlag = true;
        let nodeStatus = this.getSingleValueBySmalle(node);
        //当前点没有到达终点，还在导线所在直线内部，那就前进
        while (nodeStatus && (node[0] !== end[0] || node[1] !== end[1]) &&
        (nodeStatus.form === "line" || nodeStatus.form === "cross-point") && endFlag) {
            let nodeNow = [node[0] + vector[0], node[1] + vector[1]];
            endFlag = this.nodeInConnectBySmall(node, nodeNow);
            node = nodeNow;
            nodeStatus = this.getSingleValueBySmalle(node);
        }
        if (node[0] === start[0] && node[1] === start[1]) {
            return (node);
        } else if (!nodeStatus || (nodeStatus.form !== "line" && nodeStatus.form !== "cross-point")) {
            return ([node[0] - vector[0], node[1] - vector[1]]);
        }
        return (node);
    },
    //由节点得到当前线段
    getLineBySmall(node) {
        const limit = [],
            ans = [],
            around = [
                [0, 1],
                [0,-1],
                [1 ,0],
                [-1,0]
            ];
        for(let i = 0; i < 4; i++) {
            limit[i] = this.alongTheLineBySmall(node, [3000, 3000], around[i]);
        }
        for(let i = 0; i < 2; i++) {
            if(!limit[i * 2].isEqual(limit[i * 2 + 1])) {
                ans.push([limit[i * 2], limit[i * 2 + 1]]);
            }
        }
        return(ans);
    },
};

//全局图纸标志位
const schMap = new MapHash();

export { MapHash, schMap };