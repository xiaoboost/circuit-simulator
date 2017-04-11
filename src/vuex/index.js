import Vue from 'vue';
import Vuex from 'Vuex';

Vue.use(Vuex);

// SVG的命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';
// 科学计数法匹配正则
const NUM_REG = /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/;

// 科学计数法转换为实际数字
function numParse(str) {
    if (str.search(/[eE]/) !== -1) {
        const label = str.split(/[eE]/);
        return (+label) * Math.pow(10, +label[1]);
    } else if (str.search(/[puμnmkMG]/) !== -1) {
        const exp = { p: -12, u: -9, μ: -9, n: -6, m: -3, k: 3, M: 6, G: 9 },
            label = exp[str[str.length - 1]];

        str = str.substring(0, str.length - 1);
        return (+str) * Math.pow(10, label);
    } else {
        return +str;
    }
}

// 时间模块
const time = {
    state: {
        END_TIME: '10m',
        STEP_TIME: '10u'
    },
    getters: {
        end: (state) => numParse(state.END_TIME),
        step: (state) => numParse(state.STEP_TIME)
    },
    mutations: {
        SET_END_TIME(state, time) {
            state.END_TIME = time;
        },
        SET_STEP_TIME(state, time) {
            state.STEP_TIME = time;
        }
    }
};

export default new Vuex.Store({
    state: {
        SVG_NS,
        NUM_REG
    },
    modules: {
        time
    }
});
