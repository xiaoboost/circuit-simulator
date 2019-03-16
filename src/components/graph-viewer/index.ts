import { Component, Vue } from 'vue-property-decorator';

import { Getter, State } from 'vuex-class';
import { PartType } from 'src/components/electronic-part';
import { Getter as GetterTree, State as StateTree } from 'src/vuex';

import Unfold from '../transitions/unfold';

/** 波形图像的类别 */
export const enum GraphType {
    /** 电压图像 */
    Voltage = 0x01,
    /** 电流图像 */
    Current = 0x10,
    /** 电压电流都有 */
    All = 0x11,
}

@Component({
    components: {
        Unfold,
    },
})
export default class GraphViewer extends Vue {
    /** 是否显示组件 */
    @Getter('showGraphViewer')
    visible!: GetterTree['showGraphViewer'];

    /** 器件数据 */
    @State('parts')
    parts!: StateTree['parts'];

    /** 仪表数据 */
    @State('metersData')
    metersData!: StateTree['metersData'];

    /** 示波器设置 */
    @State('charts')
    graphSetting!: StateTree['charts'];

    /** 需要表示的图形数据整合 */
    get graphs() {
        return this.graphSetting
            .filter((ids) => (ids.length > 0))
            .map((ids, index) => {
                const parts = ids.map((meter) => this.parts.find((item) => item.id === meter)!);
                const hasVolt = parts.some(({ type }) => type === PartType.VoltageMeter);
                const hasCurr = parts.some(({ type }) => type === PartType.CurrentMeter);
                const meters = ids.map((name) => ({
                    name,
                    data: this.metersData.find(({ id }) => id === name)!.data,
                }));

                return {
                    index: `graph-viewer-${index}`,
                    meters,
                    type: Number(hasVolt) | (Number(hasCurr) << 1),
                };
            });
    }

    /** 面板显示初始化 */
    setCharts() {
        // ..
    }
}
