<template>
<section>
    <header>
        <h1>添加器件</h1>
        <h2>Add Parts</h2>
    </header>
    <article v-once>
        <div v-for="category in categories" class="parts-menu" :key="category.key">
            <button
                v-for="key in category.parts"
                :key="key" class="parts-list"
                @click.passive.stop.left="addPart(key)"
                @mousemove.capture.passive="setTip(key, $event)"
                @mouseleave.capture.passive.self.stop="disabledTip()">
                <svg x="0px" y="0px" viewBox="0 0 80 80">
                    <part-icon :info="parts[key].shape" :type="parts[key].type"></part-icon>
                </svg>
            </button>
        </div>
    </article>
    <footer class="tool-tip" :style="tipStyle">{{tipText}}</footer>
</section>
</template>

<script lang="ts">
import { $P } from 'src/lib/point';
import { $M } from 'src/lib/matrix';
import * as assert from 'src/lib/assertion';

import Electronics from 'src/components/electronic-part/parts';
import { PartCore, ShapeDescription, PartTypes } from 'src/components/electronic-part';

import { CreateElement, VNodeChildrenArrayContents } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';

// 部分器件作为图标时需要修正其位置和大小
function fixElementShape(type: string): { [x: string]: string } {
    const transform = {
        'current_meter': 'scale(1.2, 1.2)',
        'reference_ground': 'scale(1.2, 1.2) translate(0, 5)',
        'transistor_npn': 'translate(-5, 0)',
    };

    return {
        transform: transform.hasOwnProperty(type)
            ? 'translate(40,40) ' + transform[type]
            : 'translate(40,40)',
    };
}

@Component
class PartIcon extends Vue {
    @Prop({ type: String, default: '' })
    readonly type: string;

    @Prop({ type: Array, default: () => [] })
    readonly info: ShapeDescription[];

    render(h: CreateElement) {
        const shape = (
            this.info
                .filter((dom) => !Object.values(dom.attribute).some((attr) => attr === 'focus-partial'))
                .map((dom) => h(dom.name, { attrs: dom.attribute }))
        ) as VNodeChildrenArrayContents;

        return h('g', { attrs: fixElementShape(this.type) }, shape);
    }
}

interface TipStyle {
    display: string;
    left?: string;
    top?: string;
}

@Component({
    components: {
        PartIcon,
    },
})
export default class AddParts extends Vue {
    /** 提示文本 */
    tipText = '';
    tipStyle: TipStyle = { display: 'none' };

    parts = Electronics;
    categories = [
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

    setTip(name: string, event: MouseEvent) {
        this.tipText = Electronics[name].introduction;
        this.tipStyle = {
            display: 'inline',
            left: `${event.pageX - 10}px`,
            top: `${event.pageY - 10}px`,
        };
    }
    disabledTip() {
        this.tipStyle = {
            display: 'none',
        };
    }
    addPart(type: PartTypes) {
        this.$store.commit('NEW_PART', new PartCore(type));
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

bezier = cubic-bezier(.3,.3,.1,1)

.parts-menu
    margin 20px 0

.tool-tip
    display none
    position fixed
    padding 5px
    margin 6px
    background #d9edf7
    color #3f8aaf
    font-family font-text
    box-shadow 0 0 2px Shadow
    border-radius 3px
    height auto
    font-size 16px
    transform translate(-100%, -100%)

.parts-list
    height 66px
    width 66px
    margin 0 10px
    padding 0
    outline 0
    background #f2f2f2
    border-radius 5px
    border 1px solid Gray
    box-shadow 0 0 3px Shadow
    transition all .3s bezier
    &:hover
        background White
    &:focus
        background White
        border 1px solid Light-Blue
        box-shadow 0 0 3px Light-Blue

.parts-list /deep/ svg
    height 58px
    width 58px
    margin 3px
    stroke Black
    stroke-width 2
    stroke-linecap round
    fill transparent

    .fill-white
        fill White
    .fill-black
        fill Black
    path
        stroke-width 2
    rect,
    polygon.fill-black
        stroke-width 0
</style>
