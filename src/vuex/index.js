import Vue from 'vue';
import Vuex from 'Vuex';

import time from './time';
import collection from './collection';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        time,
        collection,
    },
    // 页面状态
    state: {
        page: '',
    },
    mutations: {
        SET_PAGE(state, page) {
            state.page = page;
        },
    },
});
