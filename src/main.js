import '@/libraries/init';

import Vue from 'vue';
import App from './App';
import store  from './vuex';
import router from './router';

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    el: '#app',
    template: '<App/>',
    components: { App }
});
