import vuex from 'src/vuex';

import * as schMap from 'src/lib/map';
import * as common from 'src/components/drawing-main/common';

import { $M, Matrix } from 'src/lib/matrix';
import Electronics, { PartTypes } from './parts';
import { $P, Point, PointLike } from 'src/lib/point';
import { LineCore } from 'src/components/electronic-line';
import { ElectronicCore } from '../drawing-main/abstract';
import { clone, copyProperties, mixins } from 'src/lib/utils';

/** 兼容 PointLike 类型的点乘矩阵 */
const product = (point: PointLike, ma: Matrix): Point => {
    return Point.prototype.rotate.call(point, ma);
};

type dispatchKey = 'id' | 'type' | 'hash' | 'params' | 'rotate' | 'connect' | 'position' | 'status';
const disptchKeys: dispatchKey[] = ['id', 'type', 'hash', 'params', 'rotate', 'connect', 'position', 'status'];

/** 用于储存的器件数据类型 */
export type PartCoreData = Pick<PartCore, dispatchKey>;

/** 器件数据核心类 */
export class PartCore extends ElectronicCore {
    /** 原型链形式的 PartCore 实例 */
    static noVueInstance(type: PartTypes): PartCore {
        const instance = new PartCore(type);

        const data: PartCore = copyProperties(instance, disptchKeys) as any;
        Object.setPrototypeOf(data, PartCore.prototype);

        return data;
    }

    /** 器件当前旋转矩阵 */
    rotate: Matrix;
    /** 器件当前位置 */
    position: Point;
    /** 器件的内部参数 */
    params: string[];
    /** 器件类型 */
    readonly type!: keyof Electronics;

    constructor(type: PartTypes = 'resistance') {
        super(type);

        const origin = Electronics[type];

        this.rotate = $M(2, 'E');
        this.position = $P(1e6, 1e6);
        this.params = origin.params.map((n) => n.default);
        this.connect = Array(origin.points.length).fill('');
    }

    /** 当前引脚状态 */
    get points() {
        return Electronics[this.type].points.map((point, i) => ({
            position: product(point.position, this.rotate),
            direction: product(point.direction, this.rotate),
            class: this.connect[i] ? 'part-point-close' : 'part-point-open',
        }));
    }
    /** 当前器件范围 */
    get margin() {
        const types = ['margin', 'padding'];
        const outter = [[0, 0], [0, 0]];
        const box = {
            margin: [[0, 0], [0, 0]],
            padding: [[0, 0], [0, 0]],
        };

        for (let i = 0; i < 2; i++) {
            const type = types[i] as 'margin' | 'padding';
            const boxSize = Electronics[this.type][type];
            const endpoint = [[- boxSize[3], - boxSize[0]], [boxSize[1], boxSize[2]]];
            const data = endpoint.map((point) => product(point, this.rotate));

            box[type] = [
                [
                    Math.min(data[0][0], data[1][0]),
                    Math.min(data[0][1], data[1][1]),
                ],
                [
                    Math.max(data[0][0], data[1][0]),
                    Math.max(data[0][1], data[1][1]),
                ],
            ];
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                outter[i][j] = box.margin[i][j] + box.padding[i][j];
            }
        }

        return {
            outter,
            inner: box.padding,
        };
    }

    /** 将数据更新至 vuex */
    dispatch() {
        vuex.commit('UPDATE_PART', copyProperties(this, disptchKeys));
    }

    /** 在图纸标记当前器件 */
    markSign() {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 器件内边距占位
        position.everyRect(inner, (node) => schMap.setPoint({
            point: $P(node),
            id: this.id,
            type: 'part',
        }) || true);

        // 器件管脚距占位
        this.points.forEach((point, i) => schMap.setPoint({
            point: point.position.floorToSmall().add(position),
            connect: [],
            type: 'part-point',
            id: `${this.id}-${i}`,
        }));
    }
    /** 删除当前器件在图纸中的标记 */
    deleteSign() {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 删除器件内边距占位
        position.everyRect(inner, (node) => schMap.deletePoint(node));
        // 删除器件引脚占位
        this.points.forEach((point) => schMap.deletePoint(point.position.floorToSmall().add(position)));
    }

    /** 当前位置是否被占用 */
    isCover(location: Point = this.position) {
        const coverHash = {}, margin = this.margin;

        let label = false;
        const position = $P(location).floorToSmall();

        // 检查器件管脚，管脚点不允许存在任何元素
        for (const point of this.points) {
            const node = position.add(point.position.floorToSmall());
            if (schMap.hasPoint(node)) {
                return (true);
            }
            coverHash[node.join(',')] = true;
        }

        // 扫描内边距，内边距中不允许存在任何元素
        position.everyRect(margin.inner, (node) => {
            if (schMap.hasPoint(node)) {
                label = true;
                return false;
            }
            else {
                coverHash[node.join(',')] = true;
                return true;
            }
        });

        if (label) {
            return (true);
        }

        // 扫描外边距
        position.everyRect(margin.outter, (node) => {
            // 跳过内边距
            if (coverHash[node.join(',')]) {
                return true;
            }
            // 外边框为空
            if (!schMap.hasPoint(node)) {
                return true;
            }
            // 外边框不是由器件占据
            const status = schMap.getPoint(node);
            if (!status || status.type !== 'part') {
                return true;
            }

            // 校验相互距离
            const part = this.findPartCore(status.id);
            const another = part.margin.outter;
            const distance = position.add(part.position.floorToSmall(), -1);

            // 分别校验 x、y 轴
            for (let i = 0; i < 2; i++) {
                if (distance[i] !== 0) {
                    const sub = distance[i] > 0 ? 0 : 1;
                    const diffX = Math.abs(distance[i]);
                    const limitX = Math.abs(margin.outter[sub][i]) + Math.abs(another[1 - sub][i]);

                    if (diffX < limitX) {
                        label = true;
                        return false;
                    }
                }
            }

            return true;
        });

        return (label);
    }
}

mixins(PartCore.prototype, common);
