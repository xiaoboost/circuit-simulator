import vuex from 'src/vuex';
import { clone } from 'src/lib/utils';
import { PartCore } from '../electronic-part';

/** 每类器件的最大数量 */
const maxNumber = 50;

/**
 * 生成器件或者导线的新 ID
 * @param {string} id
 * @returns {string}
 */
export function createId(id: string): string {
    const electrons = [...vuex.state.Parts];  // , ...vuex.state.Lines
    const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;

    const max = (pre[1] === 'line') ? Infinity : maxNumber;

    for (let i = 1; i <= max; i++) {
        const ans = `${pre[1]}_${i}`;
        if (electrons.findIndex((elec) => elec.id === ans) === -1) {
            return (ans);
        }
    }

    throw new Error(`(electronic) The maximum number of Devices is ${maxNumber}.`);
}

export function findPartCore(id: string): PartCore {
    const idMatch = (id.match(/[a-zA-Z]+_[a-zA-Z0-9]+/)!)[0];
    const result = vuex.state.Parts.find((part) => part.id === idMatch);

    if (!result) {
        throw new Error(`Can not find this part: ${id}`);
    }

    return clone(result);
}

// export function findLineCore() {

// }
