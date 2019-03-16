import { Component, Vue } from 'vue-property-decorator';
import { Getter as GetterTree } from 'src/vuex';
import { Getter } from 'vuex-class';
import { Observer } from 'src/lib/solver';

import Unfold from '../transitions/unfold';

@Component({
    components: {
        Unfold,
    },
})
export default class GraphViewer extends Vue {
    /** 是否显示组件 */
    @Getter('showGraphViewer')
    visible!: GetterTree['showGraphViewer'];

    /** 面板显示初始化 */
    setCharts() {
        debugger;
    }
}
