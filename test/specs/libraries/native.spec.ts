describe('native.ts: extend native data types', () => {
    describe('Array', () => {
        test('Array.prototype.get()', () => {
            const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            expect(arr.get(0)).toBe(0);
            expect(arr.get(2)).toBe(2);
            expect(arr.get(-1)).toBe(9);
            expect(arr.get(-2)).toBe(8);
            expect(arr.get(-10)).toBe(0);

            expect(() => arr.get(10)).toThrowError('(array) index out of bounds.');
            expect(() => arr.get(-11)).toThrowError('(array) index out of bounds.');
        });
        test('Array.prototype.delete()', () => {
            let result: boolean;
            const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            result = arr.delete((item) => Math.floor(item / 2) === item / 2);

            expect(result).toBe(true);
            expect(arr).toEqual([1, 3, 5, 7, 9]);

            result = arr.delete(3);

            expect(result).toBe(true);
            expect(arr).toEqual([1, 5, 7, 9]);

            result = arr.delete((item) => Math.floor(item / 2) !== item / 2, false);

            expect(result).toBe(true);
            expect(arr).toEqual([5, 7, 9]);

            result = arr.delete(1);

            expect(result).toBe(false);
            expect(arr).toEqual([5, 7, 9]);
        });
        test('Array.prototype.unique()', () => {
            const arr1 = [0, 0, 2, 1, 4, 2, 6, 8, 8, 4].unique();
            expect(arr1).toEqual([0, 2, 1, 4, 6, 8]);

            const arr2 = [0, 1, 2, 3, 4, 5, 6].unique((value) => value < 4 ? 4 : value);
            expect(arr2).toEqual([0, 5, 6]);
        });
        test('Array.prototype.$set()', () => {
            const arr = [0, 1, 2, 3, 4];

            arr.$set(1, 1);
            arr.$set(3, 10);

            expect(arr).toEqual([0, 1, 2, 10, 4]);
        });
    });
    describe('Number', () => {
        test('Number.prototype.rank()', () => {
            expect((100).rank()).toBe(2);
            expect((0.001).rank()).toBe(-3);
            expect((12.34).rank()).toBe(1);
            expect((0.1234).rank()).toBe(-1);

            expect(() => (NaN).rank()).toThrowError('(number) cannot run .rank() on NaN');
        });
        test('Number.prototype.toRound()', () => {
            expect((123456789).toRound()).toBe(123457000);
            expect((123.456789).toRound()).toBe(123.457);
            expect((-123.456789).toRound()).toBe(-123.457);
            expect((0.123456789).toRound()).toBe(0.123457);
            expect((0.00123456789).toRound()).toBe(0.00123457);
            expect((0.00123456789).toRound(2)).toBe(0.0012);
            expect((-0.00123456789).toRound(2)).toBe(-0.0012);
            expect((0.00123456789).toRound(8)).toBe(0.0012345679);

            expect(() => (NaN).toRound()).toThrowError('(number) cannot run .toRound() on NaN');
        });
    });
});
