import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';
import { ContextData } from 'src/components/drawing-main';
import { isString, isArray } from 'src/lib/utils';

/** 特定半径 */
const ConstRadius = {
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

type ClassObject = AnyObject<boolean>;
export type ClassInput = string | ClassObject | Array<ClassObject | string>;
export type PointClassName = keyof typeof ConstRadius.normal | keyof typeof ConstRadius.hover;

@Component
export default class ElectronicPoint extends Vue {
    @Prop({ type: Number, default: -1 })
    readonly r!: number;

    @Prop({ type: [Array, String, Object], default: '' })
    readonly classList!: ClassInput;

    @Inject()
    mapStatus!: ContextData['mapStatus'];

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
    get actual() {
        return (this.r >= 0) ? this.r : this.inner;
    }

    /** 当前节点 class 的字符串 */
    get className() {
        /**
         * 解析 class 对象
         * @param {{ [className: string]: boolean }} classObject
         * @return {string} className
         */
        function parseClassObject(classObject: ClassObject) {
            return Object.keys(classObject).filter((key) => classObject[key]).join(' ');
        }

        // 输入是字符串，返回本身
        if (isString(this.classList)) {
            return this.classList;
        }
        // 输入数组
        else if (isArray(this.classList)) {
            return this.classList.map(
                (item) =>
                    isString(item) ? item : parseClassObject(item),
            ).join(' ');
        }
        // 输入对象
        else {
            return parseClassObject(this.classList || {});
        }
    }

    mouseenter() {
        const inners = (
            this.className
                .split(' ')
                .filter((item): item is PointClassName => item in ConstRadius.hover)
                .map((item) => ConstRadius.hover[item])
        );

        this.inner = inners.length > 0 ? Math.min(...inners) : 5;
    }

    @Watch('className')
    mouseleave() {
        const inners = (
            this.className
                .split(' ')
                .filter((item): item is PointClassName => item in ConstRadius.normal)
                .map((item) => ConstRadius.normal[item])
        );

        this.inner = inners.length > 0 ? Math.max(...inners) : 0;
    }

    @Watch('actual')
    setAnimate(value: number) {
        if (!this.$refs.circle) {
            return;
        }

        const rect = this.$refs.circle.getBoundingClientRect();

        // 计算当前值
        this.animateFrom = rect ? rect.width / this.mapStatus.zoom / 2 : 0;
        // 确定新的终点值
        this.animateTo = value;
        // 动画启动
        /**
         * FIXME:
         * typescript 原生库中还未添加这个方法，实际上它是存在的
         *  - @link: https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement#Methods
         */
        (this.$refs.animate as any).beginElement();
    }

    mounted() {
        this.mouseleave();
        this.setAnimate(this.actual);
    }
}
