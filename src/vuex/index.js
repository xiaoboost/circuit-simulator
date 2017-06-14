import Vue from 'vue';
import Vuex from 'Vuex';

import time from './time';
import collection from './collection';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        time,
        collection
    }
});
