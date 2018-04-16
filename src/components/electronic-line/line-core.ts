import Vue from 'vue';
import * as schMap from 'src/lib/map';

import { clone } from 'src/lib/utils';
import { LineWay } from './line-way';
import { $P, Point } from 'src/lib/point';
import { $M, Matrix } from 'src/lib/matrix';
import { ElectronicCore } from '../drawing-main/abstract';

export class LineCore extends ElectronicCore {
    /** 导线路径 */
    way = new LineWay();
    /** 导线类型 */
    readonly type!: 'line';
    /** 导线的连接表 */
    readonly connect = ['', ''];

    /** 匹配导线 ID */
    matchLine = /(line_\d+ ?)+/;
    /** 匹配器件端点 ID */
    matchPart = /[a-zA-Z]+_[a-zA-Z0-9]+-\d+/;

    constructor() {
        super('line');
    }

    /** 将数据更新至 vuex */
    dispatch() {
        const keys = ['id', 'way', 'hash', 'connect'];
        this.$store.commit(
            'UPDATE_LINE',
            clone(keys.reduce((v, k) => ((v[k] = this[k]), v), {})),
        );
    }

    /** 在图纸标记当前器件 */
    markSign() {
        const way = LineWay.from(this.way);

        let last: Point;
        way.forEachPoint((point) => {
            // 当前点状态
            const status = schMap.getPoint(point, true);
            // 端点
            if (point.isEqual(way.get(0)) || point.isEqual(way.get(-1))) {
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
                schMap.setPoint(
                    {
                        point,
                        type: 'line',
                        id: this.id,
                        connect: [],
                    },
                    true,
                );

                // TODO: 还要导线相互交错的情况
            }

            if (last) {
                schMap.addConnect(point, last, true);
                schMap.addConnect(last, point, true);
            }

            last = point;
        });
    }
    /** 删除当前器件在图纸中的标记 */
    deleteSign() {
        const way = LineWay.from(this.way);

        let last: Point;
        way.forEachPoint((point) => {
            const status = schMap.getPoint(point, true)!;

            // 删除连接
            last && schMap.deleteConnect(point, last, true);
            last && schMap.hasPoint(last, true) && schMap.deleteConnect(last, point, true);

            // 普通点
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

            last = point;
        });
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
            const part = this.findPartCore(connect);
            const mark = +connect.split('-')[1];

            part.connect[mark] = '';
            part.dispatch();
        }
        else if (this.matchLine.test(connect)) {
            const lines = connect.split(' ').map((id) => this.findLineCore(id));

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

        this.connect.$replace(this.connect.map((item) => item.replace(re, '')));
        this.dispatch();
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
     * 由路径信息设置导线端点连接
     * @param {(0 | 1)} [index]
     */
    setConnectByWay(index?: 0 | 1) {
        if (index === undefined) {
            this.setConnectByWay(0);
            this.setConnectByWay(1);
            return;
        }

        const node = this.way.get(-1 * index).round();
        const status = schMap.getPoint(node, true);

        // 端点为空
        if (!status) {
            this.connect[index] = '';
        }

        // 端点为器件引脚
        else if (status.type === 'part-point') {
            const [id, mark] = status.id.split('-');
            const part = this.findPartCore(id);

            part.connect[mark] = this.id;
            this.connect[index] = status.id;

            part.dispatch();
            this.dispatch();
        }
        // 端点为导线空引脚
        else if (status.type === 'line-point') {
            this.concat(status.id);
        }
        // 端点在导线上
        else if (status.type === 'line') {
            if (this.hasConnect(status.id)) {
                this.freeConnect();
                this.deleteSign();
                this.$store.commit('DELETE_LINE', this.id);
            }
            else {
                this.split(status.id, index);
            }
        }
        // 端点在交错节点
        else if (status.type === 'cross-point') {
            const lines = status.id.split(' ').filter((n) => n !== this.id);

            if (lines.length === 1) {
                this.concat(lines[0]);
            }
            else {
                this.connect[index] = lines.join(' ');

                lines.forEach((id) => {
                    const line = this.findLineCore(id);
                    const mark = line.findConnectIndex(node);
                    const connect = lines.filter((n) => n !== line.id);

                    if (mark !== -1) {
                        line.connect[mark] = `${connect.join(' ')} ${this.id}`;
                        line.dispatch();
                    }
                });
            }
        }
    }
    /**
     * 指定连接所连接的器件，将这些器件所连接的 this.id 替换成 newId
     * @param {(0 | 1)} index 连接标号
     * @param {string} newId 替换的 id
     */
    replaceConnect(index: 0 | 1, newId: string) {
        const connect = this.connect[index];

        if (this.matchPart.test(connect)) {
            const part = this.findPartCore(connect);
            const mark = +connect.split('-')[1];

            part.connect[mark] = newId;
            part.dispatch();
        }
        else if (this.matchLine.test(connect)) {
            connect
                .split(' ')
                .map((id) => this.findLineCore(id))
                .forEach((line) => {
                    line.connect[0] = line.connect[0].replace(this.id, newId);
                    line.connect[1] = line.connect[1].replace(this.id, newId);
                    line.dispatch();
                });

            const crossMapData = schMap.getPoint(this.way.get(-1 * index), true)!;

            crossMapData.id = crossMapData.id.replace(this.id, newId);
            schMap.setPoint(crossMapData, true);
        }
    }
    /**
     * 合并导线
     * @param {string} id 待连接导线的 id
     */
    concat(id: string) {
        const line = this.findLineCore(id);

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
        this.$store.commit('DELETE_LINE', line.id);
    }
    /**
     * 拆分导线
     * @param {string} id 被拆分导线的 id
     * @param {(0 | 1)} index 当前导线的起点/终点作为分割点
     */
    split(id: string, index: 0 | 1) {
        const splited = this.findLineCore(id);
        const crossPoint = $P(this.way.get(-1 * index));

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

        // 生成新导线
        const devices = new LineCore();
        this.$store.commit('NEW_LINE', devices);

        // devices 连接关系设定
        splited.replaceConnect(1, devices.id);                  // splited 原终点器件连接替换为 devices
        devices.connect[1] = splited.connect[1];                // 原导线起点不变，新导线的终点等于原导线的终点
        devices.connect[0] = `${splited.id} ${this.id}`;        // 新导线起点由旧导线 ID 和分割旧导线的导线 ID 组成

        // devices 路径为交错点至原 splited 终点
        devices.way = LineWay.from(splited.way.slice(crossSub + 1));
        devices.way.unshift(crossPoint);
        devices.way.checkWayRepeat();

        // splited 的终点连接变更
        splited.connect[1] = `${devices.id} ${this.id}`;

        // splited 路径变更为起点至交错点部分
        splited.way = LineWay.from(splited.way.slice(0, crossSub + 1));
        splited.way.push(crossPoint);
        splited.way.checkWayRepeat();

        // 当前导线端点连接为拆分而成的两个导线
        this.connect[index] = `${splited.id} ${devices.id}`;    // 分割旧导线的导线终点由新旧导线 ID 组成

        // 交错节点设定
        schMap.setPoint({
            type: 'cross-point',
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
        devices.dispatch();
    }
}
