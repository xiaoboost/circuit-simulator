import Vue from 'vue';
import { Point } from 'src/lib/point';
import { Matrix } from 'src/lib/matrix';

import { PartCore } from './part-core';
import Electronics, { PartTypes } from './parts';

/** 组件对外接口 */
export interface ComponentInterface extends PartCore {
    /** 当前器件是否被选中 */
    readonly focus: boolean;
    /** 当前器件引脚的大小 */
    pointSize: number[];

    /** 渲染器件说明文本文本 */
    renderText(): void;
}
