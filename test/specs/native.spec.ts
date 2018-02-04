import 'src/lib/native';

describe('native.ts: extend native data types', () => {
    describe('Object.prototype', () => {
        it('Object.prototype.isEmpty()', () => {
            const empty = {}, unempty = { key: 1 };

            expect(empty.isEmpty()).toEqual(true);
            expect(empty.isEmpty()).toEqual(false);

            Object.defineProperty(unempty, 'key', {
                enumerable: false,
            });

            expect(unempty.isEmpty()).toEqual(true);
        });
    });
});
