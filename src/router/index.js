import Vue from 'vue';
import Router from 'vue-router';

import Graph from '@/view/graph';
import Slider from '@/view/slider';
import Config from '@/view/slider/config.vue';
import AddParts from '@/view/slider/add-parts.vue';

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
