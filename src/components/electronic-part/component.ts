import { Component } from 'vue-property-decorator';

import * as map from 'src/lib/map';
import { $M } from 'src/lib/matrix';
import Point, { $P, PointLike } from 'src/lib/point';

import setPartParams from './dialog-controller';
import Electronics, { ElectronicPrototype } from './parts';
import ElectronicCore, { createId, findPartComponent } from './common';
import ElectronicPoint from 'src/components/electronic-point/component';
import { DrawEvent } from 'src/components/drawing-main/event-controller';

import {
    isEqual,
    randomString,
    copyProperties,
} from 'src/lib/utils';

type TextPlacement = 'center' | 'top' | 'right' | 'bottom' | 'left';
type dispatchKey = 'id' | 'type' | 'hash' | 'params' | 'rotate' | 'connect' | 'position';
const disptchKeys: dispatchKey[] = ['id', 'type', 'hash', 'params', 'rotate', 'connect', 'position'];

export type PartData = Pick<PartComponent, dispatchKey>;

/** 兼容 PointLike 类型的点乘矩阵 */
const product = (point: PointLike, ma: Matrix): Point => {
    return Point.prototype.rotate.call(point, ma);
};

/**
 * 生成完整的初始化器件数据
 * @param type 器件类型
 */
export const createPartData = (type: keyof Electronics): PartData => ({
    type,
    hash: randomString(),
    rotate: $M(2, 'E'),
    position: $P(1e6, 1e6),
    id: createId(Electronics[type].pre),
    params: Electronics[type].params.map((n) => n.default),
    connect: Array(Electronics[type].points.length).fill(''),
});

@Component({
    components: {
        ElectronicPoint,
    },
})
export default class PartComponent extends ElectronicCore {
    /** 器件原始数据 */
    readonly value!: PartData;
    /** 器件类型 */
    readonly type!: keyof Electronics;
    /** 当前器件数据原型 */
    readonly origin!: ElectronicPrototype;

    /** 器件当前旋转矩阵 */
    rotate = $M(2, 'E');
    /** 器件当前位置 */
    position = $P(1e6, 1e6);
    /** 器件的内部参数 */
    params: string[] = [];
    /** 器件管教连接 */
    connect: string[] = [];

    /** 引脚大小 */
    pointSize: number[] = [];
    /** 说明文本位置 */
    textPosition = $P(0, 0);
    /** 说明文本方向 */
    textPlacement: TextPlacement = 'bottom';

    /** 初始化 */
    created() {
        const origin = Electronics[this.type];
        const pointLen = origin.points.length;

        this.connect = Array(pointLen).fill('');
        this.pointSize = Array(pointLen).fill(-1);
        this.params = origin.params.map((n) => n.default);

        Object.defineProperty(this, 'origin', {
            enumerable: true,
            writable: false,
            configurable: true,
            value: origin,
        });
    }

    /** 当前旋转矩阵的逆矩阵 */
    get invRotate() {
        return this.rotate.inverse();
    }
    /** 当前器件可以显示的文本 */
    get texts() {
        return this.params
            .map((v, i) => ({ value: v, ...this.origin.params[i] }))
            .filter((txt) => txt.vision)
            .map((txt) => (txt.value + txt.unit).replace(/u/g, 'μ'));
    }
    /** 当前引脚状态 */
    get points() {
        return this.origin.points.map((point, i) => ({
            size: this.pointSize[i],
            originPosition: $P(point.position),
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

    /** 在图纸标记当前器件 */
    markSign() {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 器件内边距占位
        position.everyRect(inner, (node) => map.setPoint({
            point: $P(node),
            id: this.id,
            type: 'part',
        }) || true);

        // 器件管脚距占位
        this.points.forEach((point, i) => map.setPoint({
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
        position.everyRect(inner, (node) => map.deletePoint(node));
        // 删除器件引脚占位
        this.points.forEach((point) => map.deletePoint(point.position.floorToSmall().add(position)));
    }

    /** 将当前器件数据更新至`vuex` */
    dispatch() {
        this.$store.commit(
            'UPDATE_PART',
            copyProperties(this, disptchKeys),
        );
    }
    /** 当前位置是否被占用 */
    isCover(location = this.position) {
        const coverHash = {}, margin = this.margin;

        let label = false;
        const position = $P(location).floorToSmall();

        // 检查器件管脚，管脚点不允许存在任何元素
        for (const point of this.points) {
            const node = position.add(point.position.floorToSmall());
            if (map.hasPoint(node)) {
                return (true);
            }
            coverHash[node.join(',')] = true;
        }

        // 扫描内边距，内边距中不允许存在任何元素
        position.everyRect(margin.inner, (node) => {
            if (map.hasPoint(node)) {
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
            if (!map.hasPoint(node)) {
                return true;
            }
            // 外边框不是由器件占据
            const status = map.getPoint(node);
            if (!status || status.type !== 'part') {
                return true;
            }

            // 校验相互距离
            const part = findPartComponent(status.id);
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
    /** TODO: 渲染说明文本 */
    renderText() {

    }
    /** TODO: 移动说明文本 */
    moveText() {

    }

    /** 设置属性 */
    async setParams() {
        this.mapStatus.partsNow = [this.id];

        const status = await setPartParams(
            this.type,
            this.id,
            this.position
                .mul(this.mapStatus.zoom)
                .add(this.mapStatus.position),
            this.params,
        );

        // 并未改变参数
        if (!status) {
            return;
        }

        // 参数更新
        if (
            this.id !== status.id ||
            !isEqual(this.params, status.params)
        ) {
            this.update(status);
        }
    }
    /** 开始新器件设置事件 */
    async startCreateEvent() {
        this.$el.setAttribute('opacity', '0.4');
        this.mapStatus.partsNow = [this.id];

        await this
            .createDrawEvent()
            .setCursor('move_part')
            .setStopEvent({ type: 'mousedown', which: 'left' })
            .setHandlerEvent((e: DrawEvent) => { this.position = e.$position; })
            .start();

        const node = this.position;

        this.position = $P(
            node.round(20)
                .around((point) => !this.isCover(point), 20)
                .reduce(
                    (pre, next) =>
                        node.distance(pre) < node.distance(next) ? pre : next,
                ),
        );

        this.dispatch();
        this.markSign();
        this.$el.removeAttribute('opacity');
    }
}
