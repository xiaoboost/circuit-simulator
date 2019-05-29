import Vue, { ComponentOptions } from 'vue';

Vue.config.productionTip = false;
process.env.NODE_ENV = 'production';

/** 空组件 */
const spaceComponen: ComponentOptions<Vue> = {
    render: (h) => h('template'),
};

Vue.component('a-button', spaceComponen);
Vue.component('a-input', spaceComponen);
Vue.component('a-tooltip', spaceComponen);
Vue.component('a-popover', spaceComponen);
Vue.component('a-input-group', spaceComponen);
