<template>
<g :class="className">
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
        classList: {
            type: Array || String,
            default: () => [],
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
        className() {
            // 输入是字符串，直接其本身
            if (typeof this.classList === 'string') {
                return this.classList;
            }
            // 是数组，解析其 class
            return this.classList.map((item) => (typeof item === 'string')
                ? item
                : Object.keys(item).filter((key) => item[key]).join(' ')
            ).join(' ');
        },
    },
    watch: {
        actual: 'setAnimate',
        className: 'mouseleave',
    },
    methods: {
        mouseenter() {
            if (this.r >= 0) { return; }

            const status = this.className.split(' ')
                .find((item) => radius.hover.hasOwnProperty(item));

            this.inner = status ? radius.hover[status] : 5;
        },
        mouseleave() {
            if (this.r >= 0) { return; }

            const status = this.className.split(' ')
                .find((item) => radius.normal.hasOwnProperty(item));

            this.inner = status ? radius.normal[status] : 0;
        },
        setAnimate(value) {
            // 确定新的终点值
            this.animateTo = value;
            // 计算当前值
            this.animateFrom = this.$refs.circle.getClientRects()[0].width / this.zoom / 2;
            // 动画启动
            this.$refs.animate.beginElement();
        },
    },
    mounted() {
        this.mouseleave();
        this.setAnimate(this.actual);
    },
};
</script>
