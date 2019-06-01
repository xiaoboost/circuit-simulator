import { Component, Vue } from 'vue-property-decorator';

import { Getter, State, Mutation } from 'vuex-class';
import {
    Getter as GetterTree,
    State as StateTree,
    Mutation as MutationTree,
    MutationName,
} from 'src/vuex';

import LineDrawer from './line-drawer';
import Unfold from '../transitions/unfold';
import { toBlob, download } from 'src/lib/utils';

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

    /** 波形子组件引用 */
    $refs!: {
        lineDrawers: LineDrawer[];
    };

    /** 示波器是否是半高 */
    get halfHeight() {
        return this.oscilloscopes.length > 1;
    }

    /** 关闭面板 */
    @Mutation(MutationName.CLOSE_SLIDER)
    closeViewer!: MutationTree[MutationName.CLOSE_SLIDER];

    /** 保存为数据 */
    saveAsData() {
        const { times, meters }: StateTree['solverResult'] = this.$store.state.solverResult;

        /** 输出文本内容 */
        let content = 'time,';

        // 记录编号
        meters.forEach(({ id }) => (content += `${id},`));

        // 记录内容
        for (let i = 0; i < times.length; i++) {
            content += `\n${times[i]},`;
            meters.forEach(({ data }) => (content += `${data[i]},`));
        }

        download(
            `simulate-data-${new Date().toLocaleString()}.csv`,
            new Blob([content]),
        );
    }

    /** 保存为图像 */
    async saveAsImage() {
        const ratio = window.devicePixelRatio;
        const canvas = document.createElement('canvas');
        const drawer = canvas.getContext('2d')!;
        const size = this.$refs.lineDrawers[0].$el.getBoundingClientRect();
        const images = await Promise.all(this.$refs.lineDrawers.map(({ chart }) => new Promise<HTMLImageElement>((resolve) => {
            const image = new Image(size.width, size.height);
            image.src = chart.toDataURL();
            image.onload = () => resolve(image);
        })));

        canvas.width = size.width * ratio;
        canvas.height = size.height * ratio * this.oscilloscopes.length;

        // 设置背景色
        drawer.fillStyle = window.getComputedStyle(this.$el).backgroundColor || '';
        drawer.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < images.length; i++) {
            const image = images[i];

            drawer.drawImage(image, 0, i * size.height * ratio);
        }

        download('simulate-graph.jpg', toBlob(canvas.toDataURL()));
    }
}
