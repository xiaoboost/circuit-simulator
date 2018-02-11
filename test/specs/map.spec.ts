import '../extend';

import { $P } from 'src/lib/point';
import * as map from 'src/lib/map';

describe('map.ts: Data marked by drawings', () => {
    test('getPoint/setPoint()', () => {
        expect(map.getPoint([1, 2])).toBeUndefined();

        const data: map.MapPointData = {
            id: 'r_1',
            point: $P(1, 3),
            type: 'part',
            connect: [$P(1, 4), $P(2, 3)],
        };

        map.setPoint(data);
        expect(map.getPoint([1, 3])).toEqualObject(data);

        data.point = $P(40, 60);
        map.setPoint(data, true);
        expect(map.getPoint([40, 60], true)).toEqualObject(data);
    });
});
