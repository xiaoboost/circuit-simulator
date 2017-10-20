<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        version="2" :xmlns="NS"
        height="100%" width="100%"
        @wheel="mousewheel($event)"
        @mousedown.self.stop.right="moveMap($event)"
        @mousedown.self.stop.left="selectMore($event)">
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
            <selections-box
                v-if="Boolean(selections)"
                :location="selections">
            </selections-box>
        </g>
    </svg>
</section>
</template>

<script>
import Part from 'src/components/electronic-part';
import Line from 'src/components/electronic-line';
import SelectionsBox from 'src/components/selections-box';

import Event from './event-controler';
import { $P } from 'src/lib/point';

export default {
    name: 'DrawingMain',
    mixins: [Event],
    components: {
        'elec-part': Part,
        'elec-line': Line,
        'selections-box': SelectionsBox,
    },
    data() {
        return {
            NS: this.$store.state.$SVG_NS,
            selections: false,

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
        zoom() {
            return this.$store.state.drawing.zoom;
        },
        position() {
            return this.$store.state.drawing.position;
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
            const prop = (typeof id === 'string') ? 'id' : '$el',
                item = (prop === 'id') ? id.split('-')[0] : id,
                parts = this.$refs.parts || [],
                lines = this.$refs.lines || [],
                components = parts.concat(lines);

            return components.find((n) => item === n[prop]);
        },
        // 清空当前操作器件堆栈
        clearFocus(args = []) {
            this.partsNow.splice(0, this.partsNow.length);
            this.linesNow.splice(0, this.linesNow.length);

            args = (args instanceof Array) ? args : [args];
            for (let i = 0; i < args.length; i++) {
                const id = args[i].id || args[i];
                if (/^line_\d+$/.test(id)) {
                    this.linesNow.push(id);
                } else {
                    this.partsNow.push(id.split('-')[0]);
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

            this.$store.commit(
                'SET_POSITION',
                this.position
                    .add(mousePosition, -1)
                    .mul(size / this.zoom / 20)
                    .add(mousePosition)
                    .round(1)
            );

            this.$store.commit('SET_ZOOM', size / 20);
        },
        // 移动图纸
        moveMap() {
            const el = this.$el,
                stopEvent = { el, type: 'mouseup', which: 'right' },
                handlers = (e) => this.$store.commit(
                    'SET_POSITION',
                    this.position
                        .add(e.$bias.mul(this.zoom))
                );

            this.EventControler({ handlers, stopEvent, cursor: 'move_map' });
        },
        selectMore(e) {
            const el = this.$el,
                stopEvent = { el, type: 'mouseup', which: 'left' },
                mouseStart = $P(e.pageX, e.pageY),
                start = mouseStart.add(this.position, -1).mul(1 / this.zoom),
                handlers = (e) => this.selections.splice(1, 1, e.$mouse),
                cursor = (e) => (mouseStart.distance([e.pageX, e.pageY]) > 15) && 'select_box',
                afterEvent = () => {
                    // TODO: 导线多选
                    const axisX = this.selections.map((point) => point[0]),
                        axisY = this.selections.map((point) => point[1]),
                        range = [Math.min(...axisX), Math.max(...axisX), Math.min(...axisY), Math.max(...axisY)],
                        parts = (this.$refs.parts || [])
                            .filter(
                                (part) =>
                                    (part.position[0] > range[0]) && (part.position[0] < range[1]) &&
                                    (part.position[1] > range[2]) && (part.position[1] < range[3])
                            );

                    this.selections = false;
                    this.clearFocus(parts);
                };

            this.clearFocus();
            this.selections = [start, start];
            this.EventControler({ handlers, stopEvent, afterEvent, cursor });
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
