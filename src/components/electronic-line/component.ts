import { Component, Vue } from 'vue-property-decorator';

import {
    LineWay,
    WayMap,
    LineWayCall,
} from './line-way';

import ElectronicCore, {
    findLineComponent,
    findPartComponent,
} from 'src/components/electronic-part/common';

import Point from 'src/lib/point';
import * as Map from 'src/lib/map';
import * as Search from './line-search';

import { $debugger } from 'src/lib/debugger';
import { DrawEvent } from '../drawing-main/event-controller';
import { MutationName as Mutation } from 'src/vuex';
import { default as ElectronicPoint, PointClassName } from '../electronic-point/component';

import {
    mergeMark,
    deleteMark,
    isUndef,
    isBoolean,
    copyProperties,
} from 'src/lib/utils';

type dispatchKey = 'id' | 'type' | 'way' | 'hash' | 'connect';
const disptchKeys: dispatchKey[] = ['id', 'type', 'way', 'hash', 'connect'];

const matchLine = /(line_\d+ ?)+/;
const matchPart = /[a-zA-Z]+_[a-zA-Z0-9]+-\d+/;

export type LineData = Pick<LineComponent, dispatchKey>;

export interface LinePointAttr {
    size: number;
    position: Point;
    class: {
        [key in PointClassName]?: boolean;
    };
}

@Component({
    components: {
        ElectronicPoint,
    },
})
export default class LineComponent extends ElectronicCore {
    /** 导线类型 */
    readonly type!: -1;

    /** 导线路径 */
    way: Point[] = [];
    /** 导线的连接表 */
    connect = ['', ''];
    /** 引脚大小 */
    pointSize = [-1, -1];
    /** 当前导线是否已经标记 */
    isMark = false;

    /** 导线的两个节点属性 */
    get points(): LinePointAttr[] {
        return Array(2).fill(false).map((_, i) => ({
            size: this.pointSize[i],
            position: this.way.get(-i)
                ? Point.from(this.way.get(-i))
                : new Point(0, 0),
            class: {
                'line-point-open': !this.connect[i],
                'line-point-part': matchPart.test(this.connect[i]),
                'line-point-cross': matchLine.test(this.connect[i]),
            },
        }));
    }
    /** 路径转为 path 字符串 */
    get way2path() {
        return this.way.length === 0 ? ''　: `M${this.way.map((n) => n.join(',')).join('L')}`;
    }
    /** 路径转为 rect 坐标 */
    get pathRects() {
        const ans = [], wide = 14;

        for (let i = 0; i < this.way.length - 1; i++) {
            const start = this.way[i], end = this.way[i + 1];
            const left = Math.min(start[0], end[0]);
            const top = Math.min(start[1], end[1]);
            const right = Math.max(start[0], end[0]);
            const bottom = Math.max(start[1], end[1]);

            ans.push({
                x: left - wide / 2,
                y: top - wide / 2,
                height: (left === right) ? bottom - top + wide　: wide,
                width: (left === right) ? wide : right - left + wide,
            });
        }

        return ans;
    }

    /** 销毁导线 */
    beforeDestroy() {
        /**
         * 有时候会存在临时导线
         * 此时销毁导线应该跳过
         */
        if (!this.$store) {
            return;
        }

        this.freeConnect();
        this.deleteSign();
    }
    /** 将当前导线移动到绘图区的底层 */
    toBottom() {
        this.$store.commit(Mutation.LINE_TO_BOTTOM, this.id);
    }

    /** 在图纸标记当前器件 */
    markSign() {
        // 已经标记，则退出
        if (this.isMark) {
            return;
        }

        this.isMark = true;

        let last!: Point;

        for (const point of LineWayCall(this.way, 'eachPoint')) {
            // 当前点状态
            const status = Map.getPoint(point, true);

            // 为空
            if (!status) {
                const data: Map.NodeInputData = {
                    point,
                    id: this.id,
                    type: this.findConnectIndex(point) >= 0
                        ? Map.NodeType.LinePoint
                        : Map.NodeType.Line,
                };

                Map.setPoint(data, true);
            }
            // 导线点
            else if (status.type < 20) {
                // 当前节点是否是导线路径的端点
                const isLineEndpoint = this.findConnectIndex(point) >= 0;

                status.id = mergeMark(status.id, this.id);
                status.type = status.id.includes(' ')
                    // 节点有多个导线
                    ? isLineEndpoint
                        ? Map.NodeType.LineCrossPoint
                        : Map.NodeType.LineCoverPoint
                    // 节点只有单个导线
                    : isLineEndpoint
                        ? Map.NodeType.LinePoint
                        : Map.NodeType.Line;

                Map.mergePoint(status);
            }
            // 器件引脚不处理，其他类型全部抛出错误
            else if (status.type !== Map.NodeType.PartPoint) {
                const info = `the type of line point(${point.join(',')}) is illegal.`;

                if (process.env.NODE_ENV === 'development') {
                    $debugger.point(point, 'red');
                    throw new Error(info);
                }
                else {
                    console.error(info);
                    return;
                }
            }

            if (last) {
                Map.addConnect(point, last, true);
                Map.addConnect(last, point, true);
            }

            last = point;
        }
    }
    /** 删除当前器件在图纸中的标记 */
    deleteSign() {
        this.isMark = false;

        let last!: Point;

        for (const point of LineWayCall(this.way, 'eachPoint')) {
            const status = Map.getPoint(point, true);

            if (last) {
                Map.deleteConnect(point, last, true);
                Map.hasPoint(last, true) && Map.deleteConnect(last, point, true);
            }

            if (!status) {
                continue;
            }

            // 普通点
            if (
                status.type === Map.NodeType.Line ||
                status.type === Map.NodeType.LinePoint
            ) {
                Map.deletePoint(point, true);
            }
            // 交错/覆盖节点
            else if (
                status.type === Map.NodeType.LineCoverPoint ||
                status.type === Map.NodeType.LineCrossPoint
            ) {
                status.id = deleteMark(status.id, this.id);

                if (status.id) {
                    Map.setPoint(status, true);
                }
                else {
                    Map.deletePoint(point, true);
                }
            }

            last = point;
        }
    }

    /** 单点绘制 */
    async drawing(index: 0 | 1) {
        // 保持绘制点为终点
        if (index === 0) {
            this.reverse();
        }

        // 删除当前导线的所有标记
        this.deleteSign();

        const wayMap = new WayMap();
        const handler = this.createDrawEvent();
        const mapData = Map.getPoint(this.way[0], true)!;
        const [id, mark] = mapData.id.split('-');
        const connectPart = findPartComponent(id);
        const startPoint = Point.from(this.way[0]);
        const direction = connectPart.points[mark].direction;
        const mouseOver: Search.DrawSearch.Option['mouseOver'] = {
            status: Search.DrawSearch.Mouse.Idle,
        };

        // 设置事件属性
        handler
            .setCursor('draw_line')
            .setStopEvent({ type: 'mouseup', which: 'left' });

        // 事件设置
        handler.setHandlerEvent([
            {
                type: 'mouseenter',
                capture: true,
                callback: (e: DrawEvent) => {
                    const className = e.target.getAttribute('class') || '';

                    // 器件的 mouseenter
                    if (/part-focus/.test(className)) {
                        Object.assign(mouseOver, {
                            status: Search.DrawSearch.Mouse.Part,
                            part: findPartComponent(e.target.parentElement!),
                        });
                    }
                    // 导线的 mouseenter
                    else if (
                        /line-rect|line-point/.test(className) &&
                        !this.$el.contains(e.target)
                    ) {
                        Object.assign(mouseOver, {
                            status: Search.DrawSearch.Mouse.Line,
                            line: findLineComponent(e.target.parentElement!),
                        });
                    }
                },
            },
            {
                type: 'mouseleave',
                capture: true,
                callback: (e: DrawEvent) => {
                    const className = e.target.getAttribute('class') || '';

                    if (
                        /part-focus|line-rect|line-point/.test(className) &&
                        !this.$el.contains(e.target)
                    ) {
                        mouseOver.status = Search.DrawSearch.Mouse.Idle;
                    }
                },
            },
            // 搜索事件
            (e: DrawEvent) => this.way = Search.drawSearch({
                start: startPoint,
                end: e.$position,
                mouseBais: e.$movement,
                pointSize: this.pointSize,
                wayMap, direction, mouseOver,
            }),
        ]);

        // 开始运行
        await handler.start();

        let finalEnd = this.way.get(-1).round();
        const status = Map.getPoint(finalEnd, true);
        const endNode = this.way.get(-1);

        // 起点和终点相等或者只有一个点，则删除当前导线
        if (this.way.length < 2 || finalEnd.isEqual(this.way[0])) {
            this.deleteSelf();
            return;
        }

        // 终点被占用
        if (status && status.type === Map.NodeType.Part) {
            finalEnd = (
                finalEnd
                    .around((node) => !Map.hasPoint(node), 20)
                    .reduce((pre, next) =>
                        endNode.distance(pre) < endNode.distance(next) ? pre : next,
                    )
            );
        }

        // 导线最终设置
        LineWayCall(this.way, 'endToPoint', finalEnd);

        // 更新数据
        this.dispatch();

        // 节点大小以及终点设置
        this.pointSize.$set(1, -1);
        this.setConnectByWay(1);

        // 标记导线
        this.markSign();

        // 染色
        const parts = this.connect.filter(Boolean).map((item) => item.replace(/-\d+/, ''));
        this.mapStatus.devicesNow = `${this.id} ${parts.join(' ')}`.split(' ');
    }

    /**
     * 将当前导线数据更新至`vuex`
     */
    dispatch() {
        this.$store.commit(
            Mutation.UPDATE_LINE,
            copyProperties(this, disptchKeys),
        );
    }
    /**
     * 导线反转
     */
    reverse() {
        this.way.reverse();
        this.connect.reverse();
    }
    /**
     * 是否存在连接
     * @param {string} id 待检验的连接
     * @returns {boolean}
     */
    hasConnect(id: string) {
        return this.connect.join(' ').includes(id);
    }
    /**
     * 判断输入坐标是当前导线的起点还是终点
     * @param {Point} node
     * @returns {(-1 | 0 | 1)}
     */
    findConnectIndex(node: Point) {
        if (node.isEqual(this.way[0])) {
            return (0);
        }
        else if (node.isEqual(this.way.get(-1))) {
            return (1);
        }
        else {
            return (-1);
        }
    }
    /**
     * 释放导线连接
     * @param {(0 | 1)} [index]
     */
    freeConnect(index?: 0 | 1) {
        if (index === undefined) {
            this.freeConnect(0);
            this.freeConnect(1);
            return;
        }

        const connect = this.connect[index];

        if (matchPart.test(connect)) {
            const part = findPartComponent(connect);
            const mark = +connect.split('-')[1];

            part.connect[mark] = '';
            part.dispatch();
        }
        else if (matchLine.test(connect)) {
            const lines = connect.split(' ').map(findLineComponent);

            if (lines.length === 2) {
                lines[0].concat(lines[1].id);
                lines[0].markSign();
            }
            else if (lines.length === 3) {
                lines.forEach((line) => line.deleteConnect(this.id));
            }
        }

        this.connect[index] = '';
        this.dispatch();
    }
    /**
     * 删除连接
     * @param {string} id 待删除的连接
     */
    deleteConnect(id: string) {
        const re = new RegExp(`${id} ?`, 'i');

        this.connect = this.connect.map((item) => item.replace(re, '').trim());
        this.dispatch();
    }
    /**
     * 将`this.connect`中的器件所连接的`this.id`替换成`newId`
     * @param {(0 | 1)} index 连接标号
     * @param {string} newId 替换的 id
     */
    replaceConnect(index: 0 | 1, newId: string) {
        const connect = this.connect[index];

        if (matchPart.test(connect)) {
            const part = findPartComponent(connect);
            const mark = +connect.split('-')[1];

            part.connect[mark] = newId;
            part.dispatch();
        }
        else if (matchLine.test(connect)) {
            connect
                .split(' ')
                .map(findLineComponent)
                .forEach((line) => {
                    line.connect[0] = line.connect[0].replace(this.id, newId);
                    line.connect[1] = line.connect[1].replace(this.id, newId);
                    line.dispatch();
                });

            const crossMapData = Map.getPoint(this.way.get(-1 * index), true)!;

            crossMapData.id = crossMapData.id.replace(this.id, newId);
            Map.setPoint(crossMapData, true);
        }
    }
    /**
     * 由路径信息设置导线两端连接
     * @param {boolean} [concat=false] 是否合并浮动导线
     */
    setConnectByWay(concat?: boolean): void;
    /**
     * 由路径信息设置导线端点连接
     * @param {(0 | 1)} [index] 需要设定的端点号
     * @param {boolean} [concat=false] 是否合并浮动导线
     */
    setConnectByWay(index?: 0 | 1, concat?: boolean): void;
    setConnectByWay(index?: 0 | 1 | boolean, concat = false) {
        if (isBoolean(index)) {
            this.setConnectByWay(0, index);
            this.setConnectByWay(1, index);
            return;
        }
        else if (isUndef(index)) {
            this.setConnectByWay(0);
            this.setConnectByWay(1);
            return;
        }

        const node = this.way.get(-1 * index).round();
        const status = Map.getPoint(node, true);

        // 端点为空
        if (!status) {
            this.connect[index] = '';
        }

        // 端点为器件引脚
        else if (status.type === Map.NodeType.PartPoint) {
            const [id, mark] = status.id.split('-');
            const part = findPartComponent(id);

            part.connect[mark] = this.id;
            this.connect[index] = status.id;

            part.dispatch();
            this.dispatch();
        }
        // 端点在导线上
        else if (status.type === Map.NodeType.Line) {
            if (this.hasConnect(status.id)) {
                /**
                 * 因为`setConnectByWay`函数运行之后可能还有后续动作
                 * 所以这里需要等待一个更新周期
                 */
                this.$nextTick().then(() => this.deleteSelf());
            }
            else {
                this.split(status.id, index);
            }
        }
        // 端点为导线空引脚
        else if (status.type === Map.NodeType.LinePoint) {
            // 允许合并
            if (concat) {
                this.concat(status.id);
            }
            // 不允许合并，则该点变更为交错节点
            else {
                const line = findLineComponent(status.id);
                const mark = line.findConnectIndex(node);

                status.type = Map.NodeType.LineCrossPoint;
                status.id = mergeMark(this.id, line.id);
                Map.mergePoint(status);

                line.connect[mark] = this.id;
                this.connect[index] = line.id;

                line.dispatch();
                this.dispatch();
            }
        }
        // 端点在交错节点
        else if (status.type === Map.NodeType.LineCrossPoint) {
            const lines = deleteMark(status.id, this.id);

            // 只有一个导线
            if (lines.length === 1 && concat) {
                this.concat(lines[0]);
            }
            else {
                this.connect[index] = lines;

                lines.split(' ').forEach((id) => {
                    const line = findLineComponent(id);
                    const mark = line.findConnectIndex(node);
                    const connect = deleteMark(lines, line.id);

                    if (mark !== -1) {
                        line.connect[mark] = mergeMark(connect, this.id);
                        line.dispatch();
                    }
                });

                status.id = mergeMark(status.id, this.id);
                Map.mergePoint(status);
            }
        }
    }
    /**
     * 合并导线
     * @param {string} id 待连接导线的 id
     */
    concat(id: string) {
        const line = findLineComponent(id);

        /** 交错节点 */
        let crossIndex: 0 | 1;

        // 连接导线的路径
        if (this.way[0].isEqual(line.way[0])) {
            line.reverse();
            crossIndex = 0;
        }
        else if (this.way[0].isEqual(line.way.get(-1))) {
            crossIndex = 0;
        }
        else if (this.way.get(-1).isEqual(line.way.get(-1))) {
            line.reverse();
            crossIndex = 1;
        }
        else {
            crossIndex = 1;
        }

        line.replaceConnect(crossIndex, this.id);
        this.connect[crossIndex] = line.connect[crossIndex];

        this.way = LineWay.prototype.checkWayRepeat.call(
            crossIndex === 0
                ? line.way.concat(this.way)
                : this.way.concat(line.way),
        );

        // 更新及删除
        this.dispatch();
        this.deleteSelf();
    }
    /**
     * 拆分导线
     * @param {string} id 被拆分导线的 id
     * @param {(0 | 1)} index 当前导线的起点/终点作为分割点
     */
    split(id: string, index: 0 | 1) {
        const splited = findLineComponent(id);
        const crossPoint = Point.from(this.way.get(-1 * index));

        // 验证拆分点是否在拆分路径上
        let crossSub = -1;
        for (let i = 0; i < splited.way.length - 1; i++) {
            if (crossPoint.isInLine([splited.way[i], splited.way[i + 1]])) {
                crossSub = i;
                break;
            }
        }

        if (crossSub < -1) {
            throw new Error('(line) split line failed.');
        }

        // 先删除被分割导线的所有标记
        splited.deleteSign();

        // 生成临时导线
        const Comp = Vue.extend(LineComponent);
        const devices = new Comp<LineComponent>();

        // devices 连接关系设定
        splited.replaceConnect(1, devices.id);                  // splited 原终点器件连接替换为 devices
        devices.connect[1] = splited.connect[1];                // 原导线起点不变，新导线的终点等于原导线的终点
        devices.connect[0] = `${splited.id} ${this.id}`;        // 新导线起点由旧导线 ID 和分割旧导线的导线 ID 组成

        // devices 路径为交错点至原 splited 终点
        devices.way = LineWay.from(splited.way.slice(crossSub + 1));
        devices.way.unshift(crossPoint);
        LineWay.prototype.checkWayRepeat.call(devices.way);

        // splited 的终点连接变更
        splited.connect[1] = `${devices.id} ${this.id}`;

        // splited 路径变更为起点至交错点部分
        splited.way = LineWay.from(splited.way.slice(0, crossSub + 1));
        splited.way.push(crossPoint);
        LineWay.prototype.checkWayRepeat.call(splited.way);

        // 当前导线端点连接为拆分而成的两个导线
        this.connect[index] = `${splited.id} ${devices.id}`;    // 分割旧导线的导线终点由新旧导线 ID 组成

        // 交错节点设定
        Map.setPoint({
            type: Map.NodeType.LineCrossPoint,
            point: crossPoint.floorToSmall(),
            id: `${this.id} ${splited.id} ${devices.id}`,
            connect: [],
        });

        // 标记图纸
        this.markSign();
        splited.markSign();
        devices.markSign();

        // 更新数据
        this.dispatch();
        splited.dispatch();

        // 加载临时导线
        this.$store.commit(Mutation.PUSH_LINE, copyProperties(devices, disptchKeys));

        // 销毁临时导线
        devices.$destroy();
    }
}
