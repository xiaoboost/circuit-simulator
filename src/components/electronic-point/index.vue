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

<script lang="ts">
import { $P } from 'src/lib/point';
import * as assert from 'src/lib/assertion';
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';

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

@Component
export default class ElectronicPoint extends Vue {
    @Prop({ type: Number, default: -1 })
    readonly r: number;

    @Prop({ type: [Array, String], default: '' })
    readonly classList: string | Array<string | { [key: string]: boolean }>;

    @Inject()
    mapStatus: {
        zoom: number;
    };

    radius = 5;
    inner = 0;

    animateTime = 200;
    animateFrom = 0;
    animateTo = 0;

    get actual(): number {
        return (this.r >= 0) ? this.r : this.inner;
    }
    get className(): string {
        return (
            assert.isString(this.classList)
                // 输入是字符串，返回本身
                ? this.classList
                // 输入是数组，解析其 class
                : this.classList.map(
                    (item) =>
                        (assert.isString(item)) ? item : Object.keys(item).filter((key) => item[key]).join(' ')
                ).join(' ')
        );
    }

    mounted() {
        this.mouseleave();
        this.setAnimate(this.actual);
    }

    mouseenter(): void {
        const status = this.className.split(' ')
            .find((item) => radius.hover.hasOwnProperty(item));

        this.inner = status ? radius.hover[status] : 5;
    }

    @Watch('className')
    mouseleave(): void {
        const status = this.className.split(' ')
            .find((item) => radius.normal.hasOwnProperty(item));

        this.inner = status ? radius.normal[status] : 0;
    }

    @Watch('actual')
    setAnimate(value: number): void {
        const circle = this.$refs.circle as HTMLElement;
        const animate = this.$refs.animate as SVGAnimationElement;

        // 确定新的终点值
        this.animateTo = value;
        // 计算当前值
        this.animateFrom = circle.getClientRects()[0].width / this.mapStatus.zoom / 2;
        // 动画启动
        animate.beginElement();
    }
}
</script>
