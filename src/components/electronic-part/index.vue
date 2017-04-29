<template>
<g
    :class="['part', { 'focus': focus }]"
    :transform="`matrix(${rotate.join()},${position.join()})`">
    <aspect
        v-for="(info, i) in this.shape.aspect"
        :value="info" :key="i">
    </aspect>
    <g
        v-for="point in points"
        :class="['part-point', point.class]"
        :transform="`translate(${point.position.join()})`">
        <circle></circle>
        <rect></rect>
    </g>
    <g
        @mousedown="moveText($event)"
        v-if="this.type !== 'reference_ground'"
        :class="['text-params', textAlign]"
        :transform="`matrix(${invRotate.join()},${textPosition.join()})`">
        <text>
            <tspan>{{ id.split('_')[0] }}</tspan>
            <tspan dx="-3">{{ id.split('_')[1] }}</tspan>
        </text>
        <text
            v-for="(txt, i) in texts"
            :dy="16 * (i + 1)">
            {{txt}}
        </text>
    </g>
</g>
</template>

<script>
import { $P } from '@/libraries/point';
import { $M } from '@/libraries/matrix';
import { Electronics } from './shape';

export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            id: '',
            type: '',
            params: [],
            connect: [],
            rotate: [[1, 0], [0, 1]],
            position: [500000, 500000],

            shape: {},
            focus: false,
            textPosition: $P(0, 0),
            textPlacement: 'bottom'
        };
    },
    computed: {
        points() {
            function product(a, b) {
                return [
                    a[0] * b.get(0, 0) + a[1] * b.get(1, 0),
                    a[0] * b.get(0, 1) + a[1] * b.get(1, 1)
                ];
            }
            return this.shape.points.map((point, i) => ({
                position: product(point.position, this.rotate),
                direction: product(point.direction, this.rotate),
                class: {
                    'point-open': !this.connect[i],
                    'point-close': !!this.connect[i]
                }
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
        textAlign() {
            return /top|bottom/.test(this.textPlacement)
                ? 'text-align-center'
                : `text-align-${this.textPlacement}`;
        }
    },
    methods: {
        update() {
            this.$emit('input', {
                id: this.id,
                type: this.type,
                params: this.params,
                rotate: this.rotate,
                connect: this.connect,
                position: this.position
            });
        },
        newPart() {
            const el = this.$el,
                parentEl = this.$parent.$el,
                handler = (e) => this.position = e.mouse,
                stopEvent = { el: parentEl, name: 'mousedown', which: 'left' },
                afterEvent = () => {
                    el.removeAttribute('opacity');
                    this.position = this.position.round(20);
                };

            el.setAttribute('opacity', '0.4');
            this.$emit('setEvent', {
                handler,
                stopEvent,
                afterEvent,
                element: this,
                exclusion: true
            });
        },
        moveText(e) {
            // 不是左键点击文本
            if (e.button) { return (true); }
            // 左键点击文本，此时启动移动文本事件
            // 当前点击事件不再冒泡
            e.stopPropagation();
            // 设定事件
            const parentEl = this.$parent.$el,
                handler = (e) => this.textPosition = this.textPosition.add(e.bias),
                stopEvent = { el: parentEl, name: 'mouseup', which: 'left' },
                afterEvent = () => this.setText();

            this.focus = true;
            this.$emit('setEvent', {
                handler,
                stopEvent,
                afterEvent,
                element: this,
                exclusion: true
            });
        },
        clickPart() {

        },
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
                    .reduce((pre, next) => pre.disPoint(pend) < next.disPoint(pend)
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
        }
    },
    created() {
        // 展开数据
        Object.assign(this, this.value);
        // 外观属性
        this.shape = Electronics[this.type].readOnly;
        // 器件说明文字位置初始化
        this.textPosition = $P(this.shape.txtLocate);
        this.setText();
        // 将旋转矩阵以及坐标实例化
        this.rotate = $M(this.rotate);
        this.position = $P(this.position);
        // 初始化后更新数据
        this.update();
    },
    mounted() {
        // 如果坐标为初始值，说明是新建器件
        if (this.position[0] === 500000) {
            this.newPart();
        }
    },
    components: {
        'aspect': {
            props: ['value'],
            render(ce) {
                return ce(this.value.name, { attrs: this.value.attribute });
            }
        }
    }
};
</script>
