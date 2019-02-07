import { Component, Vue } from 'vue-property-decorator';
import { VNodeChildrenArrayContents } from 'vue';

import { Mutation } from 'src/vuex';
import { createPartData } from 'src/components/electronic-part/helper';
import { findPartComponent } from 'src/components/electronic-part/common';

import { default as Electronics, PartType } from 'src/components/electronic-part/parts';

interface Props {
    type: PartType;
}

export const PartShow = Vue.extend<Props>({
    functional: true,
    props: {
        type: {
            type: Number,
        },
    },
    render(h, context) {
        // 器件位置修正
        const transform = {
            [PartType.CurrentMeter]: 'scale(1.2, 1.2)',
            [PartType.ReferenceGround]: 'scale(1.2, 1.2) translate(0, 5)',
            [PartType.TransistorNPN]: 'translate(-5, 0)',
        };
        // 生成修正函数
        const fixElementShape = (type: PartType) => ({
            transform: transform.hasOwnProperty(type)
                ? `translate(40,40) ${transform[type]}`
                : 'translate(40,40)',
        });

        const partType = context.props.type;
        const shape = Electronics[partType].shape;
        const child = (
            shape
                .filter((dom) => (
                    !Object
                        .values(dom.attribute)
                        .some((attr) => attr === 'focus-transparent')
                ))
                .map((dom) => h(dom.name, { attrs: dom.attribute }))
        ) as VNodeChildrenArrayContents;

        return h('g', { attrs: fixElementShape(partType) }, child);
    },
});

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
            key: 'source',
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
