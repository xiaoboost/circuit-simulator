import Point from 'src/lib/point';
import { State } from 'vuex-class';
import { State as StateTree } from 'src/vuex';
import { Component, Vue } from 'vue-property-decorator';

import EventController from './event-controller';
import PartComponent from '../electronic-part';
import LineComponent from '../electronic-line';

export * from './event-controller';

/** 图纸状态接口 */
export type MapStatus =
    Readonly<Pick<DrawingMain, 'zoom' | 'position'>> &
    Pick<DrawingMain, 'devicesNow' | 'exclusion'>;

@Component({
    components: {
        PartComponent, LineComponent,
    },
    provide(this: DrawingMain) {
        const mapStatus: MapStatus = {} as any;

        Object.defineProperties(mapStatus, {
            devicesNow: {
                enumerable: true,
                get: () => this.devicesNow,
                set: (value: string[]) => this.devicesNow = value.slice(),
            },
            zoom: {
                enumerable: true,
                get: () => this.zoom,
            },
            position: {
                enumerable: true,
                get: () => Point.from(this.position),
            },
            exclusion: {
                enumerable: true,
                get: () => this.exclusion,
                set: (value: boolean) => this.exclusion = value,
            },
        });

        return {
            mapStatus,
            createDrawEvent: this.createDrawEvent,
        };
    },
})
export default class DrawingMain extends Vue {
    zoom = 1;
    position = new Point(0, 0);
    devicesNow: string[] = [];

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

    createDrawEvent(exclusion = true) {
        return new EventController(this, exclusion);
    }

    /** 打开右键菜单 */
    openRightMenu() {
        // ..
    }

    /** 放大缩小图纸 */
    resizeMap(e: WheelEvent) {
        if (this.exclusion) {
            return;
        }

        const mousePosition = new Point(e.pageX, e.pageY);
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
        this
            .createDrawEvent()
            .setHandlerEvent((event) => {
                this.position =
                    this.position.add(event.$movement.mul(this.zoom));
            })
            .setCursor('move_map')
            .setStopEvent({ el: this.$el, type: 'mouseup', which: 'right' })
            .start();
    }
}
