import Vue from 'vue';
import PartCore from './part-core';

/** 组件对外接口 */
export interface ComponentInterface extends PartCore {
    /** 当前器件是否被选中 */
    readonly focus: boolean;
    /** 当前器件引脚的大小 */
    readonly pointSize: number[];

    /** 渲染器件说明文本文本 */
    renderText(): void;
}
