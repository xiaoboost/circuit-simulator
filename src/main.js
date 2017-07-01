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
    components: { App }
});
