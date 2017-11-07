import delegate from './main';
import * as assert from 'src/lib/assertion';

import { Vue, VueConstructor } from 'vue/types/vue';
import { VNodeDirective } from 'vue/types/vnode';

interface AnyObject { [x: string]: any; }
interface Modifiers { [key: string]: boolean; }
type outterCallback = (e?: DelegateEvent) => boolean | void;
type innerCallback = (e: DelegateEvent) => boolean | void;

// 全局函数映射
const functionMap = new Map<outterCallback, innerCallback>();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOnParameters(type: string, selector: string | AnyObject | outterCallback, data?: AnyObject | outterCallback, fn?: outterCallback): [string, string, AnyObject, outterCallback] {
    // ( types, fn )
    if (assert.isFuncton(selector)) {
        return [type, '', {}, selector];
    }
    // ( types, selector, fn )
    else if (assert.isFuncton(data) && assert.isString(selector)) {
        return [type, selector, {}, data];
    }
    // ( types, data, fn )
    else if (assert.isFuncton(data) && assert.isObject(selector)) {
        return [type, '', selector, data];
    }
    // ( type, selector, data, fn )
    else if (assert.isString(selector) && assert.isObject(data) && assert.isFuncton(fn)) {
        return [type, selector, data, fn];
    }
    // error
    else {
        throw new Error('Illegal Delegate');
    }
}

/**
 * 统一解除绑定时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOffParameters(type?: string, selector?: string | AnyObject | outterCallback, data?: AnyObject | outterCallback, fn?: outterCallback): [string, string, outterCallback | undefined] {
    // ()
    if (assert.isNull(type)) {
        return ['', '*', undefined];
    }
    // ( type )
    else if (assert.isNull(selector) && assert.isNull(fn)) {
        return [type, '*', undefined];
    }
    // ( type, fn )
    else if (assert.isFuncton(selector) && assert.isNull(fn)) {
        return [type, '', selector];
    }
    // ( type, selector )
    else if (assert.isString(selector) && assert.isNull(fn)) {
        return [type, selector, undefined];
    }
    // ( type, selector, fn )
    else if (assert.isString(selector) && assert.isFuncton(fn)) {
        return [type, selector, fn];
    }
    // error
    else {
        throw new Error('Illegal Delegate');
    }
}

/**
 * 封装回调函数
 * 由输入的修饰符对回调进行封装
 * @param {Function} callback
 * @param {Object} modifiers
 * @return {Function} fn
 */
function packageCallback(callback: outterCallback, modifiers: Modifiers): innerCallback {
    function packFn(event: DelegateEvent) {
        // 等于自身
        const self = !modifiers.self || (event.currentTarget === event.target);
        // 左键
        const left = !modifiers.left || (assert.isMouseEvent(event) && (event.button === 0));
        // 右键
        const right = !modifiers.right || (assert.isMouseEvent(event) && (event.button === 2));

        // TODO: 一次性事件 once

        if (self && left && right) {
            const ans = callback(event);

            if (modifiers.stop) {
                event.stopPropagation();
            }
            if (modifiers.prevent) {
                event.preventDefault();
            }

            return ans;
        }
    }

    return Object.isEmpty(modifiers) ? callback : packFn;
}

/**
 * 修正输入类型的编号
 * 如果格式错误，则抛出错误
 * @param {string} type
 * @returns {(string | boolean)}
 */
function fixType(type: string): string {
    const match = type && type.match(/^[a-z]+/);

    if (!match) {
        throw (new Error('Illegal Event'));
    }

    return match[0];
}

function install(App: VueConstructor) {
    // 添加全局指令
    App.directive('delegate', {
        bind(el: HTMLElement, binding: VNodeDirective): void {
            const [_selector, _data, _fn] = binding.value,
                [typeOri, selector, data, fn] = fixOnParameters(binding.arg, _selector, _data, _fn),
                handler = packageCallback(fn, binding.modifiers),
                type = fixType(typeOri);

            functionMap.set(fn, handler);
            delegate.add(el, type, selector, data, handler);
        },
        unbind(el: HTMLElement, binding: VNodeDirective): void {
            const [, , fn] = fixOffParameters(binding.arg, ...binding.value);

            if (fn) {
                functionMap.delete(fn);
            }

            // 删除绑定在当前 DOM 上的所有事件
            delegate.remove(el, '', '*');
        },
    });
    // 添加实例方法
    App.prototype.$$on = (el: HTMLElement, type: string, selector: string, data: AnyObject, fn: outterCallback) => {
        const [_type, _selector, _data, _fn] = fixOnParameters(type, selector, data, fn);
        delegate.add(el, _type, _selector, _data, _fn);
    };
    App.prototype.$$off = (el: HTMLElement, type: string, selector: string, fn: outterCallback) => {
        const [_type, _selector, _fn] = fixOffParameters(type, selector, undefined, fn);
        delegate.remove(el, _type, _selector, _fn);
    };
}

export default { install };
