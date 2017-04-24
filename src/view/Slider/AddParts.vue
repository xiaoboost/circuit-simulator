<template>
<aside class="slider-add-parts">
    <header>
        <h1>添加器件</h1>
        <h2>Add Parts</h2>
    </header>
    <section>
        <div v-for="list in lists" class="parts-menu">
            <button
                class="parts-list"
                v-for="part in list.parts"
                @click="addPart(part)"
                @mouseleave.self="disabledTip"
                @mousemove.stop="setTip($event, part)">
                <svg x="0px" y="0px" viewBox="0 0 80 80">
                    <part-shape :info="shapes[part]" :type="part"></part-shape>
                </svg>
            </button>
        </div>
    </section>
    <footer class="tool-tip" :style="tipStyle">{{tipText}}</footer>
</aside>
</template>

<script>
import { Electronics } from '@/components/ElectronicPart/Shape';

export default {
    name: 'AddParts',
    data() {
        return {
            tipStyle: {},
            tipText: '',
            shapes: Electronics.map((value) => value.readOnly.aspect),
            texts: Electronics.map((value) => value.readOnly.introduction),
            lists: [
                {
                    header: '虚拟器件',
                    parts: [
                        'reference_ground',
                        'voltage_meter',
                        'current_meter'
                    ]
                },
                {
                    header: '电源',
                    parts: [
                        'dc_voltage_source',
                        'ac_voltage_source',
                        'dc_current_source'
                    ]
                },
                {
                    header: '无源器件',
                    parts: [
                        'resistance',
                        'capacitor',
                        'inductance'
                    ]
                },
                {
                    header: '半导体器件',
                    parts: [
                        'diode',
                        'transistor_npn',
                        'operational_amplifier'
                    ]
                }
            ]
        };
    },
    methods: {
        setTip(event, type) {
            this.tipText = this.texts[type];
            this.tipStyle = {
                display: 'inline',
                left: `${event.pageX - 10}px`,
                top: `${event.pageY - 10}px`
            };
        },
        disabledTip() {
            this.tipStyle = {
                display: 'none'
            };
        },
        addPart(type) {
            const part = Object.clone(Electronics[type].readWrite),
                partsAll = this.$store.state.collection.Parts;

            part.type = type;
            part.id = partsAll.newId(part.id);
            this.$store.commit('PUSH_PART', part);
        }
    },
    components: {
        'part-shape': {
            render(createElement) {
                const shape = this.info.filter((n) => !Object
                        .values(n.attribute).some((n) => n === 'focus-part'))
                        .map((dom) => createElement(
                            dom.name,
                            { attrs: dom.attribute }
                        )),
                    special = {
                        'current_meter' : 'scale(1.2, 1.2)',
                        'reference_ground' : 'scale(1.2, 1.2)',
                        'transistor_npn' : 'translate(-5,0)'
                    },
                    attrs = special.hasOwnProperty(this.type)
                        ? {  transform: 'translate(40,40) ' + special[this.type] }
                        : {  transform: 'translate(40,40)' };

                return createElement('g', { attrs }, shape);
            },
            props: {
                info: {
                    type: Array,
                    default: () => []
                },
                type: {
                    type: String,
                    default: ''
                }
            }
        }
    }
};
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
            polygon.fill-black
                stroke-width 0
</style>
