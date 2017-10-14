import 'src/css/main';
import 'src/lib/init';

import Vue from 'vue';
import App from 'src/App.vue';
import store from 'src/vuex';

import delegate from 'src/plugin/delegate';

Vue.use(delegate);
Vue.config.productionTip = false;

const instance = {
    store,
    el: '#app',
    template: '<App/>',
    components: { App },
};

// 调试状态时运行这段代码
if (window.$env.NODE_ENV === 'development') {
    instance.mounted = () => {
        const area = document.querySelector('.drawing-main svg g') as Element,
            Compo = require('src/lib/debugger').default;

        // 调试组件独立于 app，挂在全局变量上
        window.$debug = new Compo();
        area.appendChild(window.$debug.$el);
    };
}
// init vue
new Vue(instance);

// remove loading
window.onload = () => {
    const loading = document.getElementById('start-loading') as HTMLElement;
    loading.style.opacity = '0';
    loading.style.transition = 'opacity .5s';
    setTimeout(() => loading.remove(), 500);
    console.log('Schematic Ready.');
};
