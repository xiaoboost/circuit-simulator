import { Getter } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { Mutation, Action } from 'src/vuex';
import { icons, IconName } from './icons';

@Component
export default class ActionMenu extends Vue {
    /** 图标缩放比例 */
    readonly zoom = 0.6;
    /** 图标数据 */
    readonly icons = icons;
    /** 当前是否正在运行 */
    private isRun = false;

    /** 是否显示菜单 */
    @Getter('isSpace')
    vision!: boolean;

    action(name: IconName) {
        switch (name) {
            case IconName.Add:
                this.$store.commit(Mutation.OPEN_ADD_PARTS);
                break;
            case IconName.Config:
                this.$store.commit(Mutation.OPEN_MAIN_CONFIG);
                break;
            case IconName.Run:
                this.isRun = true;
                this.$store.dispatch(Action.SOLVE_CIRCUIT);
                break;
            default:
        }
    }
}
