<template>
<g
    :class="['line', { 'focus': focus }]">
    <path :d="way2path"></path>
    <rect
        class="line-rect"
        v-for="(item, i) in pathRects"
        :key="i" :x="item.x" :y="item.y"
        :height="item.height" :width="item.width">
    </rect>
    <electron-point
        v-for="(point, i) in points"
        :index="i" :key="i" :r="pointSize[i]"
        :class-list="['line-point', point.class]"
        :transform="`translate(${point.position.join()})`">
    </electron-point>
</g>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';

import { $P, Point } from 'src/lib/point';
// import { $M, Matrix } from 'src/lib/matrix';
import * as schMap from 'src/lib/map';
import { clone } from 'src/lib/utils';
import { WayMap } from './line-way';
import { drawSearch } from './line-search';
import ElectronPoint from 'src/components/electronic-point';

import { LineData, DrawingOption } from './types';
import { FindPart, SetDrawEvent, DrawEvent, MapStatus } from 'src/components/drawing-main';

// 器件与导线的 ID 匹配
const rePart = /[a-zA-Z]+_\d+-\d+/;
const reLine = /(line_\d+ ?)+/;

@Component({
    components: {
        ElectronPoint,
    },
})
export default class ElectronicLine extends Vue implements LineData {
    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    private readonly value: LineData;
    /** 设置图纸事件 */
    @Inject()
    private readonly setDrawEvent: SetDrawEvent;
    /** 搜索器件 */
    @Inject()
    private readonly findPart: FindPart;
    /** 图纸相关状态 */
    @Inject()
    private readonly mapStatus: MapStatus;

    readonly type = 'line';
    readonly hash: string;

    id: string;
    way: Point[];
    connect: string[];

    pointSize = [-1, -1];

    created() {
        this.init();

        // 小于 2 个节点，则为新绘制的导线
        if (this.way.length < 2) {
            this.drawing(0);
        }
        else {
            this.update();
        }
    }

    private get way2path() {
        return !this.way.length ? ''　: 'M' + this.way.map((n) => n.join(',')).join('L');
    }
    private get focus(): boolean {
        return this.mapStatus.linesNow.includes(this.id);
    }    
    private get pathRects() {
        const ans = [], wide = 14;

        for (let i = 0; i < this.way.length - 1; i++) {
            const start = this.way[i], end = this.way[i + 1];
            const left = Math.min(start[0], end[0]);
            const top = Math.min(start[1], end[1]);
            const right = Math.max(start[0], end[0]);
            const bottom = Math.max(start[1], end[1]);

            ans.push({
                x: left - wide / 2,
                y: top - wide / 2,
                height: (left === right) ? bottom - top + wide　: wide,
                width: (left === right) ? wide : right - left + wide,
            });
        }

        return ans;
    }
    private get points() {
        return Array(2).fill(false).map((u, i) => ({
            position: this.way.get(-i) ? $P(this.way.get(-i)) : $P(0, 0),
            class: {
                'line-point-open': !this.connect[i],
                'line-point-part': rePart.test(this.connect[i]),
                'line-point-cross': reLine.test(this.connect[i]),
            },
        }));
    }

    /** 器件属性同步 */
    @Watch('value')
    private init() {
        const data = this.value;

        this.id = data.id;
        this.connect = data.connect.slice();
        this.way = data.way.map((point) => $P(point));
    }

    /** 将当前组件数据更新数据至 vuex */
    update() {
        const keys = ['id', 'way', 'connect'];

        this.$store.commit(
            'UPDATE_LINE',
            clone(keys.reduce((v, k) => ((v[k] = this[k]), v), {}))
        );
    }

    // 单点绘制模式
    drawing(index: number) {
        // 绘制期间，导线终点默认最大半径
        this.pointSize.$set(1, 8);
        // 输入为终点则反转
        if (index === 1) {
            this.reverse();
        }

        const mapData = schMap.getPoint(this.way[0], true)!;
        const part = this.findPart(mapData.id);
        const mark = mapData.id.split('-')[1];
        const direction = part.points[mark].direction;
        const map = schMap.outputMap();

        this.mapStatus.linesNow.length = 0;
        this.mapStatus.linesNow.push(this.id);

        // 临时变量
        const temp: DrawingOption['temp'] = {
            onPart: '',
            wayMap: new WayMap(),
            lastVertex: $P(Infinity, Infinity),
        };

        this.setDrawEvent({
            cursor: 'draw_line',
            stopEvent: { type: 'mouseup', which: 'left' },
            afterEvent: () => {
                // this.drawEnd(current);
                this.update();
                // this.markSign();
            },
            handlers: [
                // part mouseenter
                {
                    type: 'mouseenter',
                    capture: true,
                    callback: (e: DrawEvent) => {
                        if (
                            e.target !== e.currentTarget ||
                            !e.target.className.includes('focus-part')
                        ) {
                            return;
                        }

                        debugger;
                        temp.onPart = this.findPart(e.currentTarget);
                    },
                },
                // part mouseleave
                {
                    type: 'mouseleave',
                    capture: true,
                    callback: (e: DrawEvent) => {
                        if (
                            e.target !== e.currentTarget ||
                            !e.target.className.includes('focus-part')
                        ) {
                            return;
                        }

                        debugger;
                        temp.onPart = 'leave';
                    },
                },
                // map mousemove
                {
                    type: 'mousemove',
                    capture: false,
                    callback: (e: DrawEvent) => drawSearch({
                        start: this.way[0],
                        end: e.$position,
                        direction, map, temp,
                    }),
                },
            ],
        });
    }
    // 导线反转
    reverse() {
        this.way.reverse();
        this.connect.reverse();
    }
};
</script>
