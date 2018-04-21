import { CreateElement } from 'vue';
import { PartCore } from './part-core';
import { clone } from 'src/lib/utils';
import { $P, Point } from 'src/lib/point';
import { $M } from 'src/lib/matrix';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Electronics, { ElectronicPrototype, ShapeDescription } from './parts';
import { DrawEvent } from 'src/components/drawing-main';

import ElectronicPoint from 'src/components/electronic-point';

type TextPlacement = 'center' | 'top' | 'right' | 'bottom' | 'left';

@Component({
    components: {
        ElectronicPoint,
    },
})
export default class PartComponent extends PartCore {
    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    readonly value!: PartCore;
    /** 当前器件数据原型 */
    readonly origin!: ElectronicPrototype;
    /** 引脚大小 */
    pointSize: number[] = [];
    /** 说明文本位置 */
    textPosition: Point;
    /** 说明文本方向 */
    textPlacement: TextPlacement = 'bottom';

    constructor() {
        super();

        /** 器件属性修正格式 */
        Object.assign(this, clone(this.value));
        this.origin = clone(Electronics[this.type]);
        this.textPosition = $P(this.origin.txtLBias);
    }

    mounted() {
        // 手动创建新的器件
        if (this.status === 'create') {
            this.setNewPart();
        }

        // 初始化
        this.status = 'normal';
        this.renderText();
        this.dispatch();
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
    update(data: Partial<PartCore>) {
        Object.assign(this, clone(data));
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
            this.update(status);
        }
    }

    /** 渲染说明文本 */
    renderText() {
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
                        pre.distance(pend) < next.distance(pend) ? pre : next,
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
    moveText(event: MouseEvent) {
        // stop event
        event.stopPropagation();

        // foucus current part
        this.mapStatus.partsNow = [this.id];
        // move text
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
                                node.distance(pre) < node.distance(next) ? pre : next,
                        ),
                );

                this.dispatch();
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

    private render(h: CreateElement) {
        const idSplit = this.id.split('_');

        return <g
            onDblclick={this.setParams}
            class={['part', { focus: this.focus }]}
            transform={`matrix(${this.rotate.join()},${this.position.join()})`}>
            <g class='focus-partial'>
                {this.origin.shape.map(
                    (shape) =>
                        h(shape.name, { attrs: shape.attribute }),
                )}
                {this.points.map((point, i) =>
                    <electronic-point
                        key={i} r={this.pointSize[i]}
                        classList={['part-point', point.class]}
                        transform={`translate(${this.origin.points[i].position.join()})`}>
                    </electronic-point>,
                )}
            </g>
            {this.type !== 'reference_ground' ?
                <g
                    class={`text-params text-placement-${this.textPlacement}`}
                    transform={`matrix(${this.invRotate.join()},${this.textPosition.join()})`}
                    onMousedown={this.moveText}>
                    <text>
                        <tspan>{idSplit[0]}</tspan>
                        <tspan>{idSplit[1]}</tspan>
                    </text>
                    {this.texts.map(
                        (text, i) =>
                            <text dy={16 * (i + 1)} key={i}>{text}</text>,
                    )}
                </g>
            : ''}
        </g>;
    }
}
