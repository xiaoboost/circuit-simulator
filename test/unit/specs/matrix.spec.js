import { $M } from '@/libraries/matrix';
import { expect } from '../chai-plugin';

function compare(a, b) {
    return a.row === b.row &&
        a.column === b.column &&
        a.every((n, [x, y]) => n === b.get(x, y));
}

describe('matrix.js', () => {
    it('create', () => {
        let ma1, ma2, temp;

        // 行不连续
        ma1 = $M([[0, 1, 2, 3],, [4, 5, 6, 7]]);
        expect(ma1).to.be.empty;
        // 列不连续
        ma1 = $M([[0, 1, 2,, 3], [4, 5, 6,, 7]]);
        expect(ma1).to.be.empty;
        // 含有非法元素
        ma1 = $M([[0, 1, 2, 3], [4, 5, '6', 7]]);
        expect(ma1).to.be.empty;

        // 从数组创建
        ma1 = $M([[0, 1, 2, 3], [4, 5, 6, 7]]);
        expect(ma1.row).to.be.equal(2);
        expect(ma1.column).to.be.equal(4);
        // 从矩阵创建
        ma2 = $M(ma1);
        expect(compare(ma1, ma2)).to.be.true;
        // 从参数创建
        ma1 = $M(5, 'E');
        ma2 = $M(5, 5, 10);
        expect(compare(ma1, ma2)).to.be.false;
        ma2.forEach((n, [x, y]) => ma2.set(x, y, 0));
        ma2.forEach((n, [x, y]) => (x === y) && ma2.set(x, y, 1));
        expect(compare(ma1, ma2)).to.be.true;

        // // 设置值
        ma1 = $M([[0, 1, 2, 3], [4, 5, 6, 7]]);
        ma2 = $M([[0, 1, 2, 3], [4, 10, 6, 7]]);
        ma1.set(1, 1, 10);
        expect(compare(ma1, ma2)).to.be.true;
    });
    it('get row / column', () => {
        const ma = $M([[0, 1, 2, 3], [4, 5, 6, 7]]);
        expect(ma.getRow(0)).to.be.equalTo([0, 1, 2, 3]);
        expect(ma.getRow(-1)).to.be.equalTo([4, 5, 6, 7]);
        expect(ma.getRow(-3)).to.be.false;
        expect(ma.getColumn(0)).to.be.equalTo([0, 4]);
        expect(ma.getColumn(-1)).to.be.equalTo([3, 7]);
        expect(ma.getColumn(20)).to.be.false;
    });
    it('toString / join', () => {
        const ma = $M([[0, 1, 2.3, 3], [4, 50, 6, 7], [8, 9, 10, 11]]);
        const str = '0,   1,  2.3,   3;\n4,  50,    6,   7;\n8,   9,   10,  11;\n';
        const join='0,1,2.3,3,4,50,6,7,8,9,10,11';
        expect(ma.toString()).to.be.equal(str);
        expect(ma.join(',')).to.be.equal(join);
    });
    it('exchange', () => {
        const ma = $M([[0, 3, 2, 1], [4, 7, 6, 5], [8, 11, 10, 9]]),
            exchanged = $M([[8, 9, 10, 11], [4, 5, 6, 7], [0, 1, 2, 3]]);

        ma.exchange([1, 1], [1, 1]);
        ma.exchange([0, 1], [2, 3]);
        expect(compare(ma, exchanged)).to.be.true;
    });
    it('multiplication', () => {
        const ma1 = $M([
            [40, 31, 47, 47],
            [45,  4, 48, 24],
            [ 6, 13,  7, 40],
            [45, 27, 48,  7]
        ]);
        const ma2 = [
            [21, 32, 33, 32],
            [45,  1, 37,  8],
            [39, 42, 37, 35],
            [47, 46, 19,  1]
        ];
        const mul = $M([
            [6277, 5447, 5099, 3220],
            [4125, 4564, 3865, 3176],
            [2864, 2339, 1698,  581],
            [4361, 3805, 4393, 3343]
        ]);
        const multo = $M([
            [3918, 2072, 4290, 3299],
            [2427, 2096, 2806, 3675],
            [5247, 2803, 5788, 4566],
            [4109, 1915, 4598, 4080]
        ]);

        expect(compare(ma1.mul(ma2), mul)).to.be.true;
        expect(compare(ma1.multo(ma2), multo)).to.be.true;
        expect(compare(ma1.multo($M(ma2)), multo)).to.be.true;
        expect(ma1.multo([[0, 1]])).to.be.false;
    });
    it('inverse', () => {
        let ma = $M([[1, 0], [0, 1]]), ans = void 0;
        expect(compare(ma.inverse(), ma)).to.be.true;

        ma = $M([[0, -1], [1, 0]]);
        ans = $M([[0, 1], [-1, 0]]);
        expect(compare(ma.inverse(), ans)).to.be.true;

        expect($M([[0, 1]]).luDecompose()).to.be.false;
        expect($M([[0, 0], [0, 0]]).inverse()).to.be.false;
    });
});
