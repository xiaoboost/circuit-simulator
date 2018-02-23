import { delay } from 'src/lib/utils';
import ProcessManager from 'src/lib/process';
import Test from 'worker-loader!../utils/test.worker';

describe('process.ts: manager of Worker.', () => {
    test('should work', async () => {
        const manager = new ProcessManager(Test, {
            min: 2,
            max: 3,
            timeout: 5,
        });

        expect(manager.pool.length).toEqual(2);
    });
});
