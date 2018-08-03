import { $P } from 'src/lib/point';
import { State } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';

import EventController from './event-controller';
import PartComponent, { PartData } from '../electronic-part/component';
import LineComponent, { LineData } from '../electronic-line/component';

/** 图纸状态接口 */
export type MapStatus =
    Readonly<Pick<DrawingMain, 'zoom' | 'position' | 'exclusion'>> &
    Pick<DrawingMain, 'partsNow' | 'linesNow'>;

@Component({
    components: {
        PartComponent, LineComponent,
    },
    provide(this: DrawingMain) {
        const mapStatus: MapStatus = {} as any;

        Object.defineProperties(mapStatus, {
            partsNow: {
                enumerable: true,
                get: () => this.partsNow,
                set: (value: string[]) => this.partsNow = value.slice(),
            },
            linesNow: {
                enumerable: true,
                get: () => this.linesNow,
                set: (value: string[]) => this.linesNow = value.slice(),
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
            createDrawEvent: this.createDrawEvent,
        };
    },
})
export default class DrawingMain extends Vue {
    zoom = 1;
    position = $P(0, 0);
    partsNow: string[] = [];
    linesNow: string[] = [];

    exclusion = false;

    @State('parts')
    partsAll!: PartData[];

    @State('lines')
    linesAll!: LineData[];

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
