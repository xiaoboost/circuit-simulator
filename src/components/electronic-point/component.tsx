import './component.styl';

import * as assert from 'src/lib/assertion';
import { CreateElement } from 'vue';
import { MapStatus } from 'src/components/drawing-main';
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';

/** 半径变化 */
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
    readonly r!: number;

    @Prop({ type: [Array, String, Object], default: '' })
    readonly classList!: JSX.Vue.VueAttributes['class'];

    @Inject()
    mapStatus!: MapStatus;

    $refs!: {
        circle: SVGCircleElement;
        animate: SVGAnimationElement;
    };

    /** 内部运算的半径 */
    private inner = 0;
    private animateTime = 200;
    private animateFrom = 0;
    private animateTo = 0;

    /** 实际的半径 */
    get actual(): number {
        return (this.r >= 0) ? this.r : this.inner;
    }
    /** 当前节点 class 的字符串 */
    get className(): string {
        /**
         * 解析 class 对象
         * @param {{ [className: string]: boolean }} classObject
         * @return {string} className
         */
        function parseClassObject(classObject: { [className: string]: boolean }) {
            return Object.keys(classObject).filter((key) => classObject[key]).join(' ');
        }

        // 输入是字符串，返回本身
        if (assert.isString(this.classList)) {
            return this.classList;
        }
        // 输入数组
        else if (assert.isArray(this.classList)) {
            return this.classList.map(
                (item) =>
                    assert.isString(item) ? item : parseClassObject(item),
            ).join(' ');
        }
        // 输入对象
        else {
            return parseClassObject(this.classList || {});
        }
    }

    mouseenter() {
        const status = (
            this.className
                .split(' ')
                .find((item) => radius.hover.hasOwnProperty(item))
        );

        this.inner = status ? radius.hover[status] : 5;
    }

    @Watch('className')
    mouseleave() {
        const status = this.className.split(' ')
            .find((item) => radius.normal.hasOwnProperty(item));

        this.inner = status ? radius.normal[status] : 0;
    }

    @Watch('actual')
    setAnimate(value: number): void {
        if (!this.$refs.circle) {
            return;
        }

        // 确定新的终点值
        this.animateTo = value;
        // 计算当前值
        this.animateFrom = this.$refs.circle.getClientRects()[0].width / this.mapStatus.zoom / 2;
        // 动画启动
        this.$refs.animate.beginElement();
    }

    mounted() {
        this.mouseleave();
        this.setAnimate(this.actual);
    }

    private render(h: CreateElement) {
        return <g staticClass='electron-point' class={this.className}>
            <circle ref='circle' cx='0' cy='0'>
                <animate
                    ref='animate' fill='freeze'
                    attributeType='XML' attributeName='r'
                    values={`${this.animateFrom}; ${this.animateTo}`}
                    begin='indefinite' dur={`${this.animateTime}ms`}
                    calcMode='spline'  keyTimes='0; 1' keySplines='.2 1 1 1'>
                </animate>
            </circle>
            <rect
                x='-8.5' y='-8.5' height='17' width='17'
                onMouseenter={this.mouseenter}
                onMouseleave={this.mouseleave}>
            </rect>
        </g>;
    }
}
