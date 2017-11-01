import 'src/css/main';
import 'src/lib/init';

import Vue from 'vue';
import App from 'src/App.vue';
import store from 'src/vuex';

import delegate from 'src/plugin/delegate';

Vue.use(delegate);
Vue.config.productionTip = ($ENV.NODE_ENV === 'development');

// 调试状态时运行这段代码
// if ($ENV.NODE_ENV === 'development') {
//     instance.mounted = () => {
//         const area = document.querySelector('.drawing-main svg g') as Element,
//             // tslint:disable-next-line:no-require-imports
//             Compo = require('src/lib/debugger').default;

//         // 调试组件独立于 app，挂在全局变量上
//         window.$DEBUG = new Compo();
//         area.appendChild(window.$DEBUG.$el);
//     };
// }

// init vue
new Vue({
    store,
    el: '#app',
    name: 'App',
    components: { App },
    render: (h) => h('App', { ref: 'main' }),
});

// remove loading
window.onload = () => {
    const loading = document.getElementById('start-loading');

    if (!loading) {
        return;
    }

    loading.style.opacity = '0';
    loading.style.transition = 'opacity .5s';
    setTimeout(() => loading.remove(), 500);
    console.log('Schematic Ready.');
};
