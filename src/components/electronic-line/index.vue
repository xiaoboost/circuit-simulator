<template>
<g
    :class="['line', { 'focus': focus }]">
    <path :d="way2path"></path>
    <rect
        class="line-rect"
        v-for="(item, i) in pathRects"
        :key="i + 2" :x="item.x" :y="item.y"
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

import { mixClasses } from 'src/lib/utils';
import { $P, Point } from 'src/lib/point';
// import { $M, Matrix } from 'src/lib/matrix';
import * as schMap from 'src/lib/map';
import { clone } from 'src/lib/utils';
import { LineWay, WayMap } from './line-way';

import DrawLine from './draw-line';
import ElectronPoint from 'src/components/electronic-point';

import { LineData, ComponentInterface, DrawingOption } from './types';
import { FindPart, SetDrawEvent, DrawEvent, MapStatus } from 'src/components/drawing-main';

@Component({
    components: {
        ElectronPoint,
    },
})
export default class ElectronicLine extends DrawLine implements ComponentInterface {
    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    private readonly value: LineData;

    readonly type = 'line';
    readonly hash: string;

    // 编译前的初始化
    constructor() {
        super();

        this.id = this.value.id;
        this.hash = this.value.hash;
    }
    created() {
        this.init();

        // 小于 2 个节点，则为新绘制的导线
        if (this.way.length < 2) {
            this.drawEvent(0);
        }
        else {
            this.update();
        }
    }

    /** 当前导线是否高亮 */
    get focus(): boolean {
        return this.mapStatus.linesNow.includes(this.id);
    }
    /** 导线的两个节点属性 */
    get points() {
        return Array(2).fill(false).map((u, i) => ({
            position: this.way.get(-i) ? $P(this.way.get(-i)) : $P(0, 0),
            class: {
                'line-point-open': !this.connect[i],
                'line-point-part': this.matchPart.test(this.connect[i]),
                'line-point-cross': this.matchLine.test(this.connect[i]),
            },
        }));
    }
    /** 路径转为 path 字符串 */
    get way2path() {
        return !this.way.length ? ''　: 'M' + this.way.map((n) => n.join(',')).join('L');
    }
    /** 路径转为 rect 坐标 */
    get pathRects() {
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

    /** 器件属性同步 */
    @Watch('value')
    private init() {
        const data = this.value;
        this.way = LineWay.from(data.way);
        this.connect = data.connect.slice();
    }

    /** 将当前组件数据更新数据至 vuex */
    update() {
        const keys = ['id', 'way', 'hash', 'connect'];

        this.$store.commit(
            'UPDATE_LINE',
            clone(keys.reduce((v, k) => ((v[k] = this[k]), v), {}))
        );
    }

    // 单点绘制模式
    drawEvent(index: number) {
        // 绘制期间，导线终点默认最大半径
        this.pointSize.$set(1, 8);
        // 输入为终点则反转
        if (index === 1) {
            this.reverse();
        }

        const mapData = schMap.getPoint(this.way[0], true)!;

        const mark = mapData.id.split('-')[1];
        const connectPart = this.findPart(mapData.id);
        const direction = connectPart.points[mark].direction;

        this.connect.$set(0, mapData.id);
        connectPart.connect.$set(+mark, this.id);

        this.mapStatus.linesNow.length = 0;
        this.mapStatus.linesNow.push(this.id);

        // 临时变量
        // const temp: DrawingOption['temp'] = {
        //     onPart: undefined,
        //     mouseBais: $P(),
        //     wayMap: new WayMap(),
        // };

        // this.setDrawEvent({
        //     cursor: 'draw_line',
        //     stopEvent: { type: 'mouseup', which: 'left' },
        //     afterEvent: () => {
        //         const endRound = this.way.get(-1).round();
        //         const status = schMap.getPoint(endRound, true);
            
        //         // 起点和终点相等或者只有一个点，则删除当前导线
        //         if (this.way.length < 2 || endRound.isEqual(this.way[0])) {
        //             this.$store.commit('DELETE_LINE', this.id);
        //             return;
        //         }

        //         // 确定终点未被占用
        //         const end = (
        //             endRound
        //                 .around()
        //                 .reduce(
        //                     (pre, next) =>
        //                         end.distance(pre) < end.distance(next) ? pre : next
        //                 )
        //         );

        //         this.update();
        //         // this.markSign();
        //     },
        //     handlers: [
        //         // part mouseenter
        //         {
        //             type: 'mouseenter',
        //             capture: true,
        //             callback: (e: DrawEvent) => {
        //                 const className = e.target.getAttribute('class') || '';
        //                 let part: typeof connectPart;

        //                 if (className.includes('focus-partial')) {
        //                     part = this.findPart(e.target.parentElement!);
        //                 }
        //                 else if (
        //                     className.includes('focus-transparent') &&
        //                     connectPart.$el.contains(e.target)
        //                 ) {
        //                     part = connectPart;
        //                 }
        //                 else {
        //                     return;
        //                 }

        //                 temp.onPart = {
        //                     part,
        //                     status: 'over',
        //                     pointIndex: -1,
        //                 };
        //             },
        //         },
        //         // part mouseleave
        //         {
        //             type: 'mouseleave',
        //             capture: true,
        //             callback: (e: DrawEvent) => {
        //                 const className = e.target.getAttribute('class') || '';

        //                 if (!className.includes('focus-partial')) {
        //                     return;
        //                 }

        //                 if (temp.onPart) {
        //                     temp.onPart.status = 'leave';
        //                 }
        //             },
        //         },
        //         // map mousemove
        //         {
        //             type: 'mousemove',
        //             capture: false,
        //             callback: (e: DrawEvent) => this.drawing({
        //                 direction,
        //                 start: $P(this.way[0]),
        //                 end: e.$position,
        //                 temp: {
        //                     ...temp,
        //                     mouseBais: e.$movement,
        //                 },
        //             }),
        //         },
        //     ],
        // });
    }
};
</script>
