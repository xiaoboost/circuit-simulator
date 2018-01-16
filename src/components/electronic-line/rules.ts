import { Point } from 'src/lib/point';
import { NodeData } from './node-search';

export interface Status {
    direction: Point;
}

/**
 * 根据状态生成具体的规则集合
 * @class Rules
 */
export class Rules {
    status: Status;

    constructor(start: Point, end: Point, status: Status) {
        this.status = status;
    }

    calValue(node: NodeData): number {
        this;
        return 0;
    }
    checkPoint(node: NodeData): boolean {
        this;
        return false;
    }
    isEnd(node: NodeData): boolean {
        this;
        return false;
    }
}
