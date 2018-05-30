import VNode, { cloneVNode } from '../vnode';

import {
    isNumber,
    isEmpty,
} from '../../utils';

import {
    insert,
} from './helpers';

import {
    invokeCreateHooks,
} from './hooks';

/** 组件初始化 */
function initComponent(vnode: VNode, queue: VNode[]) {
    if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
    }

    vnode.elm = vnode.componentInstance.$el;

    if (isPatchable(vnode)) {
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

/** 创建组件 */
function createComponent(vnode: VNode, queue: VNode[], parentElm: Element, refElm: Element) {
    // call init hook
    vnode.invokeHook('init', vnode);

    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (vnode.componentInstance) {
        initComponent(vnode, queue);
        insert(parentElm, vnode.elm, refElm);
        return true;
    }
    else {
        return false;
    }
}

/** 创建 DOM */
export function createElm(
    vnode: VNode,
    queue: VNode[],
    parentElm?: Element,
    refElm?: Element,
    nested?: boolean,
    ownerArray?: VNode[],
    index?: number,
) {
    if (vnode.elm && ownerArray && isNumber(index)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, queue, parentElm, refElm)) {
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
