import delegate from './main';
import * as assert from 'src/lib/assertion';

import { VueConstructor } from 'vue/types/vue';
import { VNodeDirective } from 'vue/types/vnode';

interface AnyObject { [x: string]: any; }
interface Modifiers { [key: string]: boolean; }
type outterCallback = (e?: DelegateEvent) => boolean | void;
type innerCallback = (e: DelegateEvent) => boolean | void;

interface DelegateDirective extends VNodeDirective {
    value: [string, string, AnyObject, outterCallback];
}

// 全局函数映射
const functionMap = new Map<outterCallback, innerCallback>();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOnParameters(type: string, selector: string | AnyObject | outterCallback = '', data: AnyObject | outterCallback = {}, fn?: outterCallback): [string, string, AnyObject, outterCallback] {
    // ( types, fn )
    if (assert.isFunction(selector)) {
        return [type, '', {}, selector];
    }
    // ( types, selector, fn )
    else if (assert.isFunction(data) && assert.isString(selector)) {
        return [type, selector, {}, data];
    }
    // ( types, data, fn )
    else if (assert.isFunction(data) && assert.isObject(selector)) {
        return [type, '', selector, data];
    }
    // ( type, selector, data, fn )
    else if (assert.isString(selector) && assert.isObject(data) && assert.isFunction(fn)) {
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
function fixOffParameters(type?: string, selector: string | AnyObject | outterCallback = '', fn?: outterCallback): [string, string, outterCallback | undefined] {
    // ()
    if (assert.isNull(type)) {
        return ['', '*', undefined];
    }
    // ( type )
    else if (assert.isNull(selector) && assert.isNull(fn)) {
        return [type, '*', undefined];
    }
    // ( type, fn )
    else if (assert.isFunction(selector) && assert.isNull(fn)) {
        return [type, '', selector];
    }
    // ( type, selector )
    else if (assert.isString(selector) && assert.isNull(fn)) {
        return [type, selector, undefined];
    }
    // ( type, selector, fn )
    else if (assert.isString(selector) && assert.isFunction(fn)) {
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
        let self = true, left = true, right = true, esc = true, enter = true;

        // 是否等于自身
        if (modifiers.self) {
            self = event.currentTarget === event.target;
        }
        // mouse 事件的情况下，是否按下左键
        if (assert.isMouseEvent(event) && modifiers.left) {
            left = event.button === 0;
        }
        // mouse 事件的情况下，是否按下右键
        if (assert.isMouseEvent(event) && modifiers.right) {
            right = event.button === 2;
        }
        // keyboard 事件的情况下，是否按下 Esc 按钮
        if (assert.isKeyboardEvent(event) && modifiers.esc) {
            esc = event.key === 'Escape';
        }
        // keyboard 事件的情况下，是否按下 Enter 按钮
        if (assert.isKeyboardEvent(event) && modifiers.enter) {
            enter = event.key === 'Enter';
        }

        // TODO: 一次性事件 once

        if (self && left && right && esc && enter) {
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
        bind(el: HTMLElement, binding: DelegateDirective): void {
            const [typeOri, selector, data, fn] = fixOnParameters(binding.arg, ...binding.value),
                handler = packageCallback(fn, binding.modifiers),
                type = fixType(typeOri);

            functionMap.set(fn, handler);
            delegate.add(el, type, selector, data, handler);
        },
        unbind(el: HTMLElement, binding: DelegateDirective): void {
            const fn = binding.value.find(assert.isFunction) as outterCallback;

            // 删除函数引用
            functionMap.delete(fn);
            // 删除绑定在当前 DOM 上的所有事件
            delegate.remove(el, '', '*');
        },
    });
    // 添加实例方法
    App.prototype.$$on = (el: HTMLElement, type: string, selector: string = '', data: AnyObject = {}, fn: outterCallback) => {
        const [_type, _selector, _data, _fn] = fixOnParameters(type, selector, data, fn);
        delegate.add(el, _type, _selector, _data, _fn);
    };
    App.prototype.$$off = (el: HTMLElement, type: string, selector: string = '', fn: outterCallback) => {
        const [_type, _selector, _fn] = fixOffParameters(type, selector, fn);
        delegate.remove(el, _type, _selector, _fn);
    };
}

export default { install };
