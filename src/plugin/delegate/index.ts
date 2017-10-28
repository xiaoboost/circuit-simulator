/* tslint:disable:unified-signatures */

import {
    Vue,
    Callback,
    AnyObject,
    Modifiers,
    CustomEvent,
    BindFunction,
    UnBindFunction,
    VueConstructor,
    VNodeDirective,
} from './options';

import delegate from './main';
import assert from 'src/lib/assertion';

// 全局函数映射
const functionMap = new Map();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, fn
 */
const fixOnParameters: BindFunction = (type, selector, data, fn) => {
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
};

/**
 * 统一解除绑定时的输入参数格式
 * 标准格式为 type, selector, fn
 */
const fixOffParameters: UnBindFunction = (type, selector, fn) => {
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
};

/**
 * 封装回调函数
 * 由输入的修饰符对回调进行封装
 * @param {Function} callback
 * @param {Object} modifiers
 * @return {Function} fn
 */
function packageCallback(callback: Callback, modifiers: Modifiers) {
    function packFn(e: CustomEvent) {
        // 等于自身
        const self = !modifiers.self || (e.currentTarget === e.target);
        // 左键
        const left = !modifiers.left || (e.button === 0);
        // 右键
        const right = !modifiers.right || (e.button === 2);

        if (self && left && right) {
            callback(e);

            if (modifiers.stop) {
                e.stopPropagation();
            }
            if (modifiers.prevent) {
                e.preventDefault();
            }
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
        bind(el: HTMLElement, binding: VNodeDirective) {
            const params = binding.value as [string, AnyObject, Callback],
                [typeOri, selector, data, fn] = fixOnParameters(binding.arg, params[0], params[1], params[2]),
                handler = packageCallback(fn, binding.modifiers),
                type = fixType(typeOri);

            functionMap.set(fn, handler);
            delegate.add(el, type, selector, data, handler);
        },
        unbind(el: HTMLElement, binding: VNodeDirective) {
            const [, , fn] = fixOffParameters(binding.arg, ...binding.value as any[]);

            functionMap.delete(fn);
            // 删除绑定在当前 DOM 上的所有事件
            delegate.remove(el, '', '*');
        },
    });
    // 添加实例方法
    App.prototype.$$on = function(this: Vue, type: string, selector: string, data: AnyObject, fn: Callback) {
        const [_type, _selector, _data, _fn] = fixOnParameters(type, selector, data, fn);
        delegate.add(this.$el, _type, _selector, _data, _fn);
    };
    App.prototype.$$off = function(this: Vue, type: string, selector: string, fn: Callback) {
        const [_type, _selector, _fn] = fixOffParameters(type, selector, fn);
        delegate.remove(this.$el, _type, _selector, _fn);
    };
}

export default { install };
