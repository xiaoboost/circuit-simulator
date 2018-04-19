// import './component.styl';

import { CreateElement } from 'vue';
import { PartCore } from './part-core';
import { clone } from 'src/lib/utils';
import { $P, Point } from 'src/lib/point';
import { $M } from 'src/lib/matrix';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Electronics, { ElectronicPrototype, ShapeDescription } from './parts';

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

    private render(h: CreateElement) {
        const idSplit = this.id.split('_');

        return <g
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
                    transform={`matrix(${this.invRotate.join()},${this.textPosition.join()})`}>
                    <text>
                        <tspan>{idSplit[0]}</tspan>
                        <tspan dx='-3'>{idSplit[1]}</tspan>
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
