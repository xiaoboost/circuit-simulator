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
import { $P } from '@/libraries/point';
// import { $M } from '@/libraries/matrix';
import { lineSearch } from './line-search';
import { schMap } from '@/libraries/maphash';

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
                    'line-point-part': /[a-zA-Z]+_\d+-\d+/.test(this.connect[i]),
                    'line-point-cross': /(line_\d+ ?)+/.test(this.connect[i]),
                },
            }));
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
        setConnectByWay(index) {
            if (index === undefined) {
                this.setConnect(0);
                this.setConnect(1);
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
                this.connect[index] = `${part.id}-${mark}`;
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
        merge(id) {
            // TODO:  合并导线
        },
        split(id) {
            // TODO:  切割导线
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
        }
    },
};
</script>
