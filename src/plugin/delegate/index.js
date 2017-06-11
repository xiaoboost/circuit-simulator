import delegate from './main';

// 全局函数映射
const functionMap = new Map();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, data, fn
 */
function fixOnParameters(type, args) {
    if (typeof args === 'function') {
        // ( types, fn )
        return [type, '', {}, args];
    } else if (args.length === 2) {
        if (typeof args[0] === 'string') {
            // ( types, selector, fn )
            return [type, args[0], {}, args[1]];
        } else {
            // ( types, data, fn )
            return [args[0], '', args[0], args[1]];
        }
    } else if (args.length === 3) {
        // ( type, selector, data, fn )
        return [type, ...args];
    }
}

/**
 * 统一解除绑定时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOffParameters(type, args) {
    const u = undefined;

    if (type === u) {
        // () 解除所有事件
        return ['', '*', u];
    } else if (typeof args === 'function') {
        // ( type, fn )
        return [type, '', args];
    } else if (typeof args === 'string') {
        // ( type, selector )
        return [type, args, u];
    } else {
        // ( type, selector, fn )
        return [type, args[0], args[1]];
    }
}

/**
 * 封装回调函数
 * 由输入的修饰符对回调进行封装
 * @param {Function} callback
 * @param {Object} modifiers
 * @return {Function} fn
 */
function packageCallback(callback, modifiers) {
    function packFn(e) {
        // 等于自身
        const self = !modifiers.self || (e.currentTarget === e.path[0]);
        // 左键
        const left = !modifiers.left || (!e.button);
        // 右键
        const right = !modifiers.right || (e.button === 2);

        if (self && left && right) {
            callback(e);

            modifiers.stop && e.stopPropagation();
            modifiers.prevent && e.preventDefault();
        }
    }

    return Object.isEmpty(modifiers) ? callback : packFn;
}

/**
 * 修正输入类型的编号
 * 如果格式错误，则输出 false
 * @param {String} type - 原类型
 * @returns {String|Boolean} type
 */
function fixType(type) {
    const match = type.match(/^[a-z]+/);
    return !!match && match[0];
}

function install(Vue, options) {
    // 添加全局指令
    Vue.directive('delegate', {
        bind(el, binding) {
            const [typeOri, selector, data, fn] = fixOnParameters(binding.arg, binding.value),
                handler = packageCallback(fn, binding.modifiers),
                type = fixType(typeOri);

            if (!type) {
                throw (new Error('Event type is wrong!'));
            }

            functionMap.set(fn, handler);
            delegate.add(el, type, selector, data, handler);
        },
        unbind(el, binding) {
            const [typeOri, selector, fn] = fixOffParameters(binding.arg, binding.value),
                handler = functionMap.get(fn),
                type = fixType(typeOri);

            functionMap.delete(fn);
            delegate.remove(el, type, selector, handler);
        }
    });
    // 添加实例方法
    Vue.prototype.$$on = function(...args) {
        delegate.add(this.$el, ...fixOnParameters(...args));
    };
    Vue.prototype.$$off = function(...args) {
        delegate.remove(this.$el, ...fixOffParameters(...args));
    };
}

export default { install };
