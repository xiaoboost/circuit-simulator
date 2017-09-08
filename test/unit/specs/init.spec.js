import '@/libraries/init';
import { triggerEvent } from '../util';

const example = '{"status":0,"data":[{"user":{"name":"name1","url":"url1","avatarUrl":"avatarUrl1"},"url":"url1","title":"title1","startWord":"startWord1","joinedUsers":"1"},{"user":{"name":"name2","url":"url2","avatarUrl":"avatarUrl2"},"url":"url2","title":"title2","startWord":"startWord2","joinedUsers":"2"},{"user":{"name":"name3","url":"url3","avatarUrl":"avatarUrl3"},"url":"ur3","title":"title3","startWord":"startWord3","joinedUsers":"3"},{"user":{"name":"name4","url":"url4","avatarUrl":"avatarUrl4"},"url":"url4","title":"title4","startWord":"startWord4","joinedUsers":"4"}]}';

describe('init.js', () => {
    it('Object.isEmpty', () => {
        const empty = {}, unempty = { key: 1 };
        expect(Object.isEmpty(empty)).to.be.true;
        expect(Object.isEmpty(unempty)).to.be.false;

        Object.defineProperty(unempty, 'key', {
            enumerable: false,
        });
        expect(Object.isEmpty(unempty)).to.be.true;
        triggerEvent(document, 'contextmenu');
    });
    it('Object.hideAll', () => {
        const obj = JSON.parse(example);
        expect(Object.isEmpty(obj)).to.be.false;

        Object.hideAll(obj);
        expect(Object.isEmpty(obj)).to.be.true;
    });
    it('Object.freezeAll', () => {
        const obj = JSON.parse(example);
        // 是否被递归冻结
        function isFrozenAll(obj) {
            if (!Object.isFrozen(obj)) {
                return (false);
            }
            return Object.values(obj).every((value) => (value instanceof Object)
                ? isFrozenAll(value)
                : true
            );
        }

        expect(isFrozenAll(obj)).to.be.false;
        Object.freeze(obj);
        expect(isFrozenAll(obj)).to.be.false;
        Object.freezeAll(obj);
        expect(isFrozenAll(obj)).to.be.true;
    });
    it('Object.sealAll', () => {
        const obj = JSON.parse(example);
        // 是否被递归封闭
        function isSealedAll(obj) {
            if (!Object.isSealed(obj)) {
                return (false);
            }
            return Object.values(obj).every((value) => (value instanceof Object)
                ? isSealedAll(value)
                : true
            );
        }

        expect(isSealedAll(obj)).to.be.false;
        Object.seal(obj);
        expect(isSealedAll(obj)).to.be.false;
        Object.sealAll(obj);
        expect(isSealedAll(obj)).to.be.true;
    });
    it('Object.prototype.map', () => {
        const obj1 = JSON.parse(example),
            obj2 = obj1.map((v) => v),
            obj3 = obj1.map(() => 0),
            obj4 = obj1.map(() => 0);

        expect(obj1 === obj2).to.be.false;
        expect(obj1.isEqual(obj2)).to.be.true;
        expect(obj3 === obj4).to.be.false;
        expect(obj3.isEqual(obj4)).to.be.true;
    });
    it('Array.prototype.get', () => {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        expect(arr.get(0)).to.be.equal(0);
        expect(arr.get(2)).to.be.equal(2);
        expect(arr.get(-1)).to.be.equal(9);
        expect(arr.get(-2)).to.be.equal(8);
        expect(arr.get(10)).to.be.false;
        expect(arr.get(-10)).to.be.equal(0);
        expect(arr.get(-11)).to.be.false;
    });
    it('(Object | Array).[prototype.](clone | isEqual)', () => {
        const obj1 = JSON.parse(example),
            obj2 = JSON.parse(example),
            obj3 = Object.clone(obj1),
            obj4 = Object.clone(obj2);

        expect(obj1.isEqual(obj2)).to.be.true;
        expect(obj1.isEqual(obj3)).to.be.true;
        expect(obj1.isEqual(obj4)).to.be.true;
        expect(obj2.isEqual(obj3)).to.be.true;
        expect(obj2.isEqual(obj4)).to.be.true;
        expect(obj3.isEqual(obj4)).to.be.true;

        delete obj4.status;
        expect(obj3.isEqual(obj4)).to.be.false;

        expect([0, 1, 2].isEqual(null)).to.be.false;
        expect([0, 1, 2].isEqual(undefined)).to.be.false;
    });
    it('Number prototype', () => {
        // 数量级
        expect((123).rank()).to.be.equal(2);
        expect((1234).rank()).to.be.equal(3);
        expect((12.34).rank()).to.be.equal(1);
        expect((0.1234).rank()).to.be.equal(-1);
        expect((NaN).rank()).to.be.false;
        // 按数量级进行四舍五入
        expect((123456789).toRound()).to.be.equal(123457000);
        expect((123.456789).toRound()).to.be.equal(123.457);
        expect((-123.456789).toRound()).to.be.equal(-123.457);
        expect((0.123456789).toRound()).to.be.equal(0.123457);
        expect((0.00123456789).toRound()).to.be.equal(0.00123457);
        expect((0.00123456789).toRound(2)).to.be.equal(0.0012);
        expect((-0.00123456789).toRound(2)).to.be.equal(-0.0012);
        expect((0.00123456789).toRound(8)).to.be.equal(0.0012345679);
        expect((NaN).toRound()).to.be.false;
    });
});
