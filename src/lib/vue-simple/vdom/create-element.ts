import Component from '../instance';

import {
    createComponent,
} from './create-component';

import VNode, {
    VNodeData,
    createTextVNode,
    createEmptyVNode,
} from './vnode';

import {
    isNull,
    isArray,
    isPrimitive,
    isBaseType,
} from 'src/lib/assertion';

import {
    getTagNamespace,
    isReservedTag,
} from 'src/lib/utils';

function applyNS(vnode: VNode, ns: string, force = false) {
    vnode.ns = ns;

    if (vnode.tag === 'foreignObject') {
        ns = '';
        force = true;
    }

    vnode.children.forEach((child) => {
        if (
            child.tag &&
            (
                !child.ns ||
                (force === true && child.tag !== 'svg')
            )
        ) {
            applyNS(child, ns, force);
        }
    });
}

export function createElement(
  context: Component,
  tag: string,
  data: VNodeData | Array<VNode | string>,
  children: Array<VNode | string> = [],
): VNode {
    // 重载
    if (isArray(data)) {
        children = data;
        data = {};
    }

    // 子组件中如果有纯文本，则创建文本组件
    const ChildVNode = children.map((node) =>
        isPrimitive(node) ? createTextVNode(node) : node,
    );

    let vnode: VNode;
    const ns = (context.$vnode && context.$vnode.ns) || getTagNamespace(tag);

    // 是否是内置元素
    if (isReservedTag(tag)) {
        vnode = new VNode(
            tag, data, ChildVNode,
            undefined, undefined, context,
        );
    }
    else if (Boolean(context.$components[tag])) {
        // component
        vnode = createComponent(
            context.$components[tag],
            data, context, ChildVNode, tag,
        );
    }
    else {
        throw new Error(`(render) unknown tag name: ${tag}`);
    }

    if (!isNull(vnode)) {
        ns && applyNS(vnode, ns);
        return vnode;
    }
    else {
        return createEmptyVNode();
    }
}
