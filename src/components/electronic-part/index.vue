<template>
<g
    @dblclick="setParams"
    :class="['part', { 'focus': focus }]"
    :transform="`matrix(${rotate.join()},${position.join()})`">
    <g class="focus-partial">
        <part-aspect
            v-for="(info, i) in origin.shape"
            v-once :value="info" :key="i">
        </part-aspect>
        <electronic-point
            v-for="(point, i) in points"
            :key="i" :r="pointSize[i]"
            :class-list="['part-point', point.class]"
            :transform="`translate(${origin.points[i].position.join()})`"
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
import { clone } from 'src/lib/utils';
import { $M, Matrix } from 'src/lib/matrix';
import { $P, Point } from 'src/lib/point';

import ElectronicPoint from 'src/components/electronic-point';
import { PartCore } from './part-core';
import { ComponentInterface } from './types';
import { ElectronicPrototype, ShapeDescription } from './parts';
import { SetDrawEvent, DrawEvent, MapStatus } from 'src/components/drawing-main';

type TextPlacement = 'center' | 'top' | 'right' | 'bottom' | 'left';

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
export default class ElectronicPart extends PartCore implements ComponentInterface {
    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    readonly value: PartCore;
    /** 当前器件数据原型 */
    readonly origin: ElectronicPrototype;

    pointSize: number[] = [];
    textPosition = $P(this.origin.txtLBias);
    textPlacement: TextPlacement = 'bottom';

    constructor() {
        super();

        debugger;
        /** 器件属性修正格式 */
        Object.assign(this, clone(this.value));
        this.origin = clone(Electronics[this.type]);
    }

    created() {
        this.dispatch();
        this.renderText();
    }
    mounted() {
        // 根据不同的标志初始化
        if (this.position.isEqual([1e6, 1e6])) {
            this.setNewPart();
        }
        else {
            this.markSign();
        }
    }
    beforeDestory() {
        this.deleteSign();
        this.$store.commit('DELETE_PART', this.id);
    }

    get focus() {
        return this.mapStatus.partsNow.includes(this.id);
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

    /** 器件属性同步 */
    @Watch('value')
    update() {
        this.id = this.value.id;
        this.rotate = $M(this.value.rotate);
        this.position = $P(this.value.position);
        this.params.$replace(this.value.params);
        this.connect.$replace(this.value.connect);
    }

    /** 设置属性 */
    async setParams() {
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
            this.params.splice(0, this.params.length, ...status.params);
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

        this.textPosition = this.textPosition.rotate(this.invRotate);
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

    /** 当前是新器件 */
    setNewPart() {
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
