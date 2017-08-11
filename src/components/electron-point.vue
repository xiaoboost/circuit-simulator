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
        @mouseenter="inner = 5" @mouseleave="inner = 0">
    </rect>
</g>
</template>

<script>
export default {
    props: {
        r: {
            type: Number,
            default: 0,
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
            return this.r ? this.r : this.inner;
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
};
</script>
