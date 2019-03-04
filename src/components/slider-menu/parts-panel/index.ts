import { Component, Vue } from 'vue-property-decorator';
import { VNodeChildrenArrayContents } from 'vue';

import { Mutation } from 'vuex-class';
import { MutationName, Mutation as MutationTree } from 'src/vuex';
import { findPartComponent } from 'src/components/electronic-part/common';
import { Electronics, PartType, createPartData } from 'src/components/electronic-part';

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

interface Category {
    name: string;
    parts: Array<keyof Electronics>;
}

@Component({
    components: {
        PartShow,
    },
})
export default class PartsPanel extends Vue {
    /** 器件列表 */
    categories: Category[] = [
        {
            name: '虚拟器件',
            parts: [
                PartType.ReferenceGround,
                PartType.VoltageMeter,
                PartType.CurrentMeter,
            ],
        },
        {
            name: '电源',
            parts: [
                PartType.DcVoltageSource,
                PartType.AcVoltageSource,
                PartType.DcCurrentSource,
            ],
        },
        {
            name: '无源器件',
            parts: [
                PartType.Resistance,
                PartType.Capacitor,
                PartType.Inductance,
            ],
        },
        {
            name: '半导体器件',
            parts: [
                PartType.Diode,
                PartType.TransistorNPN,
                PartType.OperationalAmplifier,
            ],
        },
    ];

    /** 储存器件 */
    @Mutation(MutationName.PUSH_PART)
    storePart!: MutationTree[MutationName.PUSH_PART];

    /** 获取器件说明文本 */
    getIntro(name: keyof Electronics) {
        return Electronics[name].introduction;
    }

    /** 创建器件 */
    async createPart(name: keyof Electronics) {
        const data = createPartData(name);

        this.storePart(data);

        await this.$nextTick();

        const part = findPartComponent(data.id);
        part.startCreateEvent();
    }
}
