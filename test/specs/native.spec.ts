import '../extend';
import 'src/lib/native';

const example = '{"status":0,"data":[{"user":{"name":"name1","url":"url1","avatarUrl":"avatarUrl1"},"url":"url1","title":"title1","startWord":"startWord1","joinedUsers":"1"},{"user":{"name":"name2","url":"url2","avatarUrl":"avatarUrl2"},"url":"url2","title":"title2","startWord":"startWord2","joinedUsers":"2"},{"user":{"name":"name3","url":"url3","avatarUrl":"avatarUrl3"},"url":"ur3","title":"title3","startWord":"startWord3","joinedUsers":"3"},{"user":{"name":"name4","url":"url4","avatarUrl":"avatarUrl4"},"url":"url4","title":"title4","startWord":"startWord4","joinedUsers":"4"}]}';

interface Example {
    status: number;
    data: Array<{
        user: {
            name: string;
            url: string;
            avatarUrl: string;
        };
        url: string;
        title: string;
        startWord: string;
        joinedUsers: string;
    }>;
}

describe('native.ts: extend native data types', () => {
    describe('Object', () => {
        it('Object.prototype.isEmpty()', () => {
            const empty = {}, unempty = { key: 1 };

            expect(empty.isEmpty()).toEqual(true);
            expect(unempty.isEmpty()).toEqual(false);

            Object.defineProperty(unempty, 'key', {
                enumerable: false,
            });

            expect(unempty.isEmpty()).toEqual(true);
        });
        it('Object.prototype.isEqual()', () => {
            const example1 = JSON.parse(example) as Example;
            const example2 = JSON.parse(example) as Example;

            expect(example1.isEqual(1)).toEqual(false);

            expect(example1 === example2).toEqual(false);
            expect(example1.isEqual(example2)).toEqual(true);

            delete example1.status;
            expect(example1.isEqual(example2)).toEqual(false);
        });
    });
    describe('Array', () => {
        it('Array.prototype.get()', () => {
            const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            expect(arr.get(0)).toEqual(0);
            expect(arr.get(2)).toEqual(2);
            expect(arr.get(-1)).toEqual(9);
            expect(arr.get(-2)).toEqual(8);
            expect(arr.get(-10)).toEqual(0);

            expect(() => arr.get(10)).toThrowError('(array) index out of bounds.');
            expect(() => arr.get(-11)).toThrowError('(array) index out of bounds.');
        });
        it('Array.prototype.isEqual()', () => {
            const arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            const arr2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            expect(arr1 === arr2).toEqual(false);
            expect(arr1.isEqual(1)).toEqual(false);
            expect(arr1.isEqual(arr2)).toEqual(true);

            arr2.push(10);
            expect(arr1.isEqual(arr2)).toEqual(false);
        });
        it('Array.prototype.delete()', () => {
            let result: boolean;
            const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            result = arr.delete((item) => Math.floor(item / 2) === item / 2);

            expect(result).toEqual(true);
            expect(arr).toEqualArray([1, 3, 5, 7, 9]);

            result = arr.delete(3);

            expect(result).toEqual(true);
            expect(arr).toEqualArray([1, 5, 7, 9]);

            result = arr.delete((item) => Math.floor(item / 2) !== item / 2, false);

            expect(result).toEqual(true);
            expect(arr).toEqualArray([5, 7, 9]);

            result = arr.delete(1);

            expect(result).toEqual(false);
            expect(arr).toEqualArray([5, 7, 9]);
        });
        it('Array.prototype.unique()', () => {
            const arr1 = [0, 0, 2, 1, 4, 2, 6, 8, 8, 4].unique();
            expect(arr1).toEqualArray([0, 2, 1, 4, 6, 8]);

            const arr2 = [0, 1, 2, 3, 4, 5, 6].unique((value) => value < 4 ? 4 : value);
            expect(arr2).toEqualArray([0, 5, 6]);
        });
        it('Array.prototype.$set()', () => {
            const arr = [0, 1, 2, 3, 4];

            arr.$set(1, 1);
            arr.$set(3, 10);

            expect(arr).toEqualArray([0, 1, 2, 10, 4]);
        });
    });
    describe('Number', () => {
        it('Number.scientificCountParser()', () => {
            expect(Number.scientificCountParser('mmm')).toEqual(NaN);
            expect(Number.scientificCountParser('100')).toEqual(100);
            expect(Number.scientificCountParser('1m')).toEqual(0.001);
            expect(Number.scientificCountParser('1M')).toEqual(1e6);
            expect(Number.scientificCountParser('1.5G')).toEqual(1.5e9);
            expect(Number.scientificCountParser('1e3')).toEqual(1000);
            expect(Number.scientificCountParser('1e-2')).toEqual(0.01);
        });
        it('Number.prototype.rank()', () => {
            expect((100).rank()).toEqual(2);
            expect((0.001).rank()).toEqual(-3);
            expect((12.34).rank()).toEqual(1);
            expect((0.1234).rank()).toEqual(-1);

            expect(() => (NaN).rank()).toThrowError('(number) cannot run .rank() on NaN');
        });
        it('Number.prototype.toRound()', () => {
            expect((123456789).toRound()).toEqual(123457000);
            expect((123.456789).toRound()).toEqual(123.457);
            expect((-123.456789).toRound()).toEqual(-123.457);
            expect((0.123456789).toRound()).toEqual(0.123457);
            expect((0.00123456789).toRound()).toEqual(0.00123457);
            expect((0.00123456789).toRound(2)).toEqual(0.0012);
            expect((-0.00123456789).toRound(2)).toEqual(-0.0012);
            expect((0.00123456789).toRound(8)).toEqual(0.0012345679);

            expect(() => (NaN).toRound()).toThrowError('(number) cannot run .toRound() on NaN');
        });
    });
});
