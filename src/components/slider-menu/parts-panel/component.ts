import { Component, Prop, Vue } from 'vue-property-decorator';
import { CreateElement, VNodeChildrenArrayContents } from 'vue';

import { Mutation } from 'src/vuex';
import { createPartData } from 'src/components/electronic-part/helper';
import { findPartComponent } from 'src/components/electronic-part/common';

import { default as Electronics, PartType } from 'src/components/electronic-part/parts';

@Component
class PartShow extends Vue {
    @Prop({ type: Number })
    type!: keyof Electronics;

    // 部分器件作为图标时需要修正其位置和大小
    fixElementShape(type: PartType) {
        const transform = {
            [PartType.CurrentMeter]: 'scale(1.2, 1.2)',
            [PartType.ReferenceGround]: 'scale(1.2, 1.2) translate(0, 5)',
            [PartType.TransistorNPN]: 'translate(-5, 0)',
        };

        return {
            transform: transform.hasOwnProperty(type)
                ? `translate(40,40) ${transform[type]}`
                : 'translate(40,40)',
        };
    }

    render(h: CreateElement) {
        const shape = Electronics[this.type].shape;
        const child = (
            shape
                .filter((dom) => (
                    !Object
                        .values(dom.attribute)
                        .some((attr) => attr === 'focus-transparent')
                ))
                .map((dom) => h(dom.name, { attrs: dom.attribute }))
        ) as VNodeChildrenArrayContents;

        return h('g', { attrs: this.fixElementShape(this.type) }, child);
    }
}

type TipStyle = Partial<CSSStyleDeclaration>;
type categories = Array<{
    key: string;
    name: string;
    parts: Array<keyof Electronics>;
}>;

@Component({
    components: {
        PartShow,
    },
})
export default class PartsPanel extends Vue {
    /** 提示文本 */
    tipText = '';
    tipStyle: TipStyle = { display: 'none' };

    categories: categories = [
        {
            key: 'virtual_device',
            name: '虚拟器件',
            parts: [
                PartType.ReferenceGround,
                PartType.VoltageMeter,
                PartType.CurrentMeter,
            ],
        },
        {
            key: 'power',
            name: '电源',
            parts: [
                PartType.DcVoltageSource,
                PartType.AcVoltageSource,
                PartType.DcCurrentSource,
            ],
        },
        {
            key: 'passive_device',
            name: '无源器件',
            parts: [
                PartType.Resistance,
                PartType.Capacitor,
                PartType.Inductance,
            ],
        },
        {
            key: 'semiconductor_device',
            name: '半导体器件',
            parts: [
                PartType.Diode,
                PartType.TransistorNPN,
                PartType.OperationalAmplifier,
            ],
        },
    ];

    private setTip(name: keyof Electronics, event: MouseEvent) {
        this.tipText = Electronics[name].introduction;
        this.tipStyle = {
            display: 'inline',
            left: `${event.pageX - 10}px`,
            top: `${event.pageY - 10}px`,
        };
    }

    async addPart(name: keyof Electronics) {
        const data = createPartData(name);
        this.$store.commit(Mutation.PUSH_PART, data);

        await this.$nextTick();

        const part = findPartComponent(data.id);
        part.startCreateEvent();
    }
}
