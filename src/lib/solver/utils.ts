import Matrix from '../matrix';

export type HashMap = AnyObject<number>;

/** 从管脚到支路电流计算矩阵 */
export function pinToCurrent(pin: string, nodeHash: HashMap, branchHash: HashMap, branchNumber: number) {
    const branch: string[] = [];
    const node = nodeHash[pin];

    // 和当前管脚相连的其余管脚
    for (const i in nodeHash) {
        if (nodeHash.hasOwnProperty(i)) {
            if ((nodeHash[i] === node) && (i !== pin)) {
                branch.push(i);
            }
        }
    }

    const ans = new Matrix(1, branchNumber);

    for (const branchName of branch) {
        ans.set(0, branchHash[branchName], Math.pow(-1, Number(branchName.slice(-1)) + 1));
    }

    return (ans);
}

/** 从管脚到节点电压计算矩阵 */
export function pinToVoltage(pin: string, nodeHash: HashMap, nodeNumber: number) {
    const ans = new Matrix(1, nodeNumber);

    for (let i = 0; i < 2; i++) {
        if (nodeHash[pin[i]]) {
            ans.set(0, nodeHash[pin[i]] - 1, Math.pow(-1, i));
        }
    }

    return (ans);
}

/** 根据器件返回支路标号 */
export function partToBranch(part: string, branchHash: HashMap) {
    return branchHash[part + '-0'];
}
