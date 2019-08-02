import Point from 'src/lib/point';
import { State } from 'vuex-class';
import { State as StateTree } from 'src/vuex';
import { Component, Vue } from 'vue-property-decorator';
import { findPartComponent } from '../electronic-part/common';

import EventController from './event-controller';
import { MenuAction, MenuMode, getMenu } from './context-menu';
import { default as PartComponent, PartData } from '../electronic-part';
import { default as LineComponent, LineData } from '../electronic-line';

import { isArray } from 'src/lib/utils';

export * from './event-controller';

/** 组件上下文结构 */
export interface ContextData {
    /** 当前图纸信息 */
    mapStatus: {
        exclusion: boolean;
        readonly zoom: number;
        readonly position: Point;
    };

    /** 创建图纸事件 */
    createDrawEvent(exclusion?: boolean): EventController;
    /** 设置当前选中器件 */
    setSelectDevices(param: string[] | ((devices: string[]) => string[])): void;
}

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

    /** 当前是否正在运行互斥事件 */
    exclusion = false;
    /** 当前选中的器件 */
    selectParts: string[] = [];
    /** 多选框当前坐标 */
    selectionPoints: Point[] = [];

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
        const { focusDeviceStatus: devices } = this;
        const focus: AnyObject<boolean> = {};

        if (!devices) {
            return focus;
        }

        devices.move.forEach(({ id }) => (focus[id] = true));
        devices.transform.forEach(({ id }) => (focus[id] = true));

        return focus;
    }
    /** 当前的活动器件状态 */
    get focusDeviceStatus() {
        // 当前选中的器件
        const { selectParts } = this;

        // 未选中任何器件则直接返回
        if (selectParts.length === 0) {
            return;
        }

        // 器件和导线
        type Elec = PartData | LineData;

        /** 整体移动的器件 */
        const move: Elec[] = [];
        /** 变形的导线 */
        const transform: Elec[] = [];

        /** 器件编号与器件的映射表 */
        const eleMap: AnyObject<Elec> = {};
        /** 当前器件是否被选中 */
        const hasSelected = (id: string) => selectParts.includes(id);
        /** 当前器件是否已经被设定属性 */
        const hasSearched = (id: string) => Boolean(move.find((item) => item.id === id));
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

        // 搜索所有器件
        selectParts.forEach((id) => {
            // 已经搜索过则跳过
            if (hasSearched(id)) {
                return;
            }

            // 当前连通器件
            lineSearch(id).forEach((item) => move.push(item));
        });

        move.forEach(({ connect }) => {
            connect
                .join(' ').split(' ')
                .filter(Boolean)
                .filter((item) => {
                    const find = ({ id }: Elec) => id === item;
                    return !move.find(find) && !transform.find(find);
                })
                .map((id) => eleMap[id])
                .forEach((item) => transform.push(item));
        });

        return {
            move,
            transform,
        };
    }
    /** 当前选择框顶点坐标字符串属性 */
    get selectionBoxPoints() {
        if (this.selectionPoints.length === 0) {
            return '';
        }

        const { selectionPoints: [start, end] } = this;
        const top = start[1], bottom = end[1], left = start[0], right = end[0];

        return `${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom}`;
    }
    /** 右键菜单列表 */
    get contextMenus() {
        const { selectParts: parts, linesAll } = this;

        // 没有选中器件
        if (parts.length === 0) {
            return getMenu(MenuMode.space);
        }

        // 当前选中的全部是导线
        if (parts.every((id) => linesAll.find((line) => line.id === id))) {
            return getMenu(MenuMode.line);
        }

        // 只有一个器件
        if (parts.length === 1) {
            return getMenu(MenuMode.singlePart);
        }
        // 多个器件
        else {
            return getMenu(MenuMode.multipleParts);
        }
    }

    /** 打开右键菜单 */
    openRightMenu() {
        // ..
    }
    /** 点击右键菜单事件 */
    contextHandler(action: MenuAction) {
        switch (action) {
            case MenuAction.edit:
                break;
            case MenuAction.copy:
                break;
            default:
        }
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

        // // 当前所选中的导线和器件状态
        // const { move, transform } = this.focusDeviceStatus!;

        // // 移动事件
        // const moveParts = () => {

        // };

        new EventController(this)
            .setCursor('')
            .start();
        // debugger;
        // console.log(move);
        // console.log(transform);
    }
    /** 多选框事件 */
    async startSelection() {
        // 初次运行时鼠标的坐标
        let firstPointReal: Point;
        // 初次运行时图纸的坐标
        let firstPointInMap: Point;
        // 是否绘制多选框
        let draw = false;

        const event = new EventController(this)
            .setCursor(() => draw ? 'select_box' : 'default')
            .setStopEvent({ el: this.$el, type: 'mouseup', which: 'left' })
            .setHandlerEvent((event) => {
                if (!firstPointReal) {
                    firstPointInMap = event.$position;
                    firstPointReal = new Point(event.pageX, event.pageY);
                }

                // 鼠标坐标大于 70 才开始绘制多选框
                if (!draw && firstPointReal.distance([event.pageX, event.pageY]) > 16) {
                    draw = true;
                }

                // 不绘制则直接退出
                if (!draw) {
                    return;
                }

                // 记录多选框的顶点坐标
                const top = Math.min(firstPointInMap[1], event.$position[1]);
                const bottom = Math.max(firstPointInMap[1], event.$position[1]);
                const left = Math.min(firstPointInMap[0], event.$position[0]);
                const right = Math.max(firstPointInMap[0], event.$position[0]);

                this.selectionPoints = [new Point(left, top), new Point(right, bottom)];
            });

        await event.start();

        // 取消多选框
        this.selectionPoints = [];
    }
}
