// import './component.styl';

import { CreateElement } from 'vue';
import { PartCore } from './part-core';
import { clone } from 'src/lib/utils';
import { $P } from 'src/lib/point';
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

        debugger;
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
        return <g
            class={['part', { focus: this.focus }]}
            transform={`matrix(${this.rotate.join()},${this.position.join()})`}>
            器件
        </g>;
    }
}
