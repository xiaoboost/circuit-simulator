import Vue from 'vue';
import main from './index.vue';
import { Point } from 'src/lib/point';
import { ParmasDescription } from 'src/components/electronic-part/shape';

export default main;

/** 参数描述接口 */
export interface Params extends ParmasDescription {
    value: string;
}

export interface ParamsDialog extends Vue {
    /** 对应器件 ID 编号 */
    id: string;
    /** 参数列表 */
    params: Params[];
    /** 是否显示 */
    vision: boolean;
    /** 指向的器件坐标 */
    position: Point;
    /** 点击取消按钮 */
    cancel(): void;
    /** 点击确认按钮 */
    comfirm(): void;
}
