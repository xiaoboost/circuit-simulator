import * as utils from './utils';

import {
    default as ElectronicCore,
    PartComponents,
    LineComponents,
} from 'src/components/electronic-part/common';

/** 求解器 */
class Solver {
    /** 当前电路网络中的器件 */
    parts: ElectronicCore[];
    /** 当前电路网络中的导线 */
    lines: ElectronicCore[];

    constructor(parts: ElectronicCore[], lines: ElectronicCore[]) {
        this.parts = parts;
        this.lines = lines;
    }
}

/**
 * 全图创建求解器
 *  - 电路网络拆分，每个电路网络一个求解器
 */
export default function createSolvers() {

}
