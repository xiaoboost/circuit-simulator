import VNode from '../vnode';

import { isEmpty, isTextInputType } from '../../utils';

import { createElm } from './create-elm';
import { invokeDestroyHook, removeAndInvokeRemoveHook } from './hooks';

/** 是否是相同的节点 */
export function sameVnode(a: VNode, b: VNode) {
    return (
        a.key === b.key &&
        (
            a.tag === b.tag &&
            a.isComment === b.isComment &&
            isEmpty(a.data) === isEmpty(b.data) &&
            sameInputType(a, b)
        )
    );
}

/** 是否是相同的 input 节点 */
export function sameInputType(a: VNode, b: VNode) {
    if (a.tag !== 'input') {
        return true;
    }

    const typeA: string = a.data.attrs && a.data.attrs.type;
    const typeB: string = b.data.attrs && b.data.attrs.type;

    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}

/** 创建包含了 elm 元素的虚拟 DOM */
export function emptyNodeAt(elm: Element) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
}

/** 移除当前元素 */
export function removeNode(el?: Element) {
    el &&
    el.parentNode &&
    el.parentNode.removeChild(el);
}

/** 执行插入操作 */
export function insert(parent?: Element, elm?: Element, ref?: Element) {
    if (parent && elm) {
        if (ref) {
            if (ref.parentNode === parent) {
                parent.insertBefore(elm, ref);
            }
        }
        else {
            parent.appendChild(elm);
        }
    }
}

/** 检查是否含有重复的 key */
export function checkDuplicateKeys(children: VNode[]) {
    const seenKeys = {};

    children.forEach((vnode) => {
        const key = vnode.key;

        if (!key) {
            return;
        }

        if (seenKeys[key]) {
            throw new Error(`(patch) Duplicate keys detected: '${key}'. This may cause an update error.`);
        }
        else {
            seenKeys[key] = true;
        }
    });
}

/** 添加数个节点 */
export function addVnodes(
    parentElm: Element,
    refElm: Element | undefined,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    queue: VNode[],
) {
    for (let i = startIdx; i <= endIdx; ++i) {
        createElm(vnodes[i], queue, parentElm, refElm, vnodes, i);
    }
}

/** 移除数个节点 */
export function removeVnodes(parentElm: Element, vnodes: VNode[], startIdx: number, endIdx: number) {
    for (let i = startIdx; i <= endIdx; ++i) {
        const ch = vnodes[i];

        if (!ch) {
            continue;
        }

        if (ch.tag) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
        }
        // Text node
        else {
            removeNode(ch.elm);
        }
    }
}
