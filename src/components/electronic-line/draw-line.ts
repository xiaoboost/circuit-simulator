// import * as assert from 'src/lib/assertion';
import * as schMap from 'src/lib/map';
import { $P, Point } from 'src/lib/point';
import { LineWay } from './line-way';
import { nodeSearch } from './node-search';

import { Component, Vue, Inject } from 'vue-property-decorator';
import { DrawingOption, ExchangeData } from './types';
import { FindPart, FindLine, SetDrawEvent, MapStatus } from 'src/components/drawing-main';

@Component
export default class DrawLine extends Vue {
    id = '';
    way: Point[] = [];
    connect: string[] = [];
    pointSize = [-1, -1];

    /** 匹配导线 ID */
    matchLine = /(line_\d+ ?)+/;
    /** 匹配器件端点 ID */
    matchPart = /[a-zA-Z]+_\d+-\d+/;

    /** 设置图纸事件 */
    @Inject()
    protected readonly setDrawEvent: SetDrawEvent;
    /** 搜索器件 */
    @Inject()
    protected readonly findPart: FindPart;
    /** 搜索导线 */
    @Inject()
    protected readonly findLine: FindLine;
    /** 图纸相关状态 */
    @Inject()
    protected readonly mapStatus: MapStatus;

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

        if (this.matchPart.test(connect)) {
            const part = this.findPart(connect);
            const mark = +connect.split('-')[1];
            part.connect.$set(mark, '');
        }
        else if (this.matchLine.test(connect)) {
            const lines = connect.split(' ').map((id) => this.findLine(id));

            if (lines.length === 2) {
                // TODO: 合并导线
                // lines[0].mergeLine(lines[1]);
                // lines[0].markSign();
            }
            else if (lines.length === 3) {
                lines.forEach((line) => line.deleteConnect(this.id));
            }
        }

        this.connect.$set(index, '');
    }
    /**
     * 删除连接
     * @param {string} id 待删除的连接
     */
    deleteConnect(id: string) {
        const re = new RegExp(`${id} ?`, 'i');
        this.connect = this.connect.map((item) => item.replace(re, ''));
    }
    /**
     * 判断输入坐标是当前导线的起点还是终点
     * @param {Point} node
     * @returns {number}
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
     * 由路径信息设置导线端点连接
     * @param {(0 | 1)} [index]
     */
    setConnectByWay(index?: 0 | 1) {
        if (index === undefined) {
            this.setConnectByWay(0);
            this.setConnectByWay(1);
            return;
        }

        // 清除节点临时状态
        this.pointSize.$set(index, -1);

        const node = this.way.get(-1 * index).round();
        const status = schMap.getPoint(node, true);

        // 端点为空
        if (!status) {
            this.connect.$set(index, '');
        }
        // 端点为器件引脚
        else if (status.type === 'part-point') {
            const [id, mark] = status.id.split('-');
            const part = this.findPart(id);

            // 器件引脚的临时状态也要清除
            part.pointSize.$set(+mark, -1);
            part.connect.$set(+mark, this.id);
            this.connect.$set(1, status.id);
        }
        // 端点为导线空引脚
        else if (status.type === 'line-point') {
            // TODO: 合并导线
        }
        // 端点在导线上
        else if (status.type === 'line') {
            // TODO: 切割导线
            // this.hasConnect(status.id)
            //     ? this.deleteSelf()
            //     : this.split(status.id);
        }
        // 端点在交错节点
        else if (status.type === 'cross-point') {
            const lines = status.id.split(' ').filter((n) => n !== this.id);

            if (lines.length === 1) {
                // this.merge(lines[0]);
                return;
            }

            this.connect.$set(index, lines.join(' '));

            lines.forEach((id) => {
                const line = this.findLine(id);
                const mark = line.findConnectIndex(node);
                const connect = lines.filter((n) => n !== line.id);

                if (mark !== -1) {
                    line.connect.$set(mark, `${connect.join(' ')} ${this.id}`);
                }
            });
        }
    }

    // 导线标记
    markSign() {
        const way = LineWay.from(this.way);

        let last: Point;
        way.forEachPoint((point) => {
            // 当前点状态
            const status = schMap.getPoint(point, true);
            // 端点
            if (point.isEqual(way.get(0) || point.isEqual(way.get(-1)))) {
                // 空
                if (!status) {
                    schMap.setPoint(
                        {
                            point,
                            type: 'line-point',
                            id: this.id,
                            connect: [],
                        },
                        true,
                    );
                }
                // 导线节点
                else if (/line(-point)?/.test(status.type)) {
                    status.type = 'cross-point';
                    status.id += ' ' + this.id;

                    schMap.mergePoint(status, true);
                }
            }
            // 非端点
            else {
                // 空
                if (!status) {
                    schMap.setPoint(
                        {
                            point,
                            type: 'line',
                            id: this.id,
                            connect: [],
                        },
                        true,
                    );
                }
                // 路径其他导线
                else if (status.type === 'line') {
                    schMap.mergePoint(
                        {
                            point,
                            type: 'line',
                            id: `${this.id} ${status.id}`,
                        },
                        true,
                    );
                }
            }

            if (last) {
                schMap.addConnect(point, last, true);
                schMap.addConnect(last, point, true);
            }

            last = point;
        });
    }
    deleteSign() {
        const way = LineWay.from(this.way);

        let last: Point;
        way.forEachPoint((point) => {
            const status = schMap.getPoint(point, true)!;

            // 导线(端点)?
            if (/line(-point)?/.test(status.type)) {
                schMap.deletePoint(point, true);
            }
            // 交错/覆盖节点
            else if (/(cross|cover)-point/.test(status.type)) {
                status.id = (
                    status.id
                        .split(' ')
                        .filter((id) => id !== this.id)
                        .join(' ')
                );

                if (status.id) {
                    schMap.setPoint(status, true);
                }
                else {
                    schMap.deletePoint(point, true);
                }
            }

            if (last) {
                schMap.deleteConnect(point, last, true);
                schMap.deleteConnect(last, point, true);
            }

            last = point;
        });
    }

    // 绘制导线
    drawing({ start, end, direction, temp }: DrawingOption) {
        // 当前终点四方格左上角顶点
        const vertex = end.floor();
        // 当前终点四舍五入坐标
        // const endRound = end.round();
        // 四方格坐标
        const endGrid = vertex.toGrid();
        // 路径缓存
        const wayMap = temp.wayMap;

        // 待搜索的点集合
        let ends: Point[] = [];
        // 当前搜索状态
        let status = '';

        // 终点并未覆盖上器件
        if (!temp.onPart) {
            ends = endGrid;
        }
        // 终点离开器件
        else if (temp.onPart.status === 'leave') {
            const part = temp.onPart.part;

            ends = endGrid;
            this.pointSize.$set(1, 8);
            part.pointSize.$set(temp.onPart.pointIndex, -1);
        }
        // 终点在器件上，强制对齐
        else {
            const part = temp.onPart.part;
            const points = part.points.map((point) => point.position);
            const mouseToPart = $P(part.position, end.add(temp.mouseBais));
            const partToPoint = points.filter((_, i) => !part.connect[i]);

            // 允许直接对齐
            if (partToPoint.length > 0) {
                const allowPoint = mouseToPart.minAngle(partToPoint);

                // 导线终点缩小
                this.pointSize.$set(1, 2);
                // 上次器件的节点恢复默认大小
                part.pointSize.$set(temp.onPart.pointIndex, -1);

                temp.onPart.pointIndex = points.findIndex((node) => node.isEqual(allowPoint));

                // 当前器件的节点设置大小
                part.pointSize.$set(temp.onPart.pointIndex, 2);

                status = 'align';
                ends = [allowPoint.add(part.position)];
            }
            else {
                ends = endGrid;
            }
        }

        // 按照距离起点由远到近的顺序排序
        ends = ends.sort(
            (pre, next) =>
                pre.distance(next) > next.distance(start) ? -1 : 1,
        );

        const options: ExchangeData = {
            start, direction, end: $P(),
            endBias: endGrid[0].add(10),
            status: 'drawing',
        };

        for (const point of ends) {
            // 是否为空
            if (wayMap.has(point)) {
                continue;
            }

            // 设置当前搜索终点
            options.end = point;

            // 搜索导线
            const tempWay = nodeSearch(options);
            tempWay.checkWayExcess(options);

            // 搜索图中设置所有节点
            // FIXME: 起点方向相反一线的所有终点均不能记录
            tempWay.forEachSubway((subway) => wayMap.set(subway.get(-1), subway));
        }

        temp.onPart = undefined;

        let way: LineWay;

        // 强制对齐模式
        if (status === 'align') {
            way = LineWay.from(wayMap.get(ends[0])!);
        }
        // 普通模式
        else {
            // 选取四顶点中节点最多的路径
            const key = endGrid.reduce(
                (pre, next) =>
                    (wayMap.get(pre)!.length >= wayMap.get(next)!.length)
                        ? pre : next,
            );

            way = LineWay.from(wayMap.get(key)!);
            way.endToPoint(end);
        }

        this.way = way;
    }
}
