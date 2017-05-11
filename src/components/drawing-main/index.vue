<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        height="100%"
        width="100%"
        @mousewheel="mousewheel($event)"
        @mousedown.self.stop="mousedownSch($event)">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <elec-line
                v-for="i in lines.length"
                v-model="lines[i - 1]"
                :ref="lines[i - 1].id"
                :key="lines[i - 1].id"
                :focus="partsNow.includes(lines[i - 1].id)"
                @setEvent="EventControler">
            </elec-line>
            <elec-part
                v-for="i in parts.length"
                v-model="parts[i - 1]"
                :ref="parts[i - 1].id"
                :key="parts[i - 1].id"
                :focus="partsNow.includes(parts[i - 1].id)"
                @setEvent="EventControler"
                @on-text="clearFocus">
            </elec-part>
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
            position: $P(0, 0),

            partsNow: [],
            linesNow: []
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
            return this.$refs[id][0];
        },
        // 对图纸空白处按下鼠标
        mousedownSch(e) {
            if (!e.button) {
                this.selectMore();
            } else if (e.button === 2) {
                this.moveMap();
            }
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
        // 空白处按下右键事件 - 移动图纸
        moveMap(e) {
            if (this.exclusion) { return (false); }

            const el = this.$el,
                handler = (e) => this.position = this.position
                    .add(e.bias.mul(this.zoom)),
                stopEvent = { el, name: 'mouseup', which: 'right' };

            this.EventControler({
                handler,
                stopEvent,
                exclusion: true,
                cursor: 'move_map'
            });
        },
        // 空白处按下左键事件 - 绘制多选框
        selectMore() {
            this.clearFocus();
        },
        // 清空当前操作器件堆栈
        clearFocus(...args) {
            this.partsNow.splice(0, this.partsNow.length);
            this.linesNow.splice(0, this.linesNow.length);

            for (let i = 0; i < args.length; i++) {
                const id = args[i];
                if (/^line_\d+$/.test(id)) {
                    this.linesNow.push(id);
                } else {
                    this.partsNow.push(id);
                }
            }
        }
    }
};
</script>
