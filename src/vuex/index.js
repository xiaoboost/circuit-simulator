import Vue from 'vue';
import Vuex from 'Vuex';

Vue.use(Vuex);

//SVG的命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';

export default new Vuex.Store({
    state: {
        SVG_NS
    }
});
