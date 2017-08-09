<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        version="1.1" :xmlns="NS"
        height="100%" width="100%"
        @wheel="mousewheel($event)"
        @mousedown.self.stop.right="moveMap($event)">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <elec-line
                ref="lines"
                v-for="i in lines.length"
                :key="lines[i - 1].id"
                :value.sync="lines[i - 1]"
                :focus="linesNow.includes(lines[i - 1].id)"
                @focus="clearFocus"
                @event="EventControler">
            </elec-line>
            <elec-part
                ref="parts"
                v-for="i in parts.length"
                :key="parts[i - 1].id"
                :value.sync="parts[i - 1]"
                :focus="partsNow.includes(parts[i - 1].id)"
                @focus="clearFocus"
                @event="EventControler">
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
        'elec-line': Line,
    },
    data() {
        return {
            zoom: 1,
            position: $P(0, 0),
            NS: window.$SVG_NS,

            partsNow: [],
            linesNow: [],
        };
    },
    computed: {
        background() {
            const size = this.zoom * 20,
                biasX = this.position[0] % size,
                biasY = this.position[1] % size;
            return {
                'background-size': `${size}px`,
                'background-position': `${biasX}px ${biasY}px`,
            };
        },
        parts() {
            return this.$store.state.collection.Parts;
        },
        lines() {
            return this.$store.state.collection.Lines;
        },
    },
    methods: {
        find(id) {
            const prop = typeof id === 'string' ? 'id' : '$el',
                parts = this.$refs.parts || [],
                lines = this.$refs.lines || [],
                components = parts.concat(lines);

            return components.find((n) => id === n[prop]);
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
        },
        // 选中器件
        selectPart(id, button) {
            if (!this.partsNow.includes(id)) {
                this.clearFocus(id);
            }
            if (button === 'left') {
                // 左键移动
                this.moveParts();
            } else if (button === 'right') {
                // 右键展开菜单
                this.contextmenu();
            }
        },
        // 放大缩小图纸
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
                return (false);
            }
            if (size > 80) {
                size = 80;
                return (false);
            }

            this.position = this.position
                .add(-1, mousePosition)
                .mul(size / this.zoom / 20)
                .add(mousePosition)
                .round(1);

            this.zoom = size / 20;
        },
        // 移动图纸
        moveMap() {
            const el = this.$el,
                stopEvent = { el, type: 'mouseup', which: 'right' },
                handlers = (e) => {
                    this.position = this.position
                        .add(e.$bias.mul(this.zoom));
                };

            this.EventControler({ handlers, stopEvent, cursor: 'move_map' });
        },
        // TODO: 绘制多选框
        selectMore() {
            this.clearFocus();
        },
        // TODO: 移动选中所有器件
        moveParts() {
            // TODO: 根据器件扩展该选择的导线
        },
        // TODO: 展开右键菜单
        contextmenu() {

        },
    },
};
</script>
