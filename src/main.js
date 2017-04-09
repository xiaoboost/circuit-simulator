import Vue from 'vue';
import App from './App';
import store  from './vuex';
import router from './router';

import '@/libraries/init';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    store,
    router,
    el: '#app',
    template: '<App/>',
    components: { App }
});
