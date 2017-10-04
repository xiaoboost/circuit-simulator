import { $P } from './point';

// 图纸数据
const map = {};

function point2key(x, y) {
    if (x.length) { [x, y] = x; }
    return `${x},${y}`;
}

function key2point(key) {
    const [x, y] = key.split(',').map((o) => +o.trim());
    return $P(x, y);
}

export function outputAll() {
    return Object.keys(map).map((key) => Object.assign(Object.clone(map[key]), { point: key2point(key) }));
}

// 取得节点属性
export function getValueBySmalle(x, y) {
    const key = point2key(x, y);
    return (map[key] || false);
}

export function getValueByOrigin(x, y) {
    if (x.length) { [x, y] = x; }

    return (getValueBySmalle(x / 20, y / 20));
}
// 设定节点属性，默认为覆盖模式
export function setValueBySmalle(node, attribute, cover = false) {
    const key = point2key(node);

    if (cover || !map[key]) {
        map[key] = {};
    }

    Object.assign(map[key], attribute);
}
export function setValueByOrigin(node, attribute, cover = false) {
    setValueBySmalle([node[0] / 20, node[1] / 20], attribute, cover);
}
// 删除节点
export function deleteValueBySmalle(x, y) {
    const status = getValueBySmalle(x, y);
    if (status && status.connect) {
        // 删除与当前点相连的点的连接信息
        for (let i = 0; i < status.connect.length; i++) {
            deleteConnectBySmalle(status.connect[i], [x, y]);
        }
    }
    if (status) {
        delete map[point2key(x, y)];
        return true;
    }
}
export function deleteValueByOrigin(x, y) {
    if (x.length) { [x, y] = x; }

    return (deleteValueBySmalle(x / 20, y / 20));
}
// 添加连接关系，如果重复那么就忽略
export function pushConnectBySmalle(node, connect) {
    let status = getValueBySmalle(node);

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
}
export function pushConnectByOrigin(node, connect) {
    node = [node[0] / 20, node[1] / 20];
    connect = [connect[0] / 20, connect[1] / 20];

    return pushConnectBySmalle(node, connect);
}
// 删除连接关系，如果没有那么忽略
export function deleteConnectBySmalle(node, connect) {
    const status = getValueBySmalle(node);

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
}
// node 和 connect 是否相连
export function isNodeInConnectBySmall(node, connect) {
    const status = getValueBySmalle(node);

    return (
        status &&
        /(line|point)/.test(status.type) &&
        status.connect.some((point) => point.isEqual(connect))
    );
}
export function isNodeInConnectByOrigin(a, b) {
    const node = [a[0] / 20, a[1] / 20],
        connect = [b[0] / 20, b[1] / 20];

    return isNodeInConnectBySmall(node, connect);
}
export function deleteConnectByOrigin(node, connect) {
    node = [node[0] / 20, node[1] / 20];
    connect = [connect[0] / 20, connect[1] / 20];

    return deleteConnectBySmalle(node, connect);
}
export function isLineBySmall(x, y) {
    if (x.length) { [x, y] = x; }

    const status = getValueBySmalle(x, y);

    return (
        status &&
        /^(line|cross-point|cover-point)$/.test(status.type)
    );
}
export function isLineByOrigin(x, y) {
    if (x.length) { [x, y] = x; }

    return isLineBySmall([x[0] * 0.05, y[1] * 0.05]);
}
// 在 [start、end] 范围中沿着 vector 直行，求最后一点的坐标
export function alongTheLineBySmall(
    start,
    end = [Infinity, Infinity],
    vector = [end[0] - start[0], end[1] - start[1]]
) {
    // 单位向量
    vector = vector.map((n) => Math.sign(n));

    // 起点并不是导线或者起点等于终点，直接返回
    if (!isLineBySmall(start) || start.isEqual(end)) {
        return (start);
    }

    let node = [start[0], start[1]],
        next = [node[0] + vector[0], node[1] + vector[1]];
    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (isLineBySmall(next) && !node.isEqual(end)) {
        if (isNodeInConnectBySmall(node, next)) {
            node = next;
            next = [node[0] + vector[0], node[1] + vector[1]];
        } else {
            break;
        }
    }

    return node;
}
export function alongTheLineByOrigin(a, b, c) {
    const start = [a[0] / 20, a[1] / 20],
        end = [b[0] / 20, b[1] / 20],
        ans = alongTheLineBySmall(start, end, c);

    return ([ans[0] * 20, ans[1] * 20]);
}
