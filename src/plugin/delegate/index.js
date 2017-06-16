import delegate from './main';

// 全局函数映射
const functionMap = new Map();

/**
 * 统一绑定事件时的输入参数格式
 * 标准格式为 type, selector, data, fn
 */
function fixOnParameters(type, selector, data, fn) {
    if (selector && !!selector.apply) {
        // ( types, fn )
        return [type, '', {}, selector];
    } else if (!fn) {
        if (typeof selector === 'string') {
            // ( types, selector, fn )
            return [type, selector, {}, data];
        } else {
            // ( types, data, fn )
            return [type, '', selector, data];
        }
    } else {
        // ( type, selector, data, fn )
        return [type, selector, data, fn];
    }
}

/**
 * 统一解除绑定时的输入参数格式
 * 标准格式为 type, selector, fn
 */
function fixOffParameters(type, selector, fn) {
    const u = undefined, s = 'string';

    if (type === u) {
        // ()
        return ['', '*', u];
    } else if (!selector && !fn) {
        // ( type )
        return [type, '*', u];
    } else if (!!selector.apply && !fn) {
        // ( type, fn )
        return [type, '', selector];
    } else if (typeof selector === s && !fn) {
        // ( type, selector )
        return [type, selector, u];
    } else {
        // ( type, selector, fn )
        return [type, selector, fn];
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
    const match = type && type.match(/^[a-z]+/);
    return !!match && match[0];
}

function install(Vue, options) {
    // 添加全局指令
    Vue.directive('delegate', {
        bind(el, binding) {
            const [typeOri, selector, data, fn] = fixOnParameters(binding.arg, ...binding.value),
                handler = packageCallback(fn, binding.modifiers),
                type = fixType(typeOri);

            if (!type) {
                throw (new Error('Event type is wrong!'));
            }

            functionMap.set(fn, handler);
            delegate.add(el, type, selector, data, handler);
        },
        unbind(el, binding) {
            const [typeOri, selector, fn] = fixOffParameters(binding.arg, ...binding.value),
                handler = functionMap.get(fn),
                type = fixType(typeOri);

            functionMap.delete(fn);
            // 删除绑定在当前 DOM 上的所有事件
            delegate.remove(el, '', '*');
        }
    });
    // 添加实例方法
    Vue.prototype.$$on = function(type, selector, data, fn) {
        delegate.add(this.$el, ...fixOnParameters(type, selector, data, fn));
    };
    Vue.prototype.$$off = function(type, selector, fn) {
        delegate.remove(this.$el, ...fixOffParameters(type, selector, fn));
    };
}

export default { install };
