import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';

import Solver from 'src/lib/solver';

import {
    MutationName,
    Getter as GetterTree,
    Mutation as MutationTree,
} from 'src/vuex';

@Component
export default class ActionMenu extends Vue {
    /** 当前是否正在运行 */
    isRun = false;
    /** 当前进度 */
    progress = 0;

    /** 是否显示菜单 */
    @Getter('isSpace')
    vision!: GetterTree['isSpace'];

    /** 打开添加器件侧边栏 */
    @Mutation(MutationName.OPEN_ADD_PARTS)
    addParts!: MutationTree[MutationName.OPEN_ADD_PARTS];

    /** 打开主配置侧边栏 */
    @Mutation(MutationName.OPEN_MAIN_CONFIG)
    setConfig!: MutationTree[MutationName.OPEN_MAIN_CONFIG];

    /** 打开波形显示面板 */
    @Mutation(MutationName.OPEN_GRAPH_VIEW)
    showGraph!: MutationTree[MutationName.OPEN_GRAPH_VIEW];

    /** 模拟运行 */
    async simulate() {
        this.isRun = true;

        const { parts, lines } = this.$store.state;
        const solver = new Solver(parts, lines);

        // 变更当前进度
        solver.onProgress((progress) => {
            this.progress = progress;
            return this.$nextTick();
        });

        // 等待运行
        await solver.startSolve();

        // 展示换算结果
        this.showGraph();
    }
}
