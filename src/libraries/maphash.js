// 私有图纸数据
const map = {};

// 图纸对外暴露的方法
const schMap = {
    // 取得节点属性
    getValueBySmalle(node) {
        if (!map[node[0]] || !map[node[0]][node[1]]) {
            return (false);
        }
        return (map[node[0]][node[1]]);
    },
    getValueByOrigin(node) {
        return (schMap.getValueBySmalle([node[0] / 20, node[1] / 20]));
    },
    // 设定节点属性，默认为覆盖模式
    setValueBySmalle(node, attribute = {}, flag = false) {
        const i = node[0], j = node[1];

        if (!map[i]) {
            map[i] = [];
        }
        if (flag) {
            // 删除原来的属性
            map[i][j] = {};
        } else if (!map[i][j]) {
            // 覆盖模式下只有当节点为空的之后才会重新创建
            map[i][j] = {};
        }

        Object.assign(map[i][j], attribute);
    },
    setValueByOrigin(node, attribute, flag = false) {
        schMap.setValueBySmalle([node[0] / 20, node[1] / 20], attribute, flag);
    },
    // 删除节点
    deleteValueBySmalle(node) {
        const status = schMap.getValueBySmalle(node);
        if (status && status.connect) {
            // 删除与当前点相连的点的连接信息
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
    deleteValueByOrigin(node) {
        return (schMap.deleteValueBySmalle([node[0] / 20, node[1] / 20]));
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
    pushConnectByOrigin(a, b) {
        const node = [a[0] / 20, a[1] / 20],
            connect = [b[0] / 20, b[1] / 20];

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
    deleteConnectByOrigin(a, b) {
        const node = [a[0] / 20, a[1] / 20],
            connect = [b[0] / 20, b[1] / 20];

        return schMap.deleteConnectBySmalle(node, connect);
    },
};

export { schMap };
