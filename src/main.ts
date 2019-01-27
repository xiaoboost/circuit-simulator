import 'src/css/main';
import 'src/lib/native';

import Vue from 'vue';
import { debuggerInit } from 'src/lib/debugger';
import { get, getQueryByName } from 'src/lib/utils';
import { default as store, CircuitStorage } from 'src/vuex';

import ActionMenu from './components/action-menu/component';
import SliderMenu from './components/slider-menu/component';
import DrawingMain from './components/drawing-main/component';

Vue.config.productionTip = (process.env.NODE_ENV === 'development');

// 移除 loading 界面
function loaded() {
    const loading = document.getElementById('start-loading')!;

    loading.style.opacity = '0';
    loading.style.transition = 'opacity .5s';
    setTimeout(() => loading.remove(), 500);
    console.log('Schematic Ready.');
}

// init vue
new Vue({
    store,
    el: '#app',
    name: 'Main',
    components: { ActionMenu, SliderMenu, DrawingMain },
    render: (h) => h(
        'main', { attrs: { id: 'app' }},
        [h('drawing-main'), h('slider-menu'), h('action-menu')] as any,
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
