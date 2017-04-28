<template>
<g class="part" :transform="`matrix(${rotate.join()},${position.join()})`">
    <aspect
        v-for="(info, i) in this.shape.aspect"
        :value="info" :key="i">
    </aspect>
    <g
        v-for="point in points"
        :class="point.class"
        :transform="`translate(${point.position.join()})`">
        <circle></circle>
        <rect></rect>
    </g>
    <!--<text
        transform="matrix(1,0,0,1,20,-2)">
        <tspan dx="0" dy="0">{{texts.label}}</tspan>
        <tspan>{{texts.sub}}</tspan>
        <tspan v-for="param in texts.params" dy="16">{{param.text}}</tspan>
    </text>-->  
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

            shape: {}
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
                class: [
                    'part-point',
                    {
                        'point-open': !this.connect[i],
                        'point-close': !!this.connect[i]
                    }
                ]
            }));
        },
        texts() {
            const id = this.id.split('_'),
                params = this.shape.text
                    .filter((n) => !n.hidden)
                    .map((n, i) => {
                        return {
                            position: [],
                            text: this.params[i] + n.unit
                        };
                    });

            return {
                label: id[0],
                sub: id[1],
                params
            };
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
        setNewEvevt() {
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
        }
    },
    created() {
        // 展开数据
        Object.assign(this, this.value);
        // 外观属性
        this.shape = Electronics[this.type].readOnly;
        // 将旋转矩阵以及坐标实例化
        this.rotate = $M(this.rotate);
        this.position = $P(this.position);
        // 初始化后更新数据
        this.update();
    },
    mounted() {
        // 如果坐标为初始值，说明是新建器件
        if (this.position[0] === 500000) {
            this.setNewEvevt();
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
