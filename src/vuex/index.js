import Vue from 'vue';
import Vuex from 'vuex';

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
    state: {
        page: '',
        $SVG_NS: 'http://www.w3.org/2000/svg',
    },
    mutations: {
        SET_PAGE(state, page) {
            state.page = page;
        },
    },
});
