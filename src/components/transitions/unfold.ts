import { default as Vue, VNodeChildren } from 'vue';
import { delay } from 'src/lib/utils';

/** 创建 Transition 组件钩子 */
function transitionHooks({ duration, start, end, color, afterEnter: afterEnterHook }: Props) {
    // 注：请不要改动下面所有函数中操作的赋值顺序

    /** 动画的临时 DOM 元素 */
    let transitionEl: HTMLDivElement | null = null;

    function beforeEnter(el: HTMLElement) {
        // 元素初始属性
        el.style.width = '0px';
        el.style.height = '0px';

        // 生成临时 DOM
        transitionEl = document.createElement('div');
        // 设置其初始样式
        transitionEl.style.width = '1px';
        transitionEl.style.height = '1px';
        transitionEl.style.left = start[0];
        transitionEl.style.top = start[1];
        transitionEl.style.position = 'fixed';
        transitionEl.style.backgroundColor = color;

        // 临时元素插入网页
        el.appendChild(transitionEl);
    }

    async function enter(el: HTMLElement, done: () => void) {

    }

    function afterEnter(el: HTMLElement) {

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
    start: string[];
    /** 终止时的大小 */
    end: string[];
    /** 背景颜色 */
    color: string;
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
            type: Array,
            default: () => ['0px', '0px'],
        },
        end: {
            type: Array,
            default: () => ['100%', '100%'],
        },
        color: {
            type: String,
            default: 'transparent',
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
