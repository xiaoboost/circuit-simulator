import Component from '../instance';

type NativeCallback = (e: Event) => any;
type Callback = (e: any) => any;

export type VNodeChildData = Array<string | VNode>;

export interface VnodeHook {
    prepatch?(oldVnode: VNode, vnode: VNode): void;
    update?(oldVnode: VNode, vnode: VNode): void;
    postpatch?(oldVnode: VNode, vnode: VNode): void;
    insert?(vnode: VNode): void;
    create?(oldVnode: VNode, vnode: VNode): void;
    init?(vnode: VNode): void;
    remove?(vode: VNode, rm: () => void): void;
    destroy?(vnode: VNode): void;
}

type SingleParameterHookKey = 'init' | 'insert' | 'destroy';
type MultipleParameterHookKey = Exclude<keyof VnodeHook, SingleParameterHookKey>;

export interface VNodeComponentOptions {
    Ctor: typeof Component;
    propsData?: object;
    listeners?: object;
    children?: VNode[];
    tag?: string;
}

export interface VNodeData {
    key?: string | number;
    ref?: string;
    tag?: string;
    is?: string;
    refInFor?: boolean;
    model?: { value: any; callback(val: any): void };
    staticClass?: string;
    class?: string | string[] | { [className: string]: boolean };
    staticStyle?: CSSStyleDeclaration;
    style?: CSSStyleDeclaration[] | CSSStyleDeclaration;
    props?: { [key: string]: any };
    attrs?: { [key: string]: any };
    domProps?: { [key: string]: any };
    hook?: VnodeHook;
    on?: { [key: string]: Callback | Callback[] };
    nativeOn?: { [key: string]: NativeCallback | NativeCallback[] };
    show?: boolean;
    directives?: VNodeDirective[];
}

export interface VNodeDirective {
    readonly name: string;
    readonly value: any;
    readonly oldValue: any;
    readonly expression: any;
    readonly arg: string;
    readonly modifiers: { [key: string]: boolean };
}

export default class VNode {
    tag?: string;
    data: VNodeData;
    children: VNode[];
    text?: string;
    elm?: Element;
    context?: Component;
    key?: string | number;
    componentOptions?: VNodeComponentOptions;
    componentInstance?: Component;
    parent?: VNode;
    ns?: string;

    raw = false;
    isStatic = false;
    isComment = false;
    isCloned = false;
    isOnce = false;

    constructor(
        tag?: string,
        data?: VNodeData,
        children?: VNode[],
        text?: string,
        elm?: Element,
        context?: Component,
        componentOptions?: VNodeComponentOptions,
    ) {
        this.tag = tag;
        this.data = data || {};
        this.children = children || [];
        this.text = text;
        this.elm = elm;
        this.context = context;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
    }

    invokeHook(hookName: 'remove', vnode: VNode, rm: () => void): boolean;
    invokeHook(hookName: SingleParameterHookKey, vnode: VNode): boolean;
    invokeHook(hookName: MultipleParameterHookKey, oldVnode: VNode, vnode: VNode): boolean;
    invokeHook(hookName: keyof VnodeHook, ...vnodes: any[]) {
        if (
            this.data &&
            this.data.hook &&
            this.data.hook[hookName]
        ) {
            (this.data.hook[hookName] as any)(...vnodes);
            return true;
        }
        else {
            return false;
        }
    }
}

/**
 * 创建空节点
 * @param {string} text 文本
 */
export function createEmptyVNode(text = '') {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
}

/**
 * 创建文本节点
 * @param {string | number} val 文本
 */
export function createTextVNode(text: string | number) {
    return new VNode(undefined, undefined, undefined, String(text));
}

/**
 * 复制节点
 * @param {VNode} vnode 待复制的节点
 * @return {VNode}
 */
export function cloneVNode(vnode: VNode) {
    const cloned = new VNode(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
    );

    cloned.ns = vnode.ns;
    cloned.key = vnode.key;
    cloned.isCloned = true;
    cloned.isStatic = vnode.isStatic;
    cloned.isComment = vnode.isComment;

    return cloned;
}
