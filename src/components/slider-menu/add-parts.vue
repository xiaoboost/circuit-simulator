<template>
<section class="slider-add-parts">
    <header>
        <h1>添加器件</h1>
        <h2>Add Parts</h2>
    </header>
    <article
        v-once
        v-delegate:click="['.parts-list', addPart]"
        v-delegate:mousemove="['.parts-list', setTip]"
        v-delegate:mouseleave="['.parts-list', disabledTip]">
        <div v-for="category in categories" class="parts-menu" :key="category.key">
            <button
                v-for="key in category.parts"
                :data-name="key" :key="key" class="parts-list">
                <svg x="0px" y="0px" viewBox="0 0 80 80">
                    <part-shape :info="parts[key].shape" :type="parts[key].type"></part-shape>
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
import { PartData } from 'src/components/electronic-part/type';

import { CreateElement, VNode } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import Electronics, { categories, Electronic, ShapeDescription } from 'src/components/electronic-part/shape';

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
class PartShape extends Vue {
    @Prop({ type: String, default: '' })
    type: string;

    @Prop({ type: Array, default: () => [] })
    info: ShapeDescription[];

    render(createElement: CreateElement): VNode {
        const shape = this.info
            .filter((dom) => !Object.values(dom.attribute).some((attr) => attr === 'focus-part'))
            .map((dom) => createElement(dom.name, { attrs: dom.attribute }));

        return createElement('g', { attrs: fixElementShape(this.type) }, shape);
    }
}

interface TipStyle {
    display: string;
    left?: string;
    top?: string;
}

@Component({
    components: {
        PartShape,
    },
})
export default class AddParts extends Vue {
    /** 提示文本 */
    tipText = '';
    tipStyle: TipStyle = { display: 'none' };

    parts = Electronics;
    categories = categories;

    setTip(event: MouseEvent & EventExtend): void {
        const name = event.currentTarget.getAttribute('data-name');

        if (assert.isNull(name)) {
            throw new Error('Type cannot be empty.');
        }

        this.tipText = Electronics[name].introduction;
        this.tipStyle = {
            display: 'inline',
            left: `${event.pageX - 10}px`,
            top: `${event.pageY - 10}px`,
        };
    }
    disabledTip(): void {
        this.tipStyle = {
            display: 'none',
        };
    }
    addPart(event: MouseEvent & EventExtend): void {
        const name = event.currentTarget.getAttribute('data-name');

        if (assert.isNull(name)) {
            throw new Error('Type cannot be empty.');
        }

        const partData: Electronic = Electronics[name];
        const partsAll = this.$store.state.Parts;

        this.$store.commit('PUSH_PART', {
            id: partsAll.createPartId(partData.pre),
            type: partData.type,
            rotate: $M(2, 'E'),
            // 初始状态：0, 0 表示是新建器件
            position: $P(0, 0),
            params: partData.params.map((params) => params.default),
            connect: [],
        });
    }
}
</script>

<style lang="stylus">
@import '../../css/Variable'

bezier = cubic-bezier(.3,.3,.1,1)

.slider-add-parts
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
        svg
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
