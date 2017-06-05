
function install(Vue, options) {
    // 添加全局指令
    Vue.directive('@on', {
        bind(el, binding, vnode, oldVnode) {
            // 逻辑...
        }
    });
    // 添加实例方法
    Vue.prototype.$myMethod = function(options) {
        // 逻辑...
    };
}

export { install };
