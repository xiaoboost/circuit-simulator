<template>
<section
    :style="background"
    :class="['drawing-main', { 'no-event': !exclusion }]">
    <svg
        version="2" height="100%" width="100%"
        xmlns="http://www.w3.org/2000/svg"
        @wheel.passive="mousewheel($event)"
        @mousedown.self.stop.right.passive="moveMap">
        <!-- @mousedown.self.stop.left="selectMore($event)" -->
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <electronic-line
                ref="lines"
                v-for="line in lines"
                :key="line.hash"
                :value="line">
            </electronic-line>
            <electronic-part
                ref="parts"
                v-for="part in parts"
                :key="part.hash"
                :value="part">
            </electronic-part>
            <!-- <selections-box
                v-if="Boolean(selections)"
                :location="selections">
            </selections-box> -->
        </g>
    </svg>
</section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Events from './events';
import { $P, Point } from 'src/lib/point';
import * as assert from 'src/lib/assertion';
import ElectronicPart from 'src/components/electronic-part';
import ElectronicLine from 'src/components/electronic-line';

import { PartData } from 'src/components/electronic-part/types';
import { LineData } from 'src/components/electronic-line/types';

// import SelectionsBox from 'src/components/selections-box';

@Component({
    components: {
        ElectronicPart,
        ElectronicLine,
        // 'selections-box': SelectionsBox,
    },
    provide(this: DrawingMain) {
        const mapStatus = {};

        Object.defineProperties(mapStatus, {
            partsNow: {
                enumerable: true,
                get: () => this.partsNow,
                set: (value: string[]) => this.partsNow = value,
            },
            linesNow: {
                enumerable: true,
                get: () => this.linesNow,
                set: (value: string[]) => this.linesNow = value,
            },
            zoom: {
                enumerable: true,
                get: () => this.zoom,
            },
            position: {
                enumerable: true,
                get: () => $P(this.position),
            },
            exclusion: {
                enumerable: true,
                get: () => this.exclusion,
            },
        });

        return {
            mapStatus,
            findPart: this.findPart,
            findLine: this.findLine,
            setDrawEvent: this.setDrawEvent,
        };
    },
})
export default class DrawingMain extends Events {
    zoom = 1;
    position = $P();
    partsNow: string[] = [];
    linesNow: string[] = [];

    /** 子组件定义 */
    $refs: {
        parts: ElectronicPart[];
        lines: ElectronicPart[];
    };

    get parts(): PartData[] {
        return this.$store.state.Parts;
    }
    get lines(): LineData[] {
        return this.$store.state.Lines;
    }
    get background(): { 'background-size': string; 'background-position': string; } {
        const size: number = this.zoom * 20,
            biasX: number = this.position[0] % size,
            biasY: number = this.position[1] % size;

        return {
            'background-size': `${size}px`,
            'background-position': `${biasX}px ${biasY}px`,
        };
    }

    /** 搜索器件 */
    findPart(id: string | HTMLElement | { id: string }): ElectronicPart {
        const prop = (assert.isElement(id)) ? '$el' : 'id';
        const value = (assert.isElement(id) || assert.isString(id)) ? id : id.id;
        const part = this.$refs.parts.find((part) => part[prop] === value);

        if (!part) {
            throw new Error('Can not find this part');
        }

        return part;
    }
    /** 搜索导线 */
    findLine(id: string | HTMLElement | { id: string }): ElectronicPart {
        const prop = (assert.isElement(id)) ? '$el' : 'id';
        const value = (assert.isElement(id) || assert.isString(id)) ? id : id.id;
        const line = this.$refs.parts.find((part) => part[prop] === value);

        if (!line) {
            throw new Error('Can not find this line');
        }

        return line;
    }
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
            return;
        }

        this.position = (
            this.position
                .add(mousePosition, -1)
                .mul(size / this.zoom / 20)
                .add(mousePosition)
                .round(1)
        );

        this.zoom = size / 20;
    }
    /** 移动图纸 */
    moveMap() {
        this.setDrawEvent({
            handlers: (event) => {
                this.position = this.position.add(event.$movement.mul(this.zoom));
            },
            stopEvent: { el: this.$el, type: 'mouseup', which: 'right' },
            cursor: 'move_map',
        });
    }
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
    }
    // TODO: 展开右键菜单
    contextmenu() {

    }
}
</script>
