import VNode from '../vnode';

import { sameVnode } from './helpers';
import { createElm } from './create-elm';
import { patchVnode } from './patch-vnd';
import { replaceElm } from './replace-elm';
import { invokeDestroyHook, invokeInsertHook } from './hooks';

export default function patch(oldVnode?: VNode, vnode?: VNode, removeOnly?: boolean) {
    if (!vnode) {
        if (oldVnode) {
            invokeDestroyHook(oldVnode);
        }
        return;
    }

    const insertedVnodeQueue: VNode[] = [];

    // empty mount (likely as component), create new root element
    if (!oldVnode) {
        createElm(vnode, insertedVnodeQueue);
    }
    // patch existing root node
    else if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
    }
    // replacing existing element
    else {
        replaceElm(oldVnode, vnode, insertedVnodeQueue);
    }

    invokeInsertHook(vnode, insertedVnodeQueue);
    return vnode.elm;
}
