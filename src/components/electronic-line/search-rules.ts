import * as Map from 'src/lib/map';
import Point from 'src/lib/point';
import { NodeData } from './node-search';
import { SearchStatus } from './line-search';

/**
 * 下列计算中使用的点坐标均为已缩放的值
 */

// 工具函数
// 返回 node 所在器件
function getPart(node: Point): string {
    const status = Map.getPoint(node);

    if (status && status.type === Map.NodeType.Part) {
        return status.id;
    }
    else if (status && status.type === Map.NodeType.PartPoint) {
        return status.id.split('-')[0];
    }
    else {
        return '';
    }
}
// 返回 node 所在线段
function getSegment(node: Point) {
    if (!Map.isLine(node)) {
        return [];
    }

    const ans = [];
    for (let i = 0; i < 2; i++) {
        const directors = [[1, 0], [-1, 0], [0, -1], [0, 1]];
        const limit = [
            Map.alongTheLine(node, undefined, directors[i * 2]),
            Map.alongTheLine(node, undefined, directors[i * 2 + 1]),
        ];

        if (!limit[0].isEqual(limit[1])) {
            ans.push(limit);
        }
    }
    return ans;
}
// node 是否在某线段内
function isNodeInLine(node: Point, line: Point[]) {
    return node.isInLine(line);
}
// 距离表征（非真实距离）
function nodesDistance(a: Point, b: Point) {
    return (
        Math.abs(a[0] - b[0]) +
        Math.abs(a[1] - b[1])
    );
}
// node 所在线段是否和当前节点方向垂直
function isNodeVerticalLine(node: NodeData) {
    const status = Map.getPoint(node.position);

    if (!status || !status.connect) {
        return false;
    }

    return status.connect.every(
        (connect) =>
            connect.add(node.position, -1).isVertical(node.direction),
    );
}

// 价值估算
// node 到终点距离 + 拐弯数量
function calToPoint(this: Rules, node: NodeData) {
    return (nodesDistance(this.end, node.position) + node.junction);
}

// 终点判定
// 等于终点
function isEndPoint(this: Rules, node: NodeData) {
    return this.end.isEqual(node.position);
}
// 在终点等效线段中
function isInEndLines(this: Rules, node: NodeData) {
    return this.endLines.find((line) => isNodeInLine(node.position, line));
}
// 绘制导线时，终点在导线中
function checkNodeInLineWhenDraw(this: Rules, node: NodeData) {
    // 优先判断是否等于终点
    if (node.position.isEqual(this.end)) {
        return (true);
    }

    // 是否在终点等效线段中
    const exLine = isInEndLines.call(this, node) as ReturnType<typeof isInEndLines>;

    // 不在等效终线中
    if (!exLine) {
        return false;
    }
    // 当前路径是直线
    if (!node.junction) {
        return true;
    }

    // 等效线段和当前节点方向平行
    if (exLine[1].add(exLine[0], -1).isParallel(node.direction)) {
        return true;
    }
    // 等效线段和当前节点方向垂直
    else {
        const junction = node.cornerParent.direction;
        const node2End = this.end.add(node.position, -1);

        return (node2End.isOppoDirection(junction));
    }
}

// 扩展判定
// 通用状态
function isLegalPointGeneral(this: Rules, node: NodeData, pointLimit = 2): boolean {
    const status = Map.getPoint(node.position);

    // 空节点
    if (!status) {
        return true;
    }
    // 器件节点
    else if (status.type === Map.NodeType.Part) {
        return this.excludeParts.includes(status.id);
    }
    // 器件节点
    else if (status.type === Map.NodeType.PartPoint) {
        // 距离等于 1 的范围内都可以
        const [part] = status.id.split('-');
        return (
            this.excludeParts.includes(part) ||
            nodesDistance(node.position, this.end) < pointLimit
        );
    }
    // 导线结点
    else if (status.type === Map.NodeType.LinePoint) {
        // 排除、或者距离在 1 以内
        return (
            this.excludeLines.some((line) => isNodeInLine(node.position, line)) ||
            nodesDistance(node.position, this.end) < pointLimit
        );
    }
    // 导线
    else if (Map.isLine(node.position)) {
        // 当前节点方向必须和所在导线方向垂直
        return (isNodeVerticalLine(node));
    }
    else {
        return (true);
    }
}
// 强制对齐
function isLegalPointAlign(this: Rules, node: NodeData) {
    return isLegalPointGeneral.call(this, node, 1) as boolean;
}

/**
 * 根据状态生成具体的规则集合
 * @class Rules
 */
export class Rules {
    start: Point;
    end: Point;
    status: SearchStatus;

    /** 排除器件 */
    excludeParts: string[] = [];
    /** 排除线段 */
    excludeLines: Point[][] = [];
    /** 终点等效线段 */
    endLines: Point[][] = [];

    calValue!: (node: NodeData) => number;
    checkPoint!: (node: NodeData) => boolean;
    isEnd!: (node: NodeData) => boolean;

    /**
     * 创建规则集合的实例
     *  - 起点和终点都是未缩放的值
     * @param {Point} start - 起点
     * @param {Point} end - 终点
     * @param {string} status 当前状态
     */
    constructor(start: Point, end: Point, status: SearchStatus) {
        this.start = start.mul(0.05);
        this.end = end.mul(0.05);
        this.status = status;

        // // 指定规则
        // if (status === DrawSearch.Status.Modification) {
        //     this.excludeParts.push(getPart(this.end));
        //     this.excludeLines.push(...getSegment(this.end));

        //     this.checkPoint = isLegalPointAlign;
        //     this.isEnd = isEndPoint;
        //     this.calValue = calToPoint;
        // }
        // else

        // 绘制模式
        if (status < 20) {
            // 节点估值
            this.calValue = calToPoint;

            // 绘制情况下，end 只可能是点，根据终点属性来分类
            const endData = Map.getPoint(this.end);

            // 终点在导线上
            if (Map.isLine(this.end)) {
                this.endLines.push(...getSegment(this.end));
                this.isEnd = checkNodeInLineWhenDraw;
                this.checkPoint = isLegalPointAlign;
            }
            // 终点是器件引脚
            else if (endData && endData.type === Map.NodeType.PartPoint) {
                this.isEnd = isEndPoint;
                this.checkPoint = isLegalPointAlign;
            }
            // 终点在器件上
            else if (endData && endData.type === Map.NodeType.Part) {
                this.excludeParts.push(getPart(this.end));
                this.isEnd = isEndPoint;
                this.checkPoint = isLegalPointGeneral;
            }
            else {
                // 一般状态
                this.isEnd = isEndPoint;
                this.checkPoint = isLegalPointGeneral;
            }
        }
    }
}
