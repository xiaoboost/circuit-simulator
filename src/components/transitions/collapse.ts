import { default as Vue, VNodeChildren } from 'vue';
import { delay } from 'src/lib/utils';

interface TransitionMeta {
    oldOverflow: string | null;
    oldPaddingTop: string | null;
    oldPaddingBottom: string | null;
}

/** 创建 transition 的 css 规则 */
function transitionStyle(time: number) {
    return `height ${time}ms ease-in-out, ` +
        `padding-top ${time}ms ease-in-out, ` +
        `padding-bottom ${time}ms ease-in-out`;
}

/** 创建 Transition 组件钩子 */
function transitionHooks(duration: number) {
    // 注：请不要改动下面所有函数中操作的赋值顺序

    /** 组件缓存数据 */
    const meta: TransitionMeta = {
        oldOverflow: null,
        oldPaddingTop: null,
        oldPaddingBottom: null,
    };

    function beforeEnter(el: HTMLElement) {
        meta.oldPaddingTop = el.style.paddingTop;
        meta.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        el.style.transition = transitionStyle(duration);
    }

    function enter(el: HTMLElement, done: () => void) {
        meta.oldOverflow = el.style.overflow;

        if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + 'px';
            el.style.paddingTop = meta.oldPaddingTop;
            el.style.paddingBottom = meta.oldPaddingBottom;
        }
        else {
            el.style.height = '';
            el.style.paddingTop = meta.oldPaddingTop;
            el.style.paddingBottom = meta.oldPaddingBottom;
        }

        el.style.overflow = 'hidden';

        delay(duration).then(done);
    }

    function afterEnter(el: HTMLElement) {
        el.style.transition = '';
        el.style.height = '';
        el.style.overflow = meta.oldOverflow;
    }

    function beforeLeave(el: HTMLElement) {
        meta.oldPaddingTop = el.style.paddingTop;
        meta.oldPaddingBottom = el.style.paddingBottom;
        meta.oldOverflow = el.style.overflow;

        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
    }

    function leave(el: HTMLElement, done: () => void) {
        if (el.scrollHeight !== 0) {
            el.style.transition = transitionStyle(duration);
            el.style.height = '0';
            el.style.paddingTop = '0';
            el.style.paddingBottom = '0';
        }

        delay(duration).then(done);
    }

    function afterLeave(el: HTMLElement) {
        el.style.transition = '';
        el.style.height = '';
        el.style.overflow = meta.oldOverflow;
        el.style.paddingTop = meta.oldPaddingTop;
        el.style.paddingBottom = meta.oldPaddingBottom;
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
}

export default Vue.extend<Props>({
    name: 'CollapseTransition',
    functional: true,
    props: {
        duration: {
            type: Number,
            default: 200,
        },
    },
    render(h, { props, children }) {
        const data = {
            on: transitionHooks(props.duration),
        };

        return h('transition', data, children as VNodeChildren);
    },
});
