import { numParser } from 'src/lib/util';

export default {
    state: {
        END_TIME: '10m',
        STEP_TIME: '10u',
    },
    getters: {
        end: (state) => numParser(state.END_TIME),
        step: (state) => numParser(state.STEP_TIME),
    },
    mutations: {
        SET_END_TIME: (state, time) => (state.END_TIME = time),
        SET_STEP_TIME: (state, time) => (state.STEP_TIME = time),
    },
};
