import '../extend';
import 'src/lib/native';

import { $M } from 'src/lib/matrix';

describe('matrix.ts: class of Matrix', () => {
    test('create a instance', () => {
        expect($M([[1, 1, 1], [1, 1, 1]])).toEqualMatrix($M(2, 3, 1));
    });
});
