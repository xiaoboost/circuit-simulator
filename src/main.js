import '@/libraries/init';

import Vue from 'vue';
import App from '@/App';
import store  from '@/vuex';

import delegate from '@/plugin/delegate';

Vue.use(delegate);
Vue.config.productionTip = false;

new Vue({
    store,
    el: '#app',
    template: '<App/>',
    components: { App },
    /* no-build */
    mounted() {
        const area = document.querySelector('.drawing-main svg g'),
            Compo = Vue.extend(require('@/components/map-debugger').default);

        // 调试组件独立于 app，挂在全局变量上
        window.$debug = new Compo().$mount();
        area.appendChild(window.$debug.$el);
    },
    /* no-build */
});
