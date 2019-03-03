import { icons, IconName } from './icons';
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import {
    GetterName,
    Getter as GetterTree,
    MutationName,
    Mutation as MutationTree,
    ActionName,
    Action as ActionTree,
} from 'src/vuex';

@Component
export default class ActionMenu extends Vue {
    /** 图标缩放比例 */
    readonly zoom = 0.6;
    /** 图标数据 */
    readonly icons = icons;
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
    simulate!: ActionTree[ActionName.SOLVE_CIRCUIT];

    action(name: IconName) {
        switch (name) {
            case IconName.Add:
                this.addParts();
                break;
            case IconName.Config:
                this.setConfig();
                break;
            case IconName.Run:
                this.isRun = true;
                this.simulate();
                break;
            default:
        }
    }
}
