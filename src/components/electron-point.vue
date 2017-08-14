<template>
<g
    :index="index"
    :transform="transform">
    <circle ref="circle" cx="0" cy="0">
        <animate
            ref="animate" fill="freeze"
            attributeType="XML" attributeName="r"
            :values="`${animateFrom}; ${animateTo}`"
            begin="indefinite" :dur="`${animateTime}ms`"
            calcMode="spline"  keyTimes="0; 1" keySplines=".2 1 1 1">
        </animate>
    </circle>
    <rect
        x="-8.5" y="-8.5" height="17" width="17"
        @mouseenter="mouseenter" @mouseleave="mouseleave">
    </rect>
</g>
</template>

<script>
const radius = {
    normal: {
        'part-point-open': 0,
        'part-point-close': 2,
        'line-point-open': 4,
        'line-point-part': 2,
        'line-point-cross': 2,
    },
    hover: {
        'part-point-open': 5,
        'part-point-close': 2,
        'line-point-open': 8,
        'line-point-part': 2,
        'line-point-cross': 6,
    },
};

export default {
    props: {
        r: {
            type: Number,
            default: -1,
        },
        index: {
            type: Number,
            default: 0,
        },
        transform: {
            type: String,
            default: 'translate(0,0)',
        },
    },
    data() {
        return {
            radius: 5,
            inner: 0,

            animateTime: 200,
            animateFrom: 0,
            animateTo: 0,
        };
    },
    computed: {
        actual() {
            return (this.r >= 0)
                ? this.r
                : this.inner;
        },
        zoom() {
            return this.$store.state.drawing.zoom;
        },
    },
    watch: {
        actual(value) {
            // 确定新的终点值
            this.animateTo = value;
            // 计算当前值
            this.animateFrom = this.$refs.circle.getClientRects()[0].width / this.zoom / 2;
            // 动画启动
            this.$refs.animate.beginElement();
        },
    },
    methods: {
        mouseenter() {
            const status = Array.prototype
                .slice.call(this.$el.classList)
                .find((item) => radius.hover.hasOwnProperty(item));

            this.inner = status ? radius.hover[status] : 5;
        },
        mouseleave() {
            const status = Array.prototype
                .slice.call(this.$el.classList)
                .find((item) => radius.normal.hasOwnProperty(item));

            this.inner = status ? radius.normal[status] : 0;
        },
    },
    mounted() {
        this.mouseleave();
    },
};
</script>
