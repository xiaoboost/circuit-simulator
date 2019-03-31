import { Component, Vue } from 'vue-property-decorator';

import { Getter, State } from 'vuex-class';
import { Getter as GetterTree, State as StateTree } from 'src/vuex';

import Unfold from '../transitions/unfold';
import LineDrawer from './line-drawer';

@Component({
    components: {
        Unfold, LineDrawer,
    },
})
export default class GraphViewer extends Vue {
    /** 是否显示组件 */
    @Getter('showGraphViewer')
    visible!: GetterTree['showGraphViewer'];

    /** 示波器设置 */
    @State('oscilloscopes')
    oscilloscopes!: StateTree['oscilloscopes'];
}
