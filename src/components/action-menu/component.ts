import { actions } from './icons';
import { Getter } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { Mutation, Action } from 'src/vuex';

type IconKey = keyof typeof actions;
const iconkeys: IconKey[] = ['run', 'add', 'config'];
const icons = iconkeys.map((item) => ({
    name: item,
    ...actions[item],
}));

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

    action(name: IconKey) {
        switch (name) {
            case 'add':
                this.$store.commit(Mutation.OPEN_ADD_PARTS);
                break;
            case 'config':
                this.$store.commit(Mutation.OPEN_MAIN_CONFIG);
                break;
            case 'run':
                this.isRun = true;
                this.$store.dispatch(Action.SOLVE_CIRCUIT);
                break;
            default:
        }
    }
}
