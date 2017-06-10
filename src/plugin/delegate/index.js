import delegate from './main';

// 全局函数映射
const functionMap = new Map();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, data, fn
 */
function fixOnParameters(...args) {
    if (args.length === 2) {
        // ( types, fn )
        return [args[0], '', {}, args[1]];
    } else if (args.length === 3) {
        if (typeof args[1] === 'string') {
            // ( types, selector, fn )
            return [args[0], args[1], {}, args[2]];
        } else {
            // ( types, data, fn )
            return [args[0], '', args[1], args[2]];
        }
    } else if (args.length === 3) {
        // ( type, selector, data, fn )
        return args;
    }
}

/**
 * 统一解除绑定时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOffParameters(...args) {
    const f = 'function', s = 'string', u = undefined;

    switch (args.length) {
        // () 解除所有事件
        case 0: return [];
        // ( type )
        case 1: return [args[0], '', u];
        // ( type, selector, fn )
        case 3: return args;

        case 2: {
            if (typeof args[1] === f) {
                // ( type, fn )
                return [args[0], '', args[1]];
            } else if (typeof args[1] === s) {
                // ( type, selector )
                return [args[0], args[1], u];
            }
        }
        default: return false;
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

            if (modifiers.once) {
                // TODO: 移除委托事件
            }
        }
    }

    const $callback$ = Object.isEmpty(modifiers) ? callback : packFn;
    functionMap.set(callback, $callback$);

    return $callback$;
}

function install(Vue, options) {
    // 添加全局指令
    Vue.directive('delegate', {
        bind(el, binding) {
            const modifiers = Object.keys(binding.modifiers),
                [type, selector, data, fn] = fixOnParameters(binding.arg, ...binding.value),
                handler = packageCallback(fn, modifiers);

            delegate.add(el, type, selector, data, handler);
        },
        unbind(el, binding) {
            // ..
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
