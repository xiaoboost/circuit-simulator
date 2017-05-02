import Vue from 'vue';
import ActionMenu from '@/components/action-menu';

describe('action-menu.vue', () => {
    it('should render correct contents', () => {
        const Constructor = Vue.extend(ActionMenu);
        const vm = new Constructor().$mount();
        expect(vm.$el.querySelector('.hello h1').textContent)
            .to.equal('Welcome to Your Vue.js App');
    });
});
