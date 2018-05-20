import Component from '../instance';

type NativeCallback = (e: Event) => any;
type Callback = (e: any) => any;

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
    model?: { value: any; callback(val: any): void };
    staticClass?: string;
    class?: string | string[] | { [className: string]: boolean };
    staticStyle?: CSSStyleDeclaration;
    style?: CSSStyleDeclaration[] | CSSStyleDeclaration;
    props?: { [key: string]: any };
    attrs?: { [key: string]: any };
    domProps?: { [key: string]: any };
    hook?: { [key: string]: () => void };
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
    data?: VNodeData;
    children: VNode[];
    text?: string;
    elm?: Node;
    context?: Component;
    key?: string | number;
    componentOptions?: VNodeComponentOptions;
    componentInstance?: Component = undefined;
    parent?: VNode = undefined;
    ns = '';

    raw = false;
    isStatic = false;
    isRootInsert = true;
    isComment = false;
    isCloned = false;
    isOnce = false;

    constructor(
        tag?: string,
        data?: VNodeData,
        children?: VNode[],
        text?: string,
        elm?: Node,
        context?: Component,
        componentOptions?: VNodeComponentOptions,
    ) {
        this.tag = tag;
        this.data = data;
        this.children = children || [];
        this.text = text;
        this.elm = elm;
        this.context = context;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
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
