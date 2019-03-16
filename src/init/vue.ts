import 'src/init';

import { default as Vue, VNodeChildrenArrayContents } from 'vue';
import { default as store, CircuitStorage } from 'src/vuex';

import { debuggerInit } from 'src/lib/debugger';
import { get, getQueryByName } from 'src/lib/utils';

import ActionMenu from 'src/components/action-menu';
import DrawingMain from 'src/components/drawing-main';
import GraphViewer from 'src/components/graph-viewer';
import SliderMenu from 'src/components/slider-menu/slider-main';

// 调式模式打开调试器
Vue.config.productionTip = (process.env.NODE_ENV === 'development');

// 移除 loading 界面
function loaded() {
    const loading = document.getElementById('start-loading')!;

    loading.style.opacity = '0';
    loading.style.transition = 'opacity .5s';
    setTimeout(() => loading.remove(), 500);
    console.log('Schematic Ready.');
}

// vue 初始化
new Vue({
    store,
    el: '#app',
    name: 'Main',
    render: (h) => h(
        'main', { attrs: { id: 'app' }},
        [h(DrawingMain), h(SliderMenu), h(GraphViewer), h(ActionMenu)] as VNodeChildrenArrayContents,
    ),
    async mounted() {
        const map = getQueryByName('map');

        if (map) {
            let data: CircuitStorage = { data: [] };

            try {
                data = await get<CircuitStorage>(`/examples/${map}.json`);
            }
            catch (e) {
                console.error(e);
            }

            // 加载数据
            await this.$store.dispatch('IMPORT_DATA', data);
            await this.$nextTick();
        }

        // 调试器初始化
        debuggerInit();

        // 初始化完成
        loaded();
    },
});
