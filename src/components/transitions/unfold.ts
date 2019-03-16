import { default as Vue, VNodeChildren } from 'vue';
import { delay } from 'src/lib/utils';

/** 计算两个点的距离 */
function getDiagonal(pointA: number[], pointB: number[]) {
    const x = pointA[0] - pointB[0];
    const y = pointA[1] - pointB[1];
    return Math.sqrt(x * x + y * y);
}

/** 创建 Transition 组件钩子 */
function transitionHooks({ duration, start, afterEnter: afterEnterHook }: Props) {
    // 注：请不要改动下面所有函数中操作的赋值顺序

    /** 动画的临时 DOM 元素 */
    let transitionEl: HTMLDivElement | null = null;
    /** 展开动画的时间 */
    const unfoldTime = duration * 0.7;
    /** 面板渐变显示的时间 */
    const showTime = duration * 0.3;

    function beforeEnter(el: HTMLElement) {
        // 元素初始属性
        el.style.opacity = '0';
        el.style.zIndex = '999';

        // 生成临时 DOM
        transitionEl = document.createElement('div');
        // 设置其初始样式
        transitionEl.style.width = '0px';
        transitionEl.style.height = '0px';
        transitionEl.style.position = 'fixed';
        transitionEl.style.transition = `clip-path ${unfoldTime}ms linear`;

        // 临时元素插入网页
        document.body.appendChild(transitionEl);
    }

    async function enter(el: HTMLElement, done: () => void) {
        // 临时元素的背景色和波形展示面板背景色相同
        transitionEl!.style.backgroundColor = window.getComputedStyle(el).backgroundColor;
        // 临时面板放置在初始点
        Object.assign(transitionEl!.style, start);

        await Vue.nextTick();

        /** 面板的大小和位置 */
        const backgeoundRect = el.getClientRects()[0];
        /** 起始点的位置 */
        const startRect = transitionEl!.getClientRects()[0];
        /** 圆周变换的半径 */
        const maxRadius = getDiagonal(
            [backgeoundRect.left, backgeoundRect.top],
            [startRect.left, startRect.top],
        );

        // 临时 DOM 的宽度和高度是面板起点和变换起点之差的两倍
        transitionEl!.style.width = Math.abs(backgeoundRect.left - startRect.left) * 2 + 'px';
        transitionEl!.style.height = Math.abs(backgeoundRect.top - startRect.top) * 2 + 'px';
        // 临时 DOM 的左上角顶点坐标与面板重合
        transitionEl!.style.left = backgeoundRect.left + 'px';
        transitionEl!.style.top = backgeoundRect.top * 2 + 'px';
        // 裁剪的初始状态为 0
        transitionEl!.style.clipPath = 'circle(0)';

        await delay();

        // 裁剪结束状态为变换半径
        transitionEl!.style.clipPath = `circle(${maxRadius}px)`;

        await delay(unfoldTime);

        // 设置本体元素的动画
        el.style.opacity = '1';
        el.style.transition = `opacity ${showTime}ms linear`;

        await delay(showTime);

        done();
    }

    function afterEnter(el: HTMLElement) {
        // 移除临时元素
        if (transitionEl) {
            document.body.removeChild(transitionEl);
            transitionEl = null;
        }

        // 移除本体元素的临时样式
        el.style.zIndex = null;
        el.style.opacity = null;
        el.style.transition = '';
    }

    function beforeLeave(el: HTMLElement) {

    }

    function leave(el: HTMLElement, done: () => void) {

    }

    function afterLeave(el: HTMLElement) {

    }

    return {
        beforeEnter,
        enter,
        afterEnter,
        beforeLeave,
        leave,
        afterLeave,
    };
}

interface Props {
    /** 动画持续时长 */
    duration: number;
    /** 起始点位置 */
    start: {
        left?: string;
        right?: string;
        top?: string;
        bottom?: string;
    };
    /** 完全展开的回调 */
    afterEnter(): void;
}

export default Vue.extend<Props>({
    name: 'UnfoldTransition',
    functional: true,
    props: {
        duration: {
            type: Number,
            default: 200,
        },
        start: {
            type: Object,
            default: () => ({}),
        },
        afterEnter: {
            type: Function as any,
            default: () => () => {},
        },
    },
    render(h, { props, children }) {
        const data = {
            on: transitionHooks(props),
        };

        return h('transition', data, children as VNodeChildren);
    },
});
