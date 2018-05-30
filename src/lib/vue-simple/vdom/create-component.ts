import Component from '../instance';

import VNode, {
    VNodeData,
    createTextVNode,
    createEmptyVNode,
} from './vnode';

import {
    isUndef,
    isArray,
    isPrimitive,
    isBaseType,
    hyphenate,
    hasOwn,
} from 'src/lib/utils';

type TyCtor = typeof Component;

function extractPropsFromVNodeData(data: VNodeData, Ctor: TyCtor, tag: string) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    const propOptions = Ctor.options.props;

    if (isUndef(propOptions)) {
        return;
    }

    if (isUndef(data.attrs) && isUndef(data.props)) {
        return {};
    }

    const res = {};
    const { attrs, props } = data;

    Object.keys(propOptions).forEach((key) => {
        const altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
    });

    return res;
}

function checkProp(
    res: object,
    hash: object = {},
    key: string,
    altKey: string,
    preserve: boolean,
) {
    if (!isUndef(hash)) {
        if (hasOwn(hash, key)) {
            res[key] = hash[key];
            if (!preserve) {
                delete hash[key];
            }
            return true;
        }
        else if (hasOwn(hash, altKey)) {
            res[key] = hash[altKey];
            if (!preserve) {
                delete hash[altKey];
            }
            return true;
        }
    }
    return false;
}

export function createComponent(
  Ctor: TyCtor,
  data: VNodeData,
  context: Component,
  children: VNode[],
  tag: string,
): VNode {
    // transform component v-model data into props & events
    if (data.model) {
        // set value
        (data.props || (data.props = {})).value = data.model.value;

        const on = data.on || (data.on = {});

        if (Boolean(on.input)) {
            on.input = [data.model.callback].concat(on.input);
        }
        else {
            on.input = data.model.callback;
        }
    }

    // extract props
    const propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    const listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    // return a placeholder vnode
    const vnode = new VNode(
        `vue-component-${tag}`,
        data, undefined, undefined, undefined, context,
        { Ctor, propsData, listeners, tag, children },
    );

    return vnode;
}
