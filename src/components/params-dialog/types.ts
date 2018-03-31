import Vue from 'vue';
import { Point } from 'src/lib/point';
import InputVerifiable from 'src/components/input-verifiable';
import { ParmasDescription } from 'src/components/electronic-part/types';

/** 参数描述接口 */
export interface Params extends Omit<ParmasDescription, 'default' | 'vision'> {
    value: string;
}

export interface ComponentInterface extends Vue {
    /** 对应器件 ID 编号 */
    id: string;
    /** 参数列表 */
    params: Params[];
    /** 是否显示 */
    vision: boolean;
    /** 指向的器件坐标 */
    position: Point;
    /** 子组件定义 */
    $refs: {
        id: InputVerifiable;
        params: InputVerifiable[];
        dialog: HTMLElement;
    };

    /** 点击取消按钮 */
    cancel(): void;
    /** 点击确认按钮 */
    confirm(): void;
}
