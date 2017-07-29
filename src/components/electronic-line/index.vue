<template>
<g :class="['line', { 'focus': focus }]">
    <path :d="way2path"></path>
    <rect
        class="line-rect"
        v-for="(item, i) in pathRects"
        :key="i" :index="i" :x="item.x" :y="item.y"
        :height="item.height" :width="item.width">
    </rect>
    <g
        v-for="(point, i) in points"
        :index="i" :key="i"
        :class="['line-point', point.class, pointSize[i]]"
        :transform="`translate(${point.position.join()})`">
        <circle></circle>
        <rect></rect>
    </g>
</g>
</template>

<script>
import { LineWay } from './line-way';
import { $P } from '@/libraries/point';
// import { $M } from '@/libraries/matrix';
import { lineSearch } from './line-search';
import { schMap } from '@/libraries/maphash';

// 器件 ID 匹配
const rePart = /[a-zA-Z]+_\d+-\d+/;
// 导线 ID 匹配
const reLine = /(line_\d+ ?)+/;

export default {
    mixins: [lineSearch],
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
        focus: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            way: [],
            connect: [],

            pointSize: [],
        };
    },
    computed: {
        way2path() {
            return !this.way.length
                ? ''
                : 'M' + this.way.map((n) => n.join(',')).join('L');
        },
        pathRects() {
            const ans = [], wide = 14;

            for (let i = 0; i < this.way.length - 1; i++) {
                const start = this.way[i], end = this.way[i + 1],
                    left = Math.min(start[0], end[0]),
                    top = Math.min(start[1], end[1]),
                    right = Math.max(start[0], end[0]),
                    bottom = Math.max(start[1], end[1]),
                    rect = { x: left - wide / 2, y: top - wide / 2 };

                ans.push(rect);
                if (left === right) {
                    rect.height = bottom - top + wide;
                    rect.width = wide;
                } else {
                    rect.height = wide;
                    rect.width = right - left + wide;
                }
            }

            return ans;
        },
        points() {
            console.log('line-point change');
            return Array(2).fill(false).map((u, i) => ({
                position: $P(this.way[-i]),
                class: {
                    'point-open': !this.connect[i],
                    'line-point-part': rePart.test(this.connect[i]),
                    'line-point-cross': reLine.test(this.connect[i]),
                },
            }));
        },
        lines() {
            return this.$store.state.collection.Lines;
        },
    },
    methods: {
        update() {
            const keys = ['id', 'way', 'connect'];
            this.$emit(
                'update:value',
                keys.reduce((v, k) => ((v[k] = this[k]), v), {})
            );
        },
        // 是否存在连接
        hasConnect(id) {
            return this.connect.join(' ').includes(id);
        },
        // 查询导线起点/终点
        findConnectIndex(node) {
            if (node.isEqual(this.way[0])) {
                return (0);
            } else if (node.isEqual(this.way.get(-1))) {
                return (1);
            } else {
                return (-1);
            }
        },
        // 是否存在
        isExist() {
            return (this.lines.findIndex((line) => this.id === line.id) !== -1);
        },
        setConnectByWay(index) {
            if (index === undefined) {
                this.setConnectByWay(0);
                this.setConnectByWay(1);
                return;
            }

            // 清除节点临时状态
            this.pointSize[index] = '';

            const node = this.way.get(-1 * index).round(),
                status = schMap.getValueByOrigin(node);

            if (!status) {
                // 当前节点为空
                this.connect[index] = '';
            } else if (status.type === 'part-point') {
                // 节点为器件引脚
                const [id, mark] = status.id.split('-'),
                    part = this.$parent.find(id);

                // 器件引脚的临时状态也要清除
                part.pointSize[mark] = '';
                part.connect[mark] = this.id;
                this.connect[index] = status.id;
            } else if (status.type === 'line-point') {
                // 节点为导线空引脚
                this.merge(status.id);
            } else if (status.type === 'line') {
                // 节点在导线上
                this.hasConnect(status.id)
                    ? this.deleteSelf()
                    : this.split(status.id);
            } else if (status.type === 'cross-point') {
                // 节点在交错节点
                const lines = status.id.split(' ').filter((n) => n !== this.id);

                if (lines.length === 1) {
                    this.merge(lines[0]);
                } else {
                    this.connect[index] = lines.join(' ');
                    lines.forEach((id) => {
                        const line = this.$parent.find(id),
                            mark = line.findConnectIndex(node),
                            connect = lines.filter((n) => n !== line.id);

                        if (mark !== -1) {
                            line.connect[mark] = `${connect.join(' ')} ${this.id}`;
                        }
                    });
                }
            }
        },

        markSign() {

        },
        deleteSign() {

        },

        // 导线反转
        reverse() {
            this.way.reverse();
            this.connect.reverse();
        },
        // 删除连接
        deleteConnect(id) {
            const re = new RegExp(`${id} ?`, 'i');
            this.connect[0].replace(re, '');
            this.connect[1].replace(re, '');
        },
        // 删除导线
        remove() {
            // 导线已经被删除
            if (!this.isExist()) { return; }

            this.deleteSign();
            this.$store.commit('DELETE_LINE', this.id);
            // 删除与当前导线有关的关联信息
            this.connect.forEach((connect) => {
                if (rePart.test(connect)) {
                    const [id, mark] = connect.split('-');
                    this.$parent.find(id).connect[mark] = '';
                } else if (reLine.test(connect)) {
                    const lines = connect.split(' ');
                    if (lines.length === 2) {
                        this.$parent.find(lines[0]).merge(lines[1]);
                    } else {
                        lines.forEach((line) => line.deleteConnect(this.id));
                    }
                }
            });
        },
        // 合并导线，删除输入 id 的导线
        merge(id) {
            const fragment = this.$parent.find(id);

            if (this.way[0].isEqual(fragment.way[0])) {
                this.reverse();
            } else if (this.way[0].isEqual(fragment.way.get(-1))) {
                this.reverse();
                fragment.reverse();
            } else if (this.way.get(-1).isEqual(fragment.way.get(-1))) {
                fragment.reverse();
            }

            fragment.remove();
            this.way.push(...fragment.way);
            this.way.checkWayRepeat();
            this.markSign();
            this.setConnectByWay(1);
        },
        // 切割导线
        split(id, sub) {
            const splited = this.$parent.find(id),
                crossNode = $P(this.way.get(-1 * sub)),
                newLine = { id: this.lines.newId('line_'), connect: [] },
                crossSub = splited.way.findIndex((o, i, arr) => crossNode.isInLine(arr.slice(i, 2)));

            // 拆分路径
            newLine.way = new LineWay(splited.way.slice(crossSub + 1));
            newLine.way.unshift(crossNode);
            splited.way.splice(crossSub + 1, splited.way.length);
            splited.way.push(crossNode);

            // 图纸标志
            this.markSign();
            splited.markSign();
            // TODO: 是否可行？
            this.markSign.call(newLine);

            // 设定新的连接关系
            this.connect[sub] = `${splited.id} ${newLine.id}`;
            splited.setConnectByWay();
            // TODO: 是否可行？
            splited.setConnect.call(newLine);

            // 渲染新器件
            this.$store.commit('PUSH_LINE', newLine);
        },
        setDrawing(current) {
            const stopEvent = { el: this.$parent.$el, type: 'mouseup', which: 'left' },
                mouseenter = (e) => (current.onPart = this.find(e.currentTarget)),
                mouseleaves = () => (current.onPart = false),
                draw = (e) => {
                    current.end = e.$mouse;
                    current.bias = e.$bias;
                    this.drawing(current);
                },
                afterEvent = () => {
                    debugger;
                    this.drawEnd();
                    this.update();
                    this.markSign();
                };

            current.last = {};
            this.$store.commit('LINE_TO_BOTTOM', this.id);
            this.$emit('focus', this.id, this.connect[0]);
            this.$emit('event', { stopEvent, afterEvent, cursor: 'draw_line',
                handlers: [
                    draw,
                    {
                        delegate: true,
                        type: 'mouseenter',
                        callback: mouseenter,
                        select: '.part .focus-part',
                    },
                    {
                        delegate: true,
                        type: 'mouseleaves',
                        callback: mouseleaves,
                        select: '.part .focus-part',
                    },
                ],
            });
        },
    },
    created() {
        this.id = this.value.id;
        this.connect = this.value.connect;

        if (!this.way.length) {
            this.setDrawing(this.value.current);
        } else {
            this.update();
        }
    },
};
</script>
