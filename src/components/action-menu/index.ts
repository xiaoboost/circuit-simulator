import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import {
    GetterName,
    MutationName,
    ActionName,
    Getter as GetterTree,
    Mutation as MutationTree,
    Action as ActionTree,
} from 'src/vuex';

@Component
export default class ActionMenu extends Vue {
    /** 当前是否正在运行 */
    private isRun = false;

    /** 是否显示菜单 */
    @Getter(GetterName.isSpace)
    vision!: GetterTree[GetterName.isSpace];

    /** 打开添加器件侧边栏 */
    @Mutation(MutationName.OPEN_ADD_PARTS)
    addParts!: MutationTree[MutationName.OPEN_ADD_PARTS];

    /** 打开主配置侧边栏 */
    @Mutation(MutationName.OPEN_MAIN_CONFIG)
    setConfig!: MutationTree[MutationName.OPEN_MAIN_CONFIG];

    /** 运行电路模拟 */
    @Action(ActionName.SOLVE_CIRCUIT)
    solve!: ActionTree[ActionName.SOLVE_CIRCUIT];

    /** 模拟运行 */
    simulate() {
        this.isRun = true;
        this.solve();
    }
}
