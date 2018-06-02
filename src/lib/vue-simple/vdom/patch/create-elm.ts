import VNode, { cloneVNode } from '../vnode';

import { registerRef } from '../modules/ref';
import { invokeCreateHooks } from './hooks';
import { insert, checkDuplicateKeys } from './helpers';
import { isNumber, isEmpty, isArray } from '../../utils';

/** 创建子元素 */
function createChildren(vnode: VNode, children: VNode[], queue: VNode[]) {
    if (children.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
            checkDuplicateKeys(children);
        }
        for (let i = 0; i < children.length; ++i) {
            createElm(children[i], queue, vnode.elm, undefined, children, i);
        }
    }
    else if (vnode.text) {
        (vnode.elm!).appendChild(document.createTextNode(vnode.text));
    }
}

/** 组件初始化 */
function initComponent(vnode: VNode, queue: VNode[]) {
    vnode.elm = (vnode.componentInstance!).$el;

    if (vnode.tag) {
        invokeCreateHooks(vnode, queue);
    }
    else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        queue.push(vnode);
    }
}

/** 创建 DOM */
export function createElm(
    vnode: VNode,
    queue: VNode[],
    parentElm?: Element,
    refElm?: Element,
    ownerArray?: VNode[],
    index?: number,
) {
    // This vnode was used in a previous render!
    if (vnode.elm && ownerArray && isNumber(index)) {
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
    }

    // create component
    vnode.invokeHook('init', vnode);
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (vnode.componentInstance) {
        initComponent(vnode, queue);
        insert(parentElm, vnode.elm, refElm);
        return;
    }

    const data = vnode.data;
    const children = vnode.children;
    const tag = vnode.tag;

    if (tag) {
        if (vnode.ns) {
            vnode.elm = document.createElementNS(vnode.ns, tag);
        }
        else {
            vnode.elm = document.createElement(tag);

            if (
                tag === 'select' &&
                vnode.data &&
                vnode.data.attrs &&
                vnode.data.attrs.multiple !== undefined
            ) {
                vnode.elm.setAttribute('multiple', 'multiple');
            }
        }

        createChildren(vnode, children, queue);
        invokeCreateHooks(vnode, queue);
        insert(parentElm, vnode.elm, refElm);
    }
    else if (vnode.isComment) {
        vnode.elm = document.createComment(vnode.text || '') as any;
        insert(parentElm, vnode.elm, refElm);
    }
    else {
        vnode.elm = document.createTextNode(vnode.text || '') as any;
        insert(parentElm, vnode.elm, refElm);
    }
}
