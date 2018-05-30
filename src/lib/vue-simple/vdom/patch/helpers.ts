import VNode from '../vnode';

import {
    isEmpty,
    isTextInputType,
} from '../../utils';

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

export function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number) {
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
export function insert(parent: Element, elm: Element, ref?: Element) {
    if (ref) {
        if (ref.parentNode === parent) {
            parent.insertBefore(elm, ref);
        }
    }
    else {
        parent.appendChild(elm);
    }
}
