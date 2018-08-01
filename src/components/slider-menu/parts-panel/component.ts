import { Component, Prop, Vue } from 'vue-property-decorator';
import { CreateElement, VNodeChildrenArrayContents } from 'vue';

import Electronics from 'src/components/electronic-part/parts';
import { createPartData } from 'src/components/electronic-part/helper';
import { findPartComponent } from 'src/components/electronic-part/common';

@Component
class PartShow extends Vue {
    @Prop({ type: String })
    type!: keyof Electronics;

    // 部分器件作为图标时需要修正其位置和大小
    fixElementShape(type: string) {
        const transform = {
            current_meter: 'scale(1.2, 1.2)',
            reference_ground: 'scale(1.2, 1.2) translate(0, 5)',
            transistor_npn: 'translate(-5, 0)',
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
                'reference_ground',
                'voltage_meter',
                'current_meter',
            ],
        },
        {
            key: 'power',
            name: '电源',
            parts: [
                'dc_voltage_source',
                'ac_voltage_source',
                'dc_current_source',
            ],
        },
        {
            key: 'passive_device',
            name: '无源器件',
            parts: [
                'resistance',
                'capacitor',
                'inductance',
            ],
        },
        {
            key: 'semiconductor_device',
            name: '半导体器件',
            parts: [
                'diode',
                'transistor_npn',
                'operational_amplifier',
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
        this.$store.commit('PUSH_PART', data);

        await this.$nextTick();

        const part = findPartComponent(data.id);
        part.startCreateEvent();
    }
}
