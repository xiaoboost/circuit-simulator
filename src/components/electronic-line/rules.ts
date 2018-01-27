import { Point } from 'src/lib/point';
import { NodeData } from './node-search';

/**
 * 根据状态生成具体的规则集合
 * @class Rules
 */
export class Rules {
    status: string;

    constructor(start: Point, end: Point, status: string) {
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
