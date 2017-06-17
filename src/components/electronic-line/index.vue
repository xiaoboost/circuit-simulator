<template>
<g
    :class="['line', { 'focus': focus }]">
    <path :d="way2path"></path>
    <rect
        class="line-rect"
        v-for="item in pathRects"
        :x="item.x" :y="item.y"
        :height="item.height" :width="item.width">
    </rect>
</g>
</template>

<script>
import { $P } from '@/libraries/point';
import { $M } from '@/libraries/matrix';
import { lineSearch } from './line-way';
import { schMap } from '@/libraries/maphash';

export default {
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        focus: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            way: [],
            connect: []
        };
    },
    computed: {
        way2path() {
            return 'M' + this.way.map((n) => n.join(',')).join('L');
        },
        pathRects() {
            const ans = [], wide = 14;

            for (let i = 0; i < this.way.length - 1; i++) {
                const start = this.way[i], end = this.way[i + 1],
                    left = Math.min(start[0], end[0]),
                    top = Math.min(start[1], end[1]),
                    right = Math.max(start[0], end[0]),
                    bottom = Math.max(start[1], end[1]),
                    rect = { x: left - wide / 2, y: top - wide / 2 };

                ans.push(rect);
                if (left === right) {
                    rect.height = bottom - top + wide;
                    rect.width = wide;
                } else {
                    rect.height = wide;
                    rect.width = right - left + wide;
                }
            }

            return ans;
        }
    },
    method: {
        find(arg) {
            return this.$parent.find(arg);
        },
        update() {
            const keys = ['id', 'way', 'connect'];
            this.$emit(
                'update:value',
                keys.reduce((v, k) => (v[k] = this[k], v), {})
            );
        },
        drawing(current) {
            this.$emit('focus', this.id, this.connect[0]);

            const stopEvent = { el: this.$parent.$el, type: 'mouseup', which: 'left' },
                mouseenter = (e) => current.onPart = this.find(e.currentTarget),
                mouseleaves = () => current.onPart = false,
                draw = (e) => {
                    current.end = $P(e.pageX, e.pageY);
                    this.way = lineSearch(current);
                },
                afterEvent = () => {
                    debugger;
                    this.update();
                    this.markSign();
                };

            current.type = 'drawing';
            this.$emit('event', { stopEvent, afterEvent, cursor: 'draw_line',
                handlers: [
                    draw,
                    { delegate: true, type: 'mouseenter', callback: mouseenter },
                    { delegate: true, type: 'mouseleaves', callback: mouseleaves },
                ]
            });
        }
    },
    mounted() {
        this.id = this.value.id;
        this.way = this.value.way || [];
        this.connect = this.value.connect;

        if (!this.way.length) {
            this.drawing(this.value.current);
        }
    },
};
</script>
