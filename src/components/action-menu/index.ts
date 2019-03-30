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

    /** 记录模拟运算结果 */
    @Mutation(MutationName.SET_METER_DATA)
    setMeters!: MutationTree[MutationName.SET_METER_DATA];

    /** 打开波形显示面板 */
    @Mutation(MutationName.OPEN_GRAPH_VIEW)
    showGraph!: MutationTree[MutationName.OPEN_GRAPH_VIEW];

    /** 模拟运行 */
    async simulate() {
        this.isRun = true;

        const { parts, lines } = this.$store.state;
        const solver = new Solver(parts, lines);

        /** 当前时间 */
        let last = new Date().getTime();

        // 变更当前进度
        solver.onProgress((progress) => {
            const now = new Date().getTime();

            if (now - last > 1000) {
                last = now;
                this.progress = progress;

                return this.$nextTick();
            }
        });

        // 进度完成
        this.progress = 100;

        if (process.env.NODE_ENV === 'development') {
            console.time('solve');
        }

        // 计算完成后打开波形面板
        this.setMeters(await solver.startSolve());

        if (process.env.NODE_ENV === 'development') {
            console.timeEnd('solve');
        }

        // debugger;
        // this.showGraph();
    }
}
