import 'src/css/main';
import 'src/lib/init';
import 'src/lib/native';

import Vue, { VNodeChildrenArrayContents } from 'vue';
import store, { CircuitStorage } from 'src/vuex';

import * as utils from 'src/lib/utils';
import debug from 'src/lib/debugger';
import modal from 'src/mixins/params';

import ActionMenu from 'src/components/action-menu';
import SliderMenu from 'src/components/slider-menu';
import DrawingMain from 'src/components/drawing-main';

Vue.use(modal);

Vue.config.productionTip = ($ENV.NODE_ENV === 'development');

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
        [h('drawing-main'), h('slider-menu'), h('action-menu')] as VNodeChildrenArrayContents,
    ),
    async mounted() {
        if ($ENV.NODE_ENV === 'development') {
            const area = document.querySelector('#drawing-main svg g')!;

            Object.defineProperty(window, '$debugger', {
                enumerable: false,
                writable: false,
                value: new debug(),
            });

            area.appendChild($debugger.$el);
        }

        const map = utils.getQueryByName('map');
        let data: CircuitStorage = { data: [] };

        if (map) {
            try {
                data = await utils.get<CircuitStorage>(`/examples/${map}.json`);
            }
            catch (e) {
                console.error(e);
            }
        }

        // 加载数据
        await this.$store.dispatch('IMPORT_DATA', data);
        await this.$nextTick();

        // 初始化完成
        loaded();
    },
});
