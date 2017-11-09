<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        version="2" height="100%" width="100%"
        xmlns="http://www.w3.org/2000/svg"
        @wheel="mousewheel($event)"
        @mousedown.self.stop.right="moveMap">
        <!-- @mousedown.self.stop.left="selectMore($event)" -->
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <!-- <elec-line
                ref="lines"
                v-for="line in lines"
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
            </selections-box> -->
        </g>
    </svg>
</section>
</template>

<script lang="ts">
import Vue from 'vue';
import { $P, Point } from 'src/lib/point';
import * as assert from 'src/lib/assertion';
// import Part from 'src/components/electronic-part';
// import Line from 'src/components/electronic-line';
// import SelectionsBox from 'src/components/selections-box';
import events, { DrawEventSetting, DrawEvent } from './events';
import { PartData, PartComponent } from 'src/components/electronic-part/type';
import { LineData, LineComponent } from 'src/components/electronic-line/type';

type setDrawEvent = (option: DrawEventSetting) => void;

export default Vue.extend({
    name: 'DrawingMain',
    mixins: [events],
    components: {
        // 'elec-part': Part,
        // 'elec-line': Line,
        // 'selections-box': SelectionsBox,
    },
    data() {
        return {
            selections: false,

            partsNow: [],
            linesNow: [],
        };
    },
    computed: {
        zoom(): number {
            return this.$store.state.zoom;
        },
        position(): Point {
            return this.$store.state.position;
        },
        parts(): PartData[] {
            return this.$store.state.Parts;
        },
        lines(): LineData[] {
            return this.$store.state.Lines;
        },
        background(): { 'background-size': string; 'background-position': string; } {
            const size: number = this.zoom * 20,
                biasX: number = this.position[0] % size,
                biasY: number = this.position[1] % size;

            return {
                'background-size': `${size}px`,
                'background-position': `${biasX}px ${biasY}px`,
            };
        },
    },
    provide: {
        findPart(id: string | { id: string } | HTMLElement): PartComponent | undefined {
            const prop = (assert.isElement(id)) ? '$el' : 'id',
                value = (assert.isElement(id) || assert.isString(id)) ? id : id.id;
            
            return (this.$refs.parts as PartComponent[]).find((part) => part[prop] === value);
        },
        findLine(id: string | { id: string } | HTMLElement): LineComponent | undefined {
            const prop = (assert.isElement(id)) ? '$el' : 'id',
                value = (assert.isElement(id) || assert.isString(id)) ? id : id.id;
            
            return (this.$refs.parts as LineComponent[]).find((line) => line[prop] === value);
        },
    },
    methods: {
        // // 清空当前操作器件堆栈
        // clearFocus(args = []) {
        //     this.partsNow.splice(0, this.partsNow.length);
        //     this.linesNow.splice(0, this.linesNow.length);

        //     args = (args instanceof Array) ? args : [args];
        //     for (let i = 0; i < args.length; i++) {
        //         const id = args[i].id || args[i];
        //         if (/^line_\d+$/.test(id)) {
        //             this.linesNow.push(id);
        //         } else {
        //             this.partsNow.push(id.split('-')[0]);
        //         }
        //     }
        // },
        // // 选中器件
        // selectPart(id, button) {
        //     if (!this.partsNow.includes(id)) {
        //         this.clearFocus(id);
        //     }
        //     if (button === 'left') {
        //         // 左键移动
        //         this.moveParts();
        //     } else if (button === 'right') {
        //         // 右键展开菜单
        //         this.contextmenu();
        //     }
        // },
        /** 放大缩小图纸 */
        mousewheel(e: WheelEvent): void {
            const mousePosition = $P(e.pageX, e.pageY);
            let size = this.zoom * 20;

            if (e.deltaY > 0) {
                size -= 5;
            } else if (e.deltaY < 0) {
                size += 5;
            }

            if (size < 20) {
                size = 20;
                return;
            }
            if (size > 80) {
                size = 80;
                return ;
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
        /** 移动图纸 */
        moveMap() {
            const stopEvent = { el: this.$el, type: 'mouseup', which: 'right' },
                handlers = (event: Event & DrawEvent): void => this.$store.commit(
                    'SET_POSITION',
                    this.position.add(event.$movement.mul(this.zoom))
                );

            (<setDrawEvent>this.setDrawEvent)({ handlers, stopEvent, cursor: 'move_map' });
        },
        // selectMore(e) {
        //     const el = this.$el,
        //         stopEvent = { el, type: 'mouseup', which: 'left' },
        //         mouseStart = $P(e.pageX, e.pageY),
        //         start = mouseStart.add(this.position, -1).mul(1 / this.zoom),
        //         handlers = (e) => this.selections.splice(1, 1, e.$mouse),
        //         cursor = (e) => (mouseStart.distance([e.pageX, e.pageY]) > 15) && 'select_box',
        //         afterEvent = () => {
        //             // TODO: 导线多选
        //             const axisX = this.selections.map((point) => point[0]),
        //                 axisY = this.selections.map((point) => point[1]),
        //                 range = [Math.min(...axisX), Math.max(...axisX), Math.min(...axisY), Math.max(...axisY)],
        //                 parts = (this.$refs.parts || [])
        //                     .filter(
        //                         (part) =>
        //                             (part.position[0] > range[0]) && (part.position[0] < range[1]) &&
        //                             (part.position[1] > range[2]) && (part.position[1] < range[3])
        //                     );

        //             this.selections = false;
        //             this.clearFocus(parts);
        //         };

        //     this.clearFocus();
        //     this.selections = [start, start];
        //     this.EventControler({ handlers, stopEvent, afterEvent, cursor });
        // },
        // TODO: 移动选中所有器件
        moveParts() {
            // TODO: 根据器件扩展该选择的导线
        },
        // TODO: 展开右键菜单
        contextmenu() {

        },
    },
});
</script>
