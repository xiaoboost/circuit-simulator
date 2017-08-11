import Vue from 'vue';
import Vuex from 'Vuex';

import time from './time';
import drawing from './drawing';
import collection from './collection';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        time,
        drawing,
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
