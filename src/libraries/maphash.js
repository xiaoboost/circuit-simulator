// 图纸数据
const map = window.__map__ = {};

// 图纸对外暴露的方法
const schMap = {
    // 取得节点属性
    getValueBySmalle(x, y) {
        if (x.length) { [x, y] = x; }

        if (!map[x] || !map[x][y]) {
            return (false);
        }
        return (map[x][y]);
    },
    getValueByOrigin(x, y) {
        if (x.length) { [x, y] = x; }

        return (schMap.getValueBySmalle(x / 20, y / 20));
    },
    // 设定节点属性，默认为覆盖模式
    setValueBySmalle(node, attribute, flag = false) {
        const [x, y] = node;

        if (!map[x]) {
            map[x] = [];
        }
        if (flag) {
            // 删除原来的属性
            map[x][y] = {};
        } else if (!map[x][y]) {
            // 覆盖模式下只有当节点为空的之后才会重新创建
            map[x][y] = {};
        }

        Object.assign(map[x][y], attribute);
    },
    setValueByOrigin(node, attribute, flag = false) {
        schMap.setValueBySmalle([node[0] / 20, node[1] / 20], attribute, flag);
    },
    // 删除节点
    deleteValueBySmalle(x, y) {
        if (x.length) { [x, y] = x; }

        const status = schMap.getValueBySmalle(x, y);
        if (status && status.connect) {
            // 删除与当前点相连的点的连接信息
            for (let i = 0; i < status.connect.length; i++) {
                schMap.deleteConnectBySmalle(status.connect[i], x);
            }
        }
        if (status) {
            delete map[x][y];
        }
        if (Object.isEmpty(map[x])) {
            delete map[x];
        }
    },
    deleteValueByOrigin(x, y) {
        if (x.length) { [x, y] = x; }

        return (schMap.deleteValueBySmalle(x / 20, y / 20));
    },
    // 添加连接关系，如果重复那么就忽略
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
    pushConnectByOrigin(node, connect) {
        node = [node[0] / 20, node[1] / 20];
        connect = [connect[0] / 20, connect[1] / 20];

        return schMap.pushConnectBySmalle(node, connect);
    },
    // 删除连接关系，如果没有那么忽略
    deleteConnectBySmalle(node, connect) {
        const status = schMap.getValueBySmalle(node);

        if (!status || !status.connect) {
            return (false);
        }

        for (let i = 0; i < status.connect.length; i++) {
            if (status.connect[i].isEqual(connect)) {
                status.connect.splice(i, 1);
                break;
            }
        }
        return (true);
    },
    deleteConnectByOrigin(node, connect) {
        node = [node[0] / 20, node[1] / 20];
        connect = [connect[0] / 20, connect[1] / 20];

        return schMap.deleteConnectBySmalle(node, connect);
    },
};

export { schMap };
