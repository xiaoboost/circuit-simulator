<template>
<g
    :class="['part', { 'focus': focus }]"
    :transform="`matrix(${rotate.join()},${position.join()})`"
    v-delegate:mousedown-a.left.stop="['.part-point', newLine]"
    v-delegate:mousedown-b.left.stop="['.text-params', moveText]">
    <g class="focus-part">
        <aspect
            v-for="(info, i) in this.shape.aspect"
            v-once :value="info" :key="i">
        </aspect>
        <electron-point
            v-for="(point, i) in points"
            :index="i" :key="i" :r="pointSize[i]"
            :class-list="['part-point', point.class]"
            :transform="`translate(${point.position.join()})`">
        </electron-point>
    </g>
    <g
        v-if="this.type !== 'reference_ground'"
        :class="['text-params', `text-placement-${textPlacement}`]"
        :transform="`matrix(${invRotate.join()},${textPosition.join()})`">
        <text>
            <tspan>{{ id.split('_')[0] }}</tspan>
            <tspan dx="-3">{{ id.split('_')[1] }}</tspan>
        </text>
        <text
            v-for="(txt, i) in texts"
            :dy="16 * (i + 1)" :key="i">{{txt}}
        </text>
    </g>
</g>
</template>

<script>
import Electronics from './shape';
import { $P } from 'src/libraries/point';
import { $M } from 'src/libraries/matrix';
import { mapData, hasMapData } from 'src/libraries/map';

import ElectronPoint from 'src/components/electron-point';

/**
 * 点乘以旋转矩阵
 * 
 * @param {[number, number] | Point} point
 * @param {Matrix} matrix
 * @returns {Point}
 */
function product(point, matrix) {
    return $P(
        point[0] * matrix.get(0, 0) + point[1] * matrix.get(1, 0),
        point[0] * matrix.get(0, 1) + point[1] * matrix.get(1, 1)
    );
}

export default {
    components: {
        'electron-point': ElectronPoint,
        'aspect': {
            props: ['value'],
            render(ce) {
                return ce(this.value.name, { attrs: this.value.attribute });
            },
        },
    },
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
            id: '',
            params: [],
            connect: [],
            rotate: [[1, 0], [0, 1]],
            position: [500000, 500000],

            textPosition: $P(0, 0),
            textPlacement: 'bottom',

            pointSize: [],
        };
    },
    computed: {
        points() {
            return this.shape.points.map((point, i) => ({
                position: product(point.position, this.rotate),
                direction: product(point.direction, this.rotate),
                class: this.connect[i] ? 'part-point-close' : 'part-point-open',
            }));
        },
        invRotate() {
            return this.rotate.inverse();
        },
        texts() {
            return this.params
                .map((v, i) => Object.assign({ value: v }, this.shape.text[i]))
                .filter((n) => !n.hidden)
                .map((n) => (n.value + n.unit).replace(/u/g, 'μ'));
        },
        margin() {
            const box = {}, outter = [], types = ['margin', 'padding'];

            for (let i = 0; i < 2; i++) {
                const type = types[i],
                    data = this.shape[type]
                        .map((n) => product(n, this.rotate));

                box[type] = [
                    [
                        Math.min(data[0][0], data[1][0]),
                        Math.min(data[0][1], data[1][1]),
                    ],
                    [
                        Math.max(data[0][0], data[1][0]),
                        Math.max(data[0][1], data[1][1]),
                    ],
                ];
            }

            for (let i = 0; i < 2; i++) {
                outter[i] = [];
                for (let j = 0; j < 2; j++) {
                    outter[i][j] = box.margin[i][j] + box.padding[i][j];
                }
            }

            return {
                outter,
                inner: box.padding,
            };
        },
    },
    methods: {
        update() {
            const keys = ['id', 'params', 'rotate', 'connect', 'position'];
            this.$emit(
                'update:value',
                keys.reduce((v, k) => ((v[k] = this[k]), v), {})
            );
        },
        // 新建器件
        newPart() {
            const el = this.$el,
                parentEl = this.$parent.$el,
                handlers = (e) => (this.position = e.$mouse),
                stopEvent = { el: parentEl, type: 'mousedown', which: 'left' },
                afterEvent = () => {
                    const node = this.position;
                    this.position = $P(node.round(20)
                        .aroundInf((node) => !this.isCover(node), 20)
                        .reduce((pre, next) =>
                            node.distance(pre) < node.distance(next)
                                ? pre : next
                        ));

                    this.update();
                    this.markSign();
                    el.removeAttribute('opacity');
                };

            el.setAttribute('opacity', '0.4');
            this.$emit('event', {
                handlers,
                stopEvent,
                afterEvent,
                cursor: 'move_part',
            });
        },
        moveText() {
            const parentEl = this.$parent.$el,
                afterEvent = () => this.setText(),
                stopEvent = { el: parentEl, type: 'mouseup', which: 'left' },
                handlers = (e) => (this.textPosition = this.textPosition.add(e.$bias));

            this.$emit('focus', this.id);
            this.$emit('event', {
                handlers,
                stopEvent,
                afterEvent,
                cursor: 'move_part',
            });
        },
        newLine(event) {
            const mark = event.currentTarget.getAttribute('index'),
                lines = this.$store.state.collection.Lines,
                id = lines.newId('line_'),
                point = this.points[mark];

            this.connect.$set(mark, id);
            this.$store.commit('PUSH_LINE', {
                id,
                type: 'line',
                connect: [`${this.id}-${mark}`],
                current: {
                    start: point.position.add(this.position),
                    direction: point.direction,
                },
            });
        },
        // 渲染
        setText() {
            const textHeight = 11,
                spaceHeight = 5,
                len = this.texts.length,
                local = this.shape.txtLocate,
                pend = this.textPosition,
                points = this.points.map((p) => p.direction),
                direction = [$P(0, 1), $P(0, -1), $P(1, 0), $P(-1, 0)]
                    .filter((di) => points.every((point) => !point.isEqual(di)))
                    .map((di) => di.mul(local))
                    .reduce((pre, next) =>
                        pre.distance(pend) < next.distance(pend)
                            ? pre : next
                    );

            if (direction[0]) {
                pend[1] = ((1 - len) * textHeight - len * spaceHeight) / 2;
                if (direction[0] > 0) {
                    // 右
                    pend[0] = local;
                    this.textPlacement = 'right';
                } else {
                    // 左
                    pend[0] = -local;
                    this.textPlacement = 'left';
                }
            } else {
                pend[0] = 0;
                if (direction[1] > 0) {
                    // 下
                    this.textPlacement = 'bottom';
                    pend[1] = textHeight + local;
                } else {
                    // 上
                    this.textPlacement = 'top';
                    pend[1] = -((textHeight + spaceHeight) * len + local);
                }
            }
        },
        // 标记
        markSign() {
            const inner = this.margin.inner,
                position = this.position.floorToSmall();

            // 器件内边距占位
            position.around(inner, (x, y) => {
                debugger;
                mapData({
                    point: $P(x, y),
                    id: this.id,
                    type: 'part',
                }).setMap();
            });
            // 器件管脚距占位
            this.points.forEach((point, i) => {
                mapData({
                    connect: [],
                    type: 'part-point',
                    id: `${this.id}-${i}`,
                    point: point.position
                        .floorToSmall()
                        .add(position),
                }).setMap();
            });
        },
        deleteSign() {
            const inner = this.margin.inner,
                position = this.position.floorToSmall();

            // 删除器件内边距占位
            position.around(inner, (x, y) => mapData([x, y]).deleteDate());
            // 删除器件引脚占位
            this.points.forEach((node) => mapData(node.floorToSmall().add(position)).deleteDate());
        },
        // 查询操作
        // 器件在当前坐标是否被占用
        isCover(position = this.position) {
            const coverHash = {}, margin = this.margin;

            let label = false;
            position = $P(position).floorToSmall();
            // 检查器件管脚，管脚点不允许存在任何元素
            for (let i = 0; i < this.points.length; i++) {
                const node = position.add(this.points[i].position.floorToSmall());
                if (hasMapData(node)) {
                    return (true);
                }
                coverHash[node.join(',')] = true;
            }

            // 扫描内边距，内边距中不允许存在任何元素
            position.around(margin.inner, (x, y, stop) => {
                hasMapData([x, y])
                    ? (label = true, stop())
                    : coverHash[`${x},${y}`] = true;
            });
            if (label) {
                return (true);
            }

            // 扫描外边距
            position.around(margin.outter, (x, y, stop) => {
                // 跳过内边距
                if (coverHash[`${x},${y}`]) {
                    return (false);
                }
                // 外边框为空
                if (!hasMapData([x, y])) {
                    return (true);
                }
                // 外边框不是由器件占据
                if (mapData([x, y]).type !== 'part') {
                    return (true);
                }

                // 校验相互距离
                const part = this.$parent.find(status.id),
                    another = part.margin.outter,
                    distance = position.add(part.position.floorToSmall(), -1);

                // 分别校验 x、y 轴
                for (let i = 0; i < 2; i++) {
                    if (distance[i] !== 0) {
                        const sub = distance[i] > 0 ? 0 : 1,
                            diff_x = Math.abs(distance[i]),
                            limit_x = Math.abs(margin.outter[sub][i]) + Math.abs(another[1 - sub][i]);

                        if (diff_x < limit_x) {
                            label = true;
                            stop();
                        }
                    }
                }
            });

            return (label);
        },
    },
    created() {
        // 展开数据
        Object.assign(this, this.value);
        // 外观属性
        this.shape = Electronics[this.type].readOnly;
        this.textPosition = $P(this.shape.txtLocate);
        // point 相关属性初始化
        const pointNum = this.shape.points.length;
        this.connect.push(...Array(pointNum).fill(''));
        this.pointSize.push(...Array(pointNum).fill(-1));
        // 将旋转矩阵以及坐标实例化
        this.rotate = $M(this.rotate);
        this.position = $P(this.position);
        // 初始化后更新数据
        this.update();
        // 器件说明初始化
        this.setText();
    },
    mounted() {
        // 如果坐标为初始值，说明是新建器件
        if (this.position[0] === 500000) {
            this.newPart();
        }
    },
};
</script>
