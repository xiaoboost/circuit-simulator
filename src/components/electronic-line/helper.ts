import { $P } from 'src/lib/point';
import { randomString } from 'src/lib/utils';

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
    way: [$P(0, 0), $P(0, 0)],
});
