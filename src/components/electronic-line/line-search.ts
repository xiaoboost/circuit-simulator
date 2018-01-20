import Search from 'worker-loader!./node-search';

import LineWay from './line-way';
import ProcessManager from 'src/lib/process';

import { ExchangeData } from './types';

// 格式化返回的数据
// TODO:
function process2Data(data: string): any {
    return data;
}

// 导线搜索进程管理器
const Manager = new ProcessManager(Search);

export default async function lineSearch(option: ExchangeData): Promise<LineWay> {
    const search = await Manager.getIdleProcess();
    const result = await search.post<string>(option);
    return process2Data(result);
}
