import Point from 'src/lib/point';
import { State } from 'vuex-class';
import { State as StateTree } from 'src/vuex';
import { Component, Vue } from 'vue-property-decorator';
import { findPartComponent, findLineComponent } from '../electronic-part/common';

import EventController from './event-controller';
import { default as PartComponent, PartData } from '../electronic-part';
import { default as LineComponent, LineData } from '../electronic-line';

import { isArray } from 'src/lib/utils';

import {
    MoveStatus,
    ElectronicStatus,
    ContextData,
} from './hepler';

export * from './hepler';
export * from './event-controller';

@Component({
    components: {
        PartComponent, LineComponent,
    },
    provide(this: DrawingMain): ContextData {
        const self = this;

        return {
            mapStatus: {
                get zoom() {
                    return self.zoom;
                },
                get position() {
                    return Point.from(self.position);
                },
                get exclusion() {
                    return self.exclusion;
                },
                set exclusion(val: boolean) {
                    self.exclusion = val;
                },
            },
            createDrawEvent(exclusion?: boolean) {
                return new EventController(self, exclusion);
            },
            setSelectDevices(param: string[] | ((devices: string[]) => string[])) {
                self.selectParts = isArray(param) ? param : param(self.selectParts);
            },
        };
    },
})
export default class DrawingMain extends Vue {
    zoom = 1;
    position = new Point(0, 0);

    /** 当前选中的器件 */
    selectParts: string[] = [];
    /** 当前是否正在运行互斥事件 */
    exclusion = false;

    @State('parts')
    partsAll!: StateTree['parts'];

    @State('lines')
    linesAll!: StateTree['lines'];

    $el!: HTMLElement;

    /** 背景图纸样式 */
    get backgroundStyle() {
        const size = this.zoom * 20;
        const biasX = this.position[0] % size;
        const biasY = this.position[1] % size;

        return {
            backgroundSize: `${size}px`,
            backgroundPosition: `${biasX}px ${biasY}px`,
        };
    }
    /** 当前的活动器件 */
    get focusDevices() {
        const focus: AnyObject<boolean> = {};

        this.focusDeviceStatus.forEach(({ elec }) => (focus[elec.id] = true));

        return focus;
    }
    /** 当前的活动器件状态 */
    get focusDeviceStatus() {
        // 当前选中的器件
        const { selectParts } = this;

        // 未选中任何器件则直接返回
        if (selectParts.length === 0) {
            return [];
        }

        /** 当前记录 */
        const result: ElectronicStatus[] = [];
        /** 器件编号与器件的映射表 */
        const eleMap: AnyObject<PartData | LineData> = {};
        /** 当前器件是否被选中 */
        const hasSelected = (id: string) => selectParts.includes(id);
        /** 当前器件是否已经被设定属性 */
        const hasSearched = (id: string) => Boolean(result.find(({ elec }) => elec.id === id));
        /** 搜索输入编号器件的连通性 */
        const lineSearch = (id: string) => {
            /** 搜索堆栈元素 */
            interface StackItem {
                el: PartData | LineData;
                parent: null | StackItem;
            }

            const close: AnyObject<boolean> = {};
            const stack: StackItem[] = [{
                el: eleMap[id],
                parent: null,
            }];

            // 初始化
            let last = stack[0];

            // BFS
            while (stack.length > 0) {
                const open = stack.pop()!;
                const connects = open.el.connect.join(' ').split(' ').filter(Boolean);

                for (let i = 0; i < connects.length; i++) {
                    const id = connects[i];

                    if (close[id]) {
                        continue;
                    }

                    const item = {
                        el: eleMap[id],
                        parent: open,
                    };

                    // 当前器件已经被设置属性或者已经被选中
                    if (hasSearched(id) || hasSelected(id)) {
                        last = item;
                        break;
                    }
                }
            }

            const lastPath = [last.el];

            while (last.parent) {
                last = last.parent;
                lastPath.push(last.el);
            }

            return lastPath;
        };

        // 设置映射表
        this.partsAll.forEach((part) => (eleMap[part.id] = part));
        this.linesAll.forEach((line) => (eleMap[line.id] = line));

        debugger;
        // 搜索所有器件
        selectParts.forEach((id) => {
            // 已经搜索过则跳过
            if (hasSearched(id)) {
                return;
            }

            // 当前连通器件
            lineSearch(id).forEach((item) => {
                result.push({
                    elec: item,
                    status: MoveStatus.Move,
                });
            });
        });

        return result;
    }

    /** 打开右键菜单 */
    openRightMenu() {
        // ..
    }

    // 事件接口
    /** 放大缩小图纸 */
    resizeMap(e: WheelEvent) {
        if (this.exclusion) {
            return;
        }

        const mousePosition = new Point(e.pageX, e.pageY);
        let size = this.zoom * 20;

        if (e.deltaY > 0) {
            size -= 5;
        }
        else if (e.deltaY < 0) {
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
        new EventController(this)
            .setHandlerEvent((event) => {
                this.position =
                    this.position.add(event.$movement.mul(this.zoom));
            })
            .setCursor('move_map')
            .setStopEvent({ el: this.$el, type: 'mouseup', which: 'right' })
            .start();
    }
    /** 移动器件 */
    movePart(id: string) {
        const part = findPartComponent(id);

        // 当前选中的器件不包含点击的器件
        if (!this.selectParts.includes(part.id)) {
            this.selectParts = [part.id];
        }

        // 确定当前所选中的导线和器件状态

        debugger;
        console.log(part);
    }
}
