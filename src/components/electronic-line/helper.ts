import { randomString } from 'src/lib/utils';
import { LineWay } from './line-way';
import { LineData } from './component';
import { createId } from 'src/components/electronic-part/common';

/**
 * 生成完整的初始化导线数据
 */
export const createLineData = (): LineData => ({
    type: 'line',
    hash: randomString(),
    id: createId('line'),
    connect: ['', ''],
    way: LineWay.from([[1e6, 1e6]]),
});
