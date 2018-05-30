import VNode from '../vnode';
import { HookFuncExport } from './index';

import {
    isDef,
    isUndef,
    makeMap,
    isElement,
} from 'src/lib/utils';

const xlinkNS = 'http://www.w3.org/1999/xlink';

const isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible',
);

const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

function isXlink(name: string) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
}

function getXlinkProp(name: string) {
    return isXlink(name) ? name.slice(6, name.length) : '';
}

function baseSetAttr(el: Element, key: string, value?: string, nameSpace?: string) {
    nameSpace
        ? value
            ? el.setAttributeNS(nameSpace, key, value)
            : el.removeAttributeNS(nameSpace, getXlinkProp(key))
        : value
            ? el.setAttribute(key, value)
            : el.removeAttribute(key);
}

function setAttr(el: Element, key: string, value?: string) {
    if (el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value);
    }
    else if (isBooleanAttr(key)) {
        // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        if (!value) {
            el.removeAttribute(key);
        }
        else {
            // technically allowfullscreen is a boolean attribute for <iframe>,
            // but Flash expects a value of "true" when used on <embed> tag
            value = key === 'allowfullscreen' && el.tagName === 'EMBED'
                ? 'true'
                : key;

            el.setAttribute(key, value);
        }
    }
    else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, (!value || value === 'false') ? 'false' : 'true');
    }
    else if (isXlink(key)) {
        baseSetAttr(el, key, value, xlinkNS);
    }
    else {
        baseSetAttr(el, key, value);
    }
}

function updateAttrs(oldVnode: VNode, vnode: VNode) {
    const opts = vnode.componentOptions;

    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return;
    }

    const elm = vnode.elm;
    const oldAttrs = oldVnode.data.attrs || {};
    const attrs = vnode.data.attrs || {};

    if (!isElement(elm)) {
        throw new Error('(patch) not found element');
    }

    Object.keys(attrs).forEach((key) => {
        const cur = attrs[key];
        const old = oldAttrs[key];

        if (old !== cur) {
            setAttr(elm, key, cur);
        }
    });

    Object.keys(oldAttrs).forEach((key) => {
        if (isUndef(attrs[key])) {
            if (isXlink(key)) {
                elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
            }
            else if (!isEnumeratedAttr(key)) {
                elm.removeAttribute(key);
            }
          }
    });
}

const module: HookFuncExport = {
    create: updateAttrs,
    update: updateAttrs,
};

export default module;
