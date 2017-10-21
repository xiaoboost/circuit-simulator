interface TimeSetting {
    END_TIME: string;
    STEP_TIME: string;
}

const state: TimeSetting = {
    END_TIME: '10m',
    STEP_TIME: '10u',
};

export default {
    state,
    getters: {
        end: (context: TimeSetting) => Number.SCIParser(context.END_TIME),
        step: (context: TimeSetting) => Number.SCIParser(context.STEP_TIME),
    },
    mutations: {
        SET_END_TIME: (context: TimeSetting, time: string) => context.END_TIME = time,
        SET_STEP_TIME: (context: TimeSetting, time: string) => context.STEP_TIME = time,
    },
};
