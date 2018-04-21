import vuex from 'src/vuex';
import { clone } from 'src/lib/utils';
import { PartCore } from 'src/components/electronic-part';
import { LineCore } from 'src/components/electronic-line';

/**
 * 搜索器件数据
 * @param {id} string
 * @return {PartCore}
 */
export function findPartCore(id: string): PartCore {
    const idMatch = (id.match(/[a-zA-Z]+_[a-zA-Z0-9]+/)!)[0];
    const result = vuex.state.Parts.find((part: PartCore) => part.id === idMatch);

    if (!result) {
        throw new Error(`Can not find this part: ${id}`);
    }

    const instance = clone(result);
    Object.setPrototypeOf(instance, PartCore.prototype);

    return instance;
}

/**
 * 搜索导线数据
 * @param {id} string
 * @return {LineCore}
 */
export function findLineCore(id: string): LineCore {
    const result =  vuex.state.Lines.find((line: LineCore) => line.id === id);

    if (!result) {
        throw new Error(`Can not find this line: ${id}`);
    }

    const instance = clone(result);
    Object.setPrototypeOf(instance, LineCore.prototype);

    return instance;
}
