import Vue from 'vue';
import main from './index.vue';
import { Point } from 'src/lib/point';

export default main;

/** 导线数据接口 */
export interface LineData {
    id: string;
    type: 'line';
    way: Point[];
    connect: string[];
}

export interface LineComponent extends Vue {
    id: string;
}
