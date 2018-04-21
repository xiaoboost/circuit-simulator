import { Component, Vue } from 'vue-property-decorator';
import { CreateElement, VNodeChildrenArrayContents } from 'vue';

import Electronics from 'src/components/electronic-part/parts';
import { PartCore, PartTypes, ElectronicPrototype } from 'src/components/electronic-part';

type TipStyle = Partial<CSSStyleDeclaration>;
type categories = Array<{
    key: string;
    name: string;
    parts: PartTypes[];
}>;

@Component
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

    addPart(type: PartTypes) {
        const part = PartCore.noVueInstance(type);
        part.status = 'create';

        this.$store.commit('NEW_PART', part);
    }

    private setTip(name: PartTypes, event: MouseEvent) {
        this.tipText = Electronics[name].introduction;
        this.tipStyle = {
            display: 'inline',
            left: `${event.pageX - 10}px`,
            top: `${event.pageY - 10}px`,
        };
    }
    private disabledTip(event: MouseEvent) {
        // stop
        event.stopPropagation();
        // self
        if (event.target !== event.currentTarget) {
            return;
        }

        this.tipStyle = {
            display: 'none',
        };
    }
    private render(h: CreateElement) {
        // 部分器件作为图标时需要修正其位置和大小
        function fixElementShape(type: string): { [x: string]: string } {
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

        // 创建器件标志图
        function createPartShape(info: ElectronicPrototype['shape'], type: PartTypes) {
            const shape = (
                info
                    .filter((dom) => (
                        !Object
                            .values(dom.attribute)
                            .some((attr) => attr === 'focus-transparent')
                    ))
                    .map((dom) => h(dom.name, { attrs: dom.attribute }))
            ) as VNodeChildrenArrayContents;

            return h('g', { attrs: fixElementShape(type) }, shape);
        }

        // 所有器件集合
        const parts = Electronics;

        return <section class='parts-panel'>
            <header>
                <h1>添加器件</h1>
                <h2>Add Parts</h2>
            </header>
            <article>
                {this.categories.map((category, i) =>
                    <div class='parts-list' key={i}>
                        {category.parts.map((name, j) =>
                            <button
                                class='part-item' key={j}
                                onClick={() => this.addPart(name)}
                                onMouseleave={this.disabledTip}
                                onMousemove={(e: MouseEvent) => this.setTip(name, e)}>
                                <svg x='0px' y='0px' viewBox='0 0 80 80'>
                                    {createPartShape(parts[name].shape, name)}
                                </svg>
                            </button>,
                        )}
                    </div>,
                )}
            </article>
            <footer class='tool-tip' style={this.tipStyle}>{this.tipText}</footer>
        </section>;
    }
}
