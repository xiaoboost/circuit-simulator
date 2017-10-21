import Vue from 'vue';
import Vuex from 'vuex';

import time from 'src/vuex/time';
import views from 'src/vuex/views';
import drawing from 'src/vuex/drawing';
// import collection from 'src/vuex/collection';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        time,
        views,
        drawing,
        // collection,
    },
});
