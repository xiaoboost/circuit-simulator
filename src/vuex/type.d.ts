/** 任意函数 */
type AnyFunc = (payload: any) => any;

/** 导出原版 Module 列表类型 */
export { ModuleTree } from 'vuex';

/** 生成 vuex 的 Getter 列表 */
export type GetterTree<
    /** 当前模块的 State */
    State extends object,
    /** 当前模块的 Getter 接口 */
    Getter extends Record<keyof Getter, any>,
    /** 根模块的 State */
    RootState extends object = State,
    /** 根模块的 Getter 接口 */
    RootGatter extends object = Getter,
> = {
    [T in keyof Getter]: (
        state: State,
        getters: Getter,
        rootState: RootState,
        rootGetters: RootGatter,
    ) => Getter[T];
};

/** 生成 vuex 的 Mutation 列表 */
export type MutationTree<S extends object, M extends Record<keyof M, AnyFunc>> = {
    [T in keyof M]: (state: S, ...args: Parameters<M[T]>) => void;
};

/** 生成在实例中调用的 Mutation 类型 */
export type MutationCall<M extends Record<keyof M, AnyFunc>> = {
    [T in keyof M]: (name: T, ...args: Parameters<M[T]>) => void;
};

/** 求接口所有属性值的交叉类型 */
type Values<T extends object> = T[keyof T];

/** Action 参数上下文 */
interface ActionContext<
    State extends object,
    Getter extends object,
    Mutation extends Record<keyof Mutation, AnyFunc>,
    Action extends Record<keyof Action, AnyFunc>,
    RootState extends object = State,
    RootGetter extends object = Getter,
> {
    dispatch: Values<ActionCall<Action>>;
    commit: Values<MutationCall<Mutation>>;
    state: State;
    getters: Getter;
    rootState: RootState;
    rootGetters: RootGetter;
}

/** 生成 vuex 的 Action 列表 */
export type ActionTree<
    /** 当前模块的 State */
    State extends object,
    /** 当前模块的 Getter 接口 */
    Getter extends object,
    /** 当前模块的 Mutation 接口 */
    Mutation extends Record<keyof Mutation, AnyFunc>,
    /** 当前模块的 Action 接口 */
    Action extends Record<keyof Action, AnyFunc>,
    /** 根模块的 State */
    RootState extends object = State,
    /** 根模块的 Getter 接口 */
    RootGatter extends object = Getter,
> = {
    [T in keyof Action]: (
        context: ActionContext<State, Getter, Mutation, Action, RootState, RootGatter>,
        AnyFunc: Parameters<Action[T]>[0]
    ) => ReturnType<Action[T]>;
};

/** 生成在实例中调用的 Action 类型 */
export type ActionCall<Action extends Record<keyof Action, AnyFunc>> = {
    [T in keyof Action]: (name: T, AnyFunc: Parameters<Action[T]>[0]) => ReturnType<Action[T]>;
};
