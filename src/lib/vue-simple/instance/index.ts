export default class Vues {
    /** Vues 扩展安装 */
    static use(install: (vm: typeof Vues) => void) {
        install(Vues);
    }

    /** 组件 DOM 元素 */
    $el!: Element;
    /** 当前组件的父元素 */
    $parent!: Vues;
    /** 当前组件的子元素 */
    $children: Vues[] = [];
    /** 当前元素的引用元素 */
    $refs: { [componentName: string]: Element | Element[] | Vues | Vues[] } = {};

    /** 渲染函数声明 */
    render!: () => Element;

    /** 当前组件的事件列表 */
    private _events: { [eventName: string]: Array<(arg?: any) => any> } = {};

    constructor() {
        // ..
    }

    /** 创建并挂载 DOM */
    $mount(el: string | Element) {
        // TODO: 创建 $el
        return this;
    }

    /** 绑定事件 */
    $on(eventName: string | string[], fn: (arg?: any) => any) {
        if (Array.isArray(eventName)) {
            eventName.forEach((event) => this.$on(event, fn));
        }
        else {
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }

            this._events[eventName].push(fn);
        }

        return this;
    }
    /** 绑定单次事件 */
    $once(eventName: string, fn: (arg?: any) => any) {
        const on = () => {
            this.$off(eventName, on);
            fn.apply(this, arguments);
        };

        this.$on(eventName, on);
        return this;
    }
    /** 解除事件绑定 */
    $off(eventName?: string | string[], fn?: (arg?: any) => any) {
        // 删除所有事件
        if (!eventName) {
            this._events = Object.create(null);
        }
        // 指定事件名数组
        else if (Array.isArray(eventName)) {
            eventName.forEach((event) => this.$off(event, fn));
        }
        // 指定某事件
        else {
            const cbs = this._events[eventName];

            if (!cbs) {
                return this;
            }

            if (!fn) {
                delete this._events[eventName];
                return this;
            }

            const fnIndex = cbs.findIndex((cb) => cb === fn);
            if (fnIndex !== -1) {
                cbs.splice(fnIndex, 1);
            }
        }

        return this;
    }
    /** 触发事件 */
    $emit(eventName: string, args: any) {
        const cbs = this._events[eventName];

        if (cbs) {
            cbs.forEach((fn) => fn.apply(this, args));
        }

        return this;
    }
}
