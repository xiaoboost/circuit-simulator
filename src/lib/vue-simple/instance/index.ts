/* tslint:disable member-ordering */

import VNode, { VNodeData, VNodeChildData } from '../vdom/vnode';
import { createElement } from '../vdom/create-element';
import { isFunc } from '../utils';

interface PropData {
    type: object | object[];
    default?: any | (() => object);
    required?: boolean;
    validator?(val: any): boolean;
}

export interface ComponentOptions {
    name?: string;
    components?: { [componentName: string]: typeof Vues };
    props?: { [key: string]: PropData };
    data?: object;
    computed?: object;
    methods?: { [key: string]: (...args: any[]) => any };
}

interface PluginObject {
    install(Vue: typeof Vues): void;
    [key: string]: any;
}

export default class Vues {
    /** 组件选项 */
    static options: ComponentOptions;
    /** Vues 扩展安装 */
    static use(plugin: PluginObject) {
        plugin.install(Vues);
    }

    /** 组件 DOM 元素 */
    $el!: Element;
    /** 当前组件的父元素 */
    $parent?: Vues;
    /** 当前组件的子元素 */
    $children: Vues[] = [];
    /** 组件对应的虚拟 DOM */
    $vnode!: VNode;
    /** 当前元素的引用元素 */
    $refs: { [componentName: string]: Element | Element[] | Vues | Vues[] } = {};
    /** 组件选项 */
    $options!: ComponentOptions;

    /** 渲染函数声明 */
    render!: (h: Vues['$createElement']) => VNode;

    // 生命周期
    beforeMount!: () => void;
    mounted!: () => void;
    beforeDestroy!: () => void;
    destroyed!: () => void;
    beforeUpdate!: () => void;

    /** 事件数据 */
    private _events: { [eventName: string]: Array<(arg?: any) => any> } = {};
    /** 状态数据 */
    private _state: { [stateName: string]: any } = {};
    /** 属性数据 */
    private _props: { [propName: string]: any } = {};

    /**  */
    private _update(vnode: VNode) {

    }

    /** 计算生成当前虚拟 DOM 树 */
    private _render() {
        // render self
        let vnode;

        try {
            vnode = this.render(this.$createElement);
        }
        catch (e) {
            throw new Error(`(render) ${e.message}`);
        }

        // set parent
        vnode.parent = this.$vnode.parent;
        return vnode;
    }

    /** 以当前组件为上下文渲染虚拟节点 */
    $createElement(tag: string, data: VNodeData | VNodeChildData, children?: VNodeChildData) {
        return createElement(this, tag, data, children);
    }
    /** 创建并挂载 DOM */
    $mount(el: string | Element) {
        isFunc(this.beforeMount) && this.beforeMount();

        // 组件更新回调
        const updateComponent = () => {
            this._update(this._render());
        };

        isFunc(this.mounted) && this.mounted();
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
