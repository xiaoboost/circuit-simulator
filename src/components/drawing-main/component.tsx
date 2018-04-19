import './component.styl';

import { CreateElement } from 'vue';
import { Component } from 'vue-property-decorator';

import Events from './events';
import * as assert from 'src/lib/assertion';

import { $P } from 'src/lib/point';
import PartComponent, { PartCore } from 'src/components/electronic-part';
// import { LineCore } from 'src/components/electronic-line';

/** 图纸状态接口 */
export type MapStatus = Combine<
    Readonly<Pick<DrawingMain, 'zoom' | 'position' | 'exclusion'>> &
    Pick<DrawingMain, 'partsNow' | 'linesNow'>
>;

@Component({
    components: {
        PartComponent,
        // ElectronicLine,
        // 'selections-box': SelectionsBox,
    },
    provide(this: DrawingMain) {
        const mapStatus: MapStatus = {} as any;

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
            findPartComponent: this.findPartComponent,
            // findLineComponent: this.findLineComponent,
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
    $refs!: {
        parts: PartComponent[];
        // lines: ElectronicLine[];
    };

    get parts(): PartCore[] {
        return this.$store.state.Parts;
    }
    // get lines(): LineData[] {
    //     return this.$store.state.Lines;
    // }
    get background() {
        const size: number = this.zoom * 20,
            biasX: number = this.position[0] % size,
            biasY: number = this.position[1] % size;

        return {
            backgroundSize: `${size}px`,
            backgroundPosition: `${biasX}px ${biasY}px`,
        };
    }

    /** 搜索器件 */
    findPartComponent(value: string | HTMLElement) {
        const prop = assert.isString(value) ? 'id' : '$el';
        const valueMatch = assert.isString(value)
            ? (value.match(/[a-zA-Z]+_[a-zA-Z0-9]+/)!)[0]
            : value;

        const result = this.$refs.parts.find((part) => part[prop] === valueMatch);

        if (!result) {
            throw new Error('Can not find this part');
        }

        return result;
    }
    /** 搜索导线 */
    // findLineComponent(value: string | HTMLElement): ElectronicLine {
    //     const prop = (assert.isString(value)) ? 'id' : '$el';
    //     const line = this.$refs.lines.find((part) => part[prop] === value);

    //     if (!line) {
    //         throw new Error('Can not find this line');
    //     }

    //     return line;
    // }
    /** 放大缩小图纸 */
    mousewheel(e: WheelEvent) {
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
    moveMap(e: MouseEvent) {
        // stop
        e.stopPropagation();
        // right && self
        if (
            e.button !== 2 ||
            e.target !== e.currentTarget
        ) {
            return;
        }

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

    private render(h: CreateElement) {
        return <section
            id='drawing-main'
            style={this.background}
            class={{ 'no-event': !this.exclusion }}>
            <svg
                version='2' height='100%' width='100%'
                xmlns='http://www.w3.org/2000/svg'
                onWheel={this.mousewheel}
                onMousedown={this.moveMap}>
                <g transform={`translate(${this.position.join(',')}) scale(${this.zoom})`}>
                {
                    //     <electronic-line
                    //         ref="lines"
                    //         v-for="line in lines"
                    //         :key="line.hash"
                    //         :value="line">
                    //     </electronic-line>
                }
                    {this.parts.map((part) =>
                        <part-component
                            refInFor
                            ref='parts'
                            key={part.hash}
                            value={part}>
                        </part-component>,
                    )}
                </g>
            </svg>
        </section>;
    }
}
