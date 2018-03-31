import Vue, { VueConstructor } from 'vue';
import { mount, Wrapper } from '@vue/test-utils';

export * from 'src/lib/utils';
export * from '@vue/test-utils';

/**
 * 回收 vm
 * @param {object} vm
 */
export function destroyVM(wrapper: Wrapper<Vue>) {
    wrapper.vm &&
    wrapper.vm.$el &&
    wrapper.vm.$el.parentNode &&
    wrapper.vm.$el.parentNode.removeChild(wrapper.vm.$el);
}

/**
 * 创建一个 Vue 的实例对象
 * @param  {object|string} Compo    - Vue 组件
 * @param  {boolean} {mounted=true} - 是否添加到 DOM 上
 * @return {object} vm
 */
export function createVM<T extends Vue>(Compo: VueConstructor<T>, mounted = true) {
    const wrapper = mount<T>(Compo);

    if (mounted) {
        document.body.appendChild(wrapper.vm.$el);
    }

    return wrapper;
}
