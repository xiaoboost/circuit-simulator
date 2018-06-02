import VNode, { cloneVNode } from '../vnode';

import { createElm } from './create-elm';
import { registerRef } from '../modules/ref';
import { removeVnodes } from './helpers';
import { invokeDestroyHook, eleHooks } from './hooks';

const emptyNode = new VNode('', {}, []);

/** 替换虚拟节点 */
export function replaceElm(oldVnode: VNode, vnode: VNode, queue: VNode[]) {
    const oldElm = oldVnode.elm!;
    const parentElm = oldElm.parentElement || undefined;
    const nextElm = oldElm.nextElementSibling || undefined;

    // create new node
    createElm(
        vnode,
        queue,
        parentElm,
        nextElm,
    );

    // update parent placeholder node element, recursively
    let ancestor = vnode.parent;

    while (ancestor) {
        eleHooks.destroy.forEach((fn) => fn(ancestor!));
        ancestor.elm = vnode.elm;

        if (vnode.tag) {
            eleHooks.create.forEach((fn) => fn(emptyNode, ancestor!));
        }
        else {
            registerRef(ancestor);
        }

        ancestor = ancestor.parent;
    }

    // destroy old node
    if (parentElm) {
        removeVnodes(parentElm, [oldVnode], 0, 0);
    }
    else if (oldVnode.tag) {
        invokeDestroyHook(oldVnode);
    }
}
