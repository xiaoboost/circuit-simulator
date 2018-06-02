import VNode, { cloneVNode } from '../vnode';

import { createElm } from './create-elm';
import { invokeCreateHooks, invokeUpdateHooks } from './hooks';

import {
    checkDuplicateKeys,
    addVnodes,
    removeVnodes,
    sameVnode,
} from './helpers';

function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number) {
    let i, key;
    const map: { [key: string]: number } = {};

    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (key) {
            map[key] = i;
        }
    }

    return map;
}

function findIdxInOld(node: VNode, oldCh: VNode[], start: number, end: number) {
    for (let i = start; i < end; i++) {
        const ch = oldCh[i];
        if (ch && sameVnode(node, ch)) {
            return i;
        }
    }
}

/** 更新子元素 */
function updateChildren(
    parentElm: Element,
    oldCh: VNode[],
    newCh: VNode[],
    queue: VNode[],
    removeOnly?: boolean,
) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!oldStartVnode) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        }
        else if (!oldEndVnode) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, queue);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, queue);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, queue);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];

            canMove &&
                parentElm.insertBefore(oldStartVnode.elm!, (oldEndVnode.elm!).nextElementSibling);
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, queue);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];

            canMove &&
                parentElm.insertBefore(oldEndVnode.elm!, oldStartVnode.elm!);
        }
        else {
            if (!oldKeyToIdx) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = newStartVnode.key
                ? oldKeyToIdx[newStartVnode.key]
                : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

            if (!idxInOld) { // New element
                createElm(
                    newStartVnode,
                    queue,
                    parentElm,
                    oldStartVnode.elm,
                    newCh,
                    newStartIdx,
                );
            }
            else {
                vnodeToMove = oldCh[idxInOld];
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, queue);
                    oldCh[idxInOld] = undefined as any;
                    canMove && parentElm.insertBefore(vnodeToMove.elm!, oldStartVnode.elm!);
                }
                else {
                    // same key but different element. treat as new element
                    createElm(
                        newStartVnode,
                        queue,
                        parentElm,
                        oldStartVnode.elm,
                        newCh,
                        newStartIdx,
                    );
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }

    if (oldStartIdx > oldEndIdx) {
        refElm = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : undefined;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, queue);
    }
    else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
}

/** 修复虚拟节点 */
export function patchVnode(oldVnode: VNode, vnode: VNode, queue: VNode[], removeOnly?: boolean) {
    if (oldVnode === vnode) {
        return;
    }

    const elm = vnode.elm = oldVnode.elm;

    if (!elm) {
        throw new Error('(patch) Elm not found.');
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        (vnode.isCloned || vnode.isOnce)
    ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return;
    }

    vnode.invokeHook('prepatch', oldVnode, vnode);

    if (vnode.tag) {
        invokeUpdateHooks(oldVnode, vnode);
    }

    const oldCh = oldVnode.children;
    const ch = vnode.children;

    if (!vnode.text) {
        // 旧节点和当前节点都含有子节点，更新子节点
        if (oldCh.length > 0 && ch.length > 0) {
            if (oldCh !== ch) {
                updateChildren(elm, oldCh, ch, queue, removeOnly);
            }
        }
        // 只有当前节点含有子节点，增加子节点
        else if (ch.length > 0) {
            if (oldVnode.text) {
                elm.textContent = '';
            }
            addVnodes(elm, undefined, ch, 0, ch.length - 1, queue);
        }
        // 只有旧节点含有子节点，移除子节点
        else if (oldCh.length > 0) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        // 都不存在子节点，变更文本
        else if (oldVnode.text) {
            elm.textContent = '';
        }
    }
    else if (oldVnode.text !== vnode.text) {
        elm.textContent = vnode.text;
    }

    vnode.invokeHook('postpatch', oldVnode, vnode);
}
