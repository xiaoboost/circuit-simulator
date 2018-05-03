import { PartCoreData } from 'src/components/electronic-part';
import { LineCoreData } from 'src/components/electronic-line';

interface PartNodeConnect {
    [index: string]: number;
}

/**
 * 解析器件连接关系
 * @param {LineCoreData[]} lines 导线列表
 * @return 器件连接关系
 */
export function compilePartsNet(lines: LineCoreData[]) {
    // [管脚->节点号]对应表
    const nodeHash: PartNodeConnect = {};
    const access: string[] = [];
    // 节点数量
    let nodeNumber = 1;

    // 扫描所有导线(以后可能还会有“网络标识符”)，建立[管脚->节点号]对应表
    lines.forEach((line) => {
        if (access.includes(line.id)) {
            return;
        }

        // 搜索用临时导线堆栈
        const stack = [line];

        // 搜索当前导线构成的节点
        while (stack.length) {
            const current = stack.pop()!;
            access.push(current.id);

            current.connect.join(' ').split(' ').forEach((item) => {
                if (item.search('-') !== -1) {
                    // 连接的是器件
                    nodeHash[item] = nodeNumber;
                }
                else {
                    // 连接的是导线
                    const connectLine = lines.find((l) => l.id === item);

                    if (connectLine && !access.includes(connectLine.id)) {
                        stack.push(connectLine);
                    }
                }
            });
        }
        nodeNumber++;

        access.push(line.id);
    });

    return nodeHash;
}

export function outSpiceCode() {

}
