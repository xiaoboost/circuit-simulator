import * as utils from './utils';

import { PartData } from 'src/components/electronic-part/component';
import { default as Electronics, PartType } from 'src/components/electronic-part/parts';

import { LineData } from 'src/components/electronic-line/component';
import { LineType } from 'src/components/electronic-line/helper';

type HashMap = utils.HashMap;

/** 求解器 */
export default class Solver {
    /** 器件数据 */
    parts: PartData[];
    /** 导线数据 */
    lines: LineData[];
    /** [管脚->节点号] 对应表 */
    PinNodeMap: HashMap = {};
    /** [管脚->支路号] 对应表 */
    PinBranchMap: HashMap = {};

    constructor(parts: PartData[], lines: LineData[]) {
        this.parts = parts;
        this.lines = lines;
    }

    /** 节点数量 */
    get nodeNumber() {
        return Math.max(...Object.values(this.PinNodeMap));
    }
    /** 支路数量 */
    get branchNumber() {
        return Math.max(...Object.values(this.PinBranchMap));
    }

    /** 用 id 搜索器件或导线 */
    private findPart(id: string) {
        let result: PartData | LineData | undefined;

        if (/^line_/.test(id)) {
            result = this.lines.find((line) => line.id === id);
        }
        else {
            const [partId] = id.split('-');
            result = this.parts.find((part) => part.id === partId);
        }

        if (!result) {
            throw new Error(`未能找到该器件：${id}`);
        }

        return result;
    }

    /** 扫描所有导线，生成 [管脚->节点号] 对应表 */
    private setPinNodeMap() {
        const pinNodeMap: HashMap = {};
        const lineHash: AnyObject<boolean> = {};

        /** 节点数量，初始为 1 */
        let nodeNumber = 1;

        // 搜索所有导线
        for (const line of this.lines) {
            // 当前导线已经访问过了
            if (lineHash[line.id]) {
                continue;
            }

            // 临时导线堆栈
            const temp = [line];

            // 搜索当前导线构成的节点
            while (temp.length) {
                const current = temp.pop()!;
                const connections = current.connect.join(' ').split(' ');

                // 记录当前访问导线
                lineHash[current.id] = true;

                // 循环迭代当前导线所有的连接
                for (const id of connections) {
                    const item = this.findPart(id);

                    // 导线
                    if (item.type === LineType.Line) {
                        if (!temp.find((li) => li.id === id)) {
                            temp.push(item);
                        }
                    }
                    // 器件（此时的连接点是带引脚号的）
                    else {
                        pinNodeMap[id] = nodeNumber;
                    }
                }
            }

            // 一次 while 循环就是一个节点，节点数量 + 1
            nodeNumber++;
        }
    }

    /** 扫描所有器件，生成 [管脚->支路号] 对应表 */
    private setPinBranchMap() {
        let branchNumber = 0;

        for (const part of this.parts) {
            // 辅助器件，不建立支路
            if (
                part.type === PartType.CurrentMeter ||
                part.type === PartType.VoltageMeter ||
                part.type === PartType.ReferenceGround
            ) {
                continue;
            }

            const prototype = Electronics[part.type];

            // 一个器件一个支路
            for (let i = 0; i < prototype.points.length; i++) {
                this.PinBranchMap[`${part.id}-${i}`] = branchNumber;
            }

            branchNumber++;
        }
    }

    /** 拆分所有能拆分的器件 */
    private apartBranch() {

    }
}
