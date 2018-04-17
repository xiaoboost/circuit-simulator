import 'src/css/main';

import Vue, { VNodeChildrenArrayContents } from 'vue';

import Hello from 'src/components/hello-world';

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
    el: '#app',
    name: 'Main',
    components: { Hello },
    render: (h) => h(
        'main', { attrs: { id: 'app' }},
        [h('hello')] as VNodeChildrenArrayContents,
    ),
    mounted() {
        loaded();
    },
});
