<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        height="100%"
        width="100%"
        @mousewheel="mousewheel($event)"
        @mousedown.self="moveMap($event)">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <elec-part
                :ref="parts[i - 1].id"
                :key="parts[i - 1].id"
                v-model="parts[i - 1]"
                v-for="i in parts.length"
                @setEvent="EventControler">
            </elec-part>
            <elec-line
                :ref="lines[i - 1].id"
                :key="lines[i - 1].id"
                v-model="lines[i - 1]"
                v-for="i in lines.length"
                @setEvent="EventControler">
            </elec-line>
        </g>
    </svg>
</section>
</template>

<script>
import Part from '@/components/electronic-part';
import Line from '@/components/electronic-line';

import Event from './event-controler';
import { $P } from '@/libraries/point';

export default {
    name: 'DrawingMain',
    mixins: [Event],
    components: {
        'elec-part': Part,
        'elec-line': Line
    },
    data() {
        return {
            zoom: 1,
            position: $P(0, 0)
        };
    },
    computed: {
        background() {
            const size = this.zoom * 20,
                biasX = this.position[0] % size,
                biasY = this.position[1] % size;
            return {
                'background-size': `${size}px`,
                'background-position': `${biasX}px ${biasY}px`
            };
        },
        parts() {
            return this.$store.state.collection.Parts;
        },
        lines() {
            return this.$store.state.collection.Lines;
        }
    },
    methods: {
        find(id) {
            return this.$refs[id];
        },
        // 滚轮事件 - 放大缩小图纸
        mousewheel(e) {
            const mousePosition = [e.pageX, e.pageY];
            let size = this.zoom * 20;

            if (e.deltaY > 0) {
                size -= 5;
            } else if (e.deltaY < 0) {
                size += 5;
            }

            if (size < 20) {
                size = 20;
                return (true);
            }
            if (size > 80) {
                size = 80;
                return (true);
            }

            this.position = this.position
                .add(-1, mousePosition)
                .mul(size / this.zoom / 20)
                .add(mousePosition)
                .round(1);

            this.zoom = size / 20;
        },
        // 按下右键事件 - 移动图纸
        moveMap(e) {
            if (this.exclusion || e.button !== 2) { return (false); }

            const el = this.$el,
                handler = (e) => this.position = this.position.add(e.bias.mul(this.zoom)),
                stopEvent = { el, name: 'mouseup', which: 'right' },
                afterEvent = () => el.style.cursor = 'default';

            el.style.cursor = 'url(/cur/move_map.cur), crosshair';
            this.EventControler({
                handler,
                stopEvent,
                afterEvent,
                element: this,
                exclusion: true
            });
        }
    }
};
</script>
