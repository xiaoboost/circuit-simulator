import Vue from 'vue';
import Vuex from 'Vuex';

Vue.use(Vuex);

// SVG的命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';
// 科学计数法匹配正则
const NUM_REG = /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/;

export default new Vuex.Store({
    state: {
        SVG_NS,
        NUM_REG,
        END_TIME: 0,
        STEP_TIME: 0
    },
    mutations: {
        SET_END_TIME(state, time) {
            state.END_TIME = time;
        },
        SET_STEP_TIME(state, time) {
            state.STEP_TIME = time;
        }
    }
});
