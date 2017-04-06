import Vue from 'vue';
import Router from 'vue-router';

import Slider from '@/view/Slider/index.vue';
import Config from '@/view/Slider/Config.vue';
import AddParts from '@/view/Slider/AddParts.vue';
import Graph from '@/view/Graph/index.vue';

Vue.use(Router);

export default new Router({
    routes: [
        { path: '/slider', name: 'Slider', component: Slider,
            children: [
                { path: 'config', name: 'Config', component: Config },
                { path: 'add-parts', name: 'AddParts', component: AddParts  }
            ]
        },
        { path: '/graph', name: 'Graph', component: Graph }
    ]
});
