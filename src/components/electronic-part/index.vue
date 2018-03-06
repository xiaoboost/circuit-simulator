<template>
<g
    @dblclick="setParams"
    :class="['part', { 'focus': focus }]"
    :transform="`matrix(${rotate.join()},${position.join()})`">
    <g class="focus-part">
        <part-aspect
            v-for="(info, i) in this.origin.shape"
            v-once :value="info" :key="i">
        </part-aspect>
        <electronic-point
            v-for="(point, i) in points"
            :index="i" :key="i" :r="pointSize[i]"
            :class-list="['part-point', point.class]"
            :transform="`translate(${point.position.join()})`"
            @mousedown.native.left.stop.passive="setLine(i)">
        </electronic-point>
    </g>
    <g
        v-if="this.type !== 'reference_ground'"
        :class="['text-params', `text-placement-${textPlacement}`]"
        :transform="`matrix(${invRotate.join()},${textPosition.join()})`"
        @mousedown.stop.passive="moveText">
        <text>
            <tspan v-text="id.split('_')[0]"></tspan>
            <tspan dx="-3" v-text="id.split('_')[1]"></tspan>
        </text>
        <text
            v-for="(txt, i) in texts"
            :dy="16 * (i + 1)" :key="i" v-text="txt">
        </text>
    </g>
</g>
</template>

<script lang="ts">
import { CreateElement, VNode } from 'vue';
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';

import Electronics from './parts';
import * as schMap from 'src/lib/map';
import * as assert from 'src/lib/assertion';
import { clone } from 'src/lib/utils';
import { $M, Matrix } from 'src/lib/matrix';
import { $P, Point, PointLike } from 'src/lib/point';

import ElectronicPoint from 'src/components/electronic-point';
import { PartData, ComponentInterface, Electronic, ShapeDescription } from './types';
import { FindPart, SetDrawEvent, DrawEvent, MapStatus } from 'src/components/drawing-main';

type TextPlacement = 'center' | 'top' | 'right' | 'bottom' | 'left';

/** 兼容 PointLike 类型的点乘矩阵 */
const product = (point: PointLike, ma: Matrix): Point => {
    return Point.prototype.rotate.call(point, ma);
}

@Component
class PartAspect extends Vue {
    @Prop({ type: Object, default: () => ({}) })
    readonly value: ShapeDescription;

    render(createElement: CreateElement): VNode {
        return createElement(this.value.name, { attrs: this.value.attribute });
    }
}

@Component({
    components: {
        PartAspect,
        ElectronicPoint,
    }
})
export default class ElectronicPart extends Vue implements ComponentInterface {
    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    private readonly value: PartData;
    /** 设置图纸事件 */
    @Inject()
    private readonly setDrawEvent: SetDrawEvent;
    /** 搜索器件 */
    @Inject()
    private readonly findPart: FindPart;
    /** 图纸相关状态 */
    @Inject()
    private readonly mapStatus: MapStatus;

    /** 器件标识符 */
    readonly hash: string;
    /** 器件类型 */
    readonly type: string;
    /** 器件描述原始数据 */
    readonly origin: Electronic;

    id: string = '';
    position: Point = $P();
    params: string[] = [];
    connect: string[] = [];
    rotate: Matrix = $M(2);

    pointSize: number[];

    private textPosition: Point;
    private textPlacement: TextPlacement = 'bottom';

    // 编译前的初始化
    constructor() {
        super();

        // 初始化只读数据
        this.hash = this.value.hash;
        this.type = this.value.type;
        this.origin = clone(Electronics[this.value.type]);

        // 内部属性初始化
        this.textPosition = $P(this.origin.txtLBias);
        this.pointSize = Array(this.origin.points.length).fill(-1);
    }
    created() {
        this.init();
        this.renderText();
    }
    mounted() {
        // 根据不同的标志初始化
        if (this.position.isEqual([1e6, 1e6])) {
            this.setNewPart();
        }
    }

    get focus() {
        return this.mapStatus.partsNow.includes(this.id);
    }
    get points() {
        return this.origin.points.map((point, i) => ({
            position: product(point.position, this.rotate),
            direction: product(point.direction, this.rotate),
            class: this.connect[i] ? 'part-point-close' : 'part-point-open',
        }));
    }
    get invRotate() {
        return this.rotate.inverse();
    }
    get texts() {
        return this.params
            .map((v, i) => ({ value: v, ...this.origin.params[i] }))
            .filter((txt) => txt.vision)
            .map((txt) => (txt.value + txt.unit).replace(/u/g, 'μ'));
    }
    get margin() {
        const types = ['margin', 'padding'];
        const outter = [[0, 0], [0, 0]];
        const box = {
            margin: [[0, 0], [0, 0]],
            padding: [[0, 0], [0, 0]],
        };

        for (let i = 0; i < 2; i++) {
            const type = types[i],
                boxSize = this.origin[type] as [number, number, number, number],
                endpoint = [[- boxSize[3], - boxSize[0]], [boxSize[1], boxSize[2]]],
                data = endpoint.map((point) => product(point, this.rotate));

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

    /** 器件属性同步 */
    @Watch('value')
    private init() {
        const data = this.value;

        this.id = data.id;
        this.rotate = $M(this.value.rotate);
        this.position = $P(data.position);
        this.params = data.params.slice();
        this.connect = data.connect.slice();
    }
    /** 将当前组件数据更新数据至 vuex */
    update(): void {
        const keys = ['id', 'type', 'hash', 'params', 'rotate', 'connect', 'position'];
        this.$store.commit(
            'UPDATE_PART',
            clone(keys.reduce((v, k) => ((v[k] = this[k]), v), {}))
        );
    }

    /** 设置属性 */
    private async setParams() {
        const map = this.mapStatus;

        map.partsNow = [this.id];
        const status = await this.setPartParams({
            id: this.id,
            type: this.type,
            params: this.params,
            position: this.position
                .mul(map.zoom)
                .add(map.position),
        });

        // 并未改变参数
        if (!status) {
            return;
        }

        // 参数更新
        if (
            this.id !== status.id ||
            !this.params.isEqual(status.params)
        ) {
            this.params = status.params;
            this.id = status.id;
            this.update();
        }
    }

    /** 渲染说明文本 */
    renderText(): void {
        // TODO: 缺正中央
        const textHeight = 11,
            spaceHeight = 5,
            len = this.texts.length,
            local = this.origin.txtLBias,
            pend = this.textPosition,
            points = this.points.map((p) => p.direction),
            direction = [$P(0, 1), $P(0, -1), $P(1, 0), $P(-1, 0)]
                .filter((di) => points.every((point) => !point.isEqual(di)))
                .map((di) => di.mul(local))
                .reduce(
                    (pre, next) =>
                        pre.distance(pend) < next.distance(pend) ? pre : next
                );

        if (direction[0]) {
            pend[1] = ((1 - len) * textHeight - len * spaceHeight) / 2;

            if (direction[0] > 0) {
                pend[0] = local;
                this.textPlacement = 'right';
            }
            else {
                pend[0] = -local;
                this.textPlacement = 'left';
            }
        }
        else {
            pend[0] = 0;

            if (direction[1] > 0) {
                this.textPlacement = 'bottom';
                pend[1] = textHeight + local;
            }
            else {
                this.textPlacement = 'top';
                pend[1] = -((textHeight + spaceHeight) * len + local);
            }
        }
    }
    /** 移动说明文本 */
    moveText(): void {
        this.mapStatus.partsNow = [this.id];
        this.setDrawEvent({
            handlers: (e: DrawEvent) => { this.textPosition = this.textPosition.add(e.$movement); },
            stopEvent: { el: this.$parent.$el, type: 'mouseup', which: 'left' },
            afterEvent: () => this.renderText(),
            cursor: 'move_part',
        });
    }

    /** 在图纸中标记器件 */
    markSign(): void {
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
    /** 删除图纸中器件的标记 */
    deleteSign(): void {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 删除器件内边距占位
        position.everyRect(inner, (node) => schMap.deletePoint(node));
        // 删除器件引脚占位
        this.points.forEach((point) => schMap.deletePoint(point.position.floorToSmall().add(position)));
    }
    /** 当前位置是否被占用 */
    isCover(position: Point = this.position) {
        const coverHash = {}, margin = this.margin;

        let label = false;
        position = $P(position).floorToSmall();

        // 检查器件管脚，管脚点不允许存在任何元素
        for (let i = 0; i < this.points.length; i++) {
            const node = position.add(this.points[i].position.floorToSmall());
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
            const part = this.findPart(status.id);
            const another = part.margin.outter;
            const distance = position.add(part.position.floorToSmall(), -1);

            // 分别校验 x、y 轴
            for (let i = 0; i < 2; i++) {
                if (distance[i] !== 0) {
                    const sub = distance[i] > 0 ? 0 : 1;
                    const diff_x = Math.abs(distance[i]);
                    const limit_x = Math.abs(margin.outter[sub][i]) + Math.abs(another[1 - sub][i]);

                    if (diff_x < limit_x) {
                        label = true;
                        return false;
                    }
                }
            }

            return true;
        });

        return (label);
    }

    /** 当前是新器件 */
    private setNewPart() {
        this.$el.setAttribute('opacity', '0.4');
        this.mapStatus.partsNow = [this.id];

        this.setDrawEvent({
            cursor: 'move_part',
            handlers: (e: DrawEvent) => { this.position = e.$position; },
            stopEvent: { type: 'mousedown', which: 'left' },
            afterEvent: () => {
                const node = this.position;

                this.position = $P(
                    node.round(20)
                        .around((point) => !this.isCover(point), 20)
                        .reduce(
                            (pre, next) =>
                                node.distance(pre) < node.distance(next) ? pre : next
                        )
                );

                this.update();
                this.markSign();
                this.$el.removeAttribute('opacity');
            },
        });
    }
    /** 创建新导线 */
    setLine(index: number) {
        // 排斥事件，直接退出
        if (this.mapStatus.exclusion) {
            return;
        }

        // 当前节点未连接导线，则创建新导线
        if (!this.connect[index]) {
            this.$store.commit('NEW_LINE', this.points[index].position.add(this.position));
        }
        // TODO: 已连接导线，将此导线改为绘制状态
        else {
            // ..
        }
    }
}
</script>
