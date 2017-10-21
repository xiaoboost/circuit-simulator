interface View {
    page: string;
}

const state: View = {
    page: '',
};

export default {
    state,
    getters: {
        isAddParts: (context: View) => context.page === 'add-parts',
        isMainConfig: (context: View) => context.page === 'main-config',
    },
    mutations: {
        SET_AddParts: (context: View, page: string) => state.page = 'add-parts',
        SET_MainConfig: (context: View, page: string) => state.page = 'main-config',
    },
};
