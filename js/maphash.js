//图纸记录对象
const map = {},
    schMap = {};

schMap.extend({
    //以小坐标取得节点属性
    getValueBySmalle(node) {
        if (!map[node[0]] || !map[node[0]][node[1]]) {
            return (false);
        }
        return (map[node[0]][node[1]]);
    },
    //以原坐标取得节点属性
    getValueByOrigin(node) {
        return (schMap.getValueBySmalle([node[0] / 20, node[1] / 20]));
    },
    //以小坐标强制设定节点属性，默认为覆盖模式
    setValueBySmalle(node, attribute, flag = false) {
        const i = node[0], j = node[1];
        
        if (!map[i]) {
            map[i] = [];
        }
        if (flag) {
            //删除原来的属性
            map[i][j] = {};
        } else if (!map[i][j]) {
            //覆盖模式下只有当节点为空的之后才会重新创建
            map[i][j] = {};
        }

        map[i][j].extend(attribute);
    },
    //以原坐标强制设定节点属性，节点已经有的被新的覆盖，旧的不删除
    setValueByOrigin(node, attribute, flag = false) {
        schMap.setValueBySmalle([node[0] / 20, node[1] / 20], attribute, flag);
    },
    //以小坐标删除节点
    deleteValueBySmalle(node) {
        const status = schMap.getValueBySmalle(node);
        if (status && status.connect) {
            //删除与当前点相连的点的连接信息
            for (let i = 0; i < status.connect.length; i++) {
                schMap.deleteConnectBySmalle(status.connect[i], node);
            }
        }
        if (status) {
            delete map[node[0]][node[1]];
        }
        if (Object.isEmpty(map[node[0]])) {
            delete map[node[0]];
        }
    },
    //以原坐标删除节点
    deleteValueByOrigin(node) {
        return (schMap.deleteValueBySmalle([node[0] / 20, node[1] / 20]));
    },
    //添加连接关系，如果重复那么就忽略
    pushConnectBySmalle(node, connect) {
        let status = schMap.getValueBySmalle(node);

        if (!status) {
            return (false);
        }
        if (!status.connect) {
            status.connect = [];
        }
        status = status.connect;
        for (let i = 0; i < status.length; i++) {
            if (status[i].isEqual(connect)) {
                return (false);
            }
        }
        status.push(connect);
        return (true);
    },
    pushConnectByOrigin(a, b) {
        const node = [a[0] / 20, a[1] / 20],
            connect = [b[0] / 20, b[1] / 20];

        return schMap.pushConnectBySmalle(node, connect);
    },
    //删除连接关系，如果没有那么忽略
    deleteConnectBySmalle(node, connect) {
        const status = schMap.getValueBySmalle(node);

        if (!status || !status.connect) {
            return (false);
        }

        for (let i = 0; i < status.connect.length; i++) {
            if(status.connect[i].isEqual(connect)) {
                status.connect.splice(i, 1);
                break;
            }
        }
        return (true);
    },
    deleteConnectByOrigin(a, b) {
        const node = [a[0] / 20, a[1] / 20],
            connect = [b[0] / 20, b[1] / 20];

        return schMap.deleteConnectBySmalle(node, connect);
    },
    //node和connect是否在同一个导线上
    nodeInConnectBySmall(node, connect) {
        const nodelastStatus = schMap.getValueBySmalle(node);
        if (nodelastStatus && (nodelastStatus.form === "line" || nodelastStatus.form === "cross-point")) {
            for (let i = 0; i < nodelastStatus.connect.length; i++) {
                if (nodelastStatus.connect[i].isEqual(connect)) {
                    return (true);
                }
            }
        }
        return (false);
    },
    nodeInConnectByOrigin(a, b) {
        const node = [a[0] / 20, a[1] / 20],
            connect = [b[0] / 20, b[1] / 20];

        return schMap.nodeInConnectBySmall(node, connect);
    },
    //当前点是否是导线
    isLine(node, flag = "origin") {
        const tempStatus = (flag === "origin")
            ? schMap.getValueByOrigin(node)
            : schMap.getValueBySmalle(node);

        return (
            tempStatus &&
            tempStatus.form === "line" ||
            tempStatus.form === "cross-point"
        );
    },
    //在[start、end]范围中沿着vector直行，求最后一点的坐标
    alongTheLineBySmall(start, end, vector) {
        //非法坐标为无限大
        end = end ? end : [3000, 3000];
        //没有方向，则方向为起点到终点
        vector = vector
            ? vector
            : [end[0] - start[0], end[1] - start[1]];

        //单位向量
        vector[0] = vector[0].toUnit();
        vector[1] = vector[1].toUnit();

        //起点并不是导线，直接返回
        if (!schMap.isLine(start, "small")) {
            return (start);
        }

        let node = [start[0], start[1]];
        //当前点没有到达终点，还在导线所在直线内部，那就前进
        while (schMap.isLine(node, "small") && !node.isEqual(end)) {
            const nodeNow = [node[0] + vector[0], node[1] + vector[1]];
            if (schMap.nodeInConnectBySmall(node, nodeNow)) {
                node = nodeNow;
            }
            else {
                node = nodeNow;
                break;
            }
        }

        return node.isEqual(end)
            ? node
            : [node[0] - vector[0], node[1] - vector[1]];
    },
    alongTheLineByOrigin(a, b, c) {
        const start = [a[0] / 20, a[1] / 20],
            end = [b[0] / 20, b[1] / 20],
            ans = schMap.alongTheLineBySmall(start, end, c);

        return([ans[0] * 20, ans[1] * 20]);
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
                            if (!callback([i, j])) {
                                ans.push([i, j]);
                            }
                        }
                    }
                    if (ans.length) break;
                }
            }
            m++;
        }

        const vectors = ans.map((item) => [item[0] - node[0], item[1] - node[1]]);
        return (ans[node.add(-1, mouse).similar(vectors).sub]);
    },
    //返回已经记录的全部节点
    toSmallNodes() {
        const ans = [];
        for (let i in map) {
            if(map.hasOwnProperty(i)) {
                for (let j in map[i]) {
                    if (map[i].hasOwnProperty(j)) {
                        ans.push([i, j]);
                    }
                }
            }
        }
        return(ans);
    },
    //返回交错节点到指定导线的方向
    cross2line(node, line) {
        const status = schMap.getValueByOrigin(node);
        if(!status || status.form !== "cross-point") {
            return(false);
        }
        for(let i = 0; i < status.connect.length; i++) {
            const con = status.connect[i],
                temp = schMap.getValueBySmalle(con);

            if(temp.id.indexOf(line) !== -1) {
                return([
                    node[0] - con[0] * 20,
                    node[1] - con[1] * 20
                ]);
            }
        }
        return(false);
    }
});

export { schMap };