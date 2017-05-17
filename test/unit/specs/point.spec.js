import { $P } from '@/libraries/point';
import { expect } from '../chai-plugin';

describe('point.js', () => {
    it('create', () => {
        const zero = [0, 0];

        let point = $P(zero);
        expect(point).to.be.equalTo(zero);
        point = $P(5);
        expect(point).to.be.equalTo([5, 5]);
        point = $P(5, 'a');
        expect(point).to.be.equalTo([5, 5]);
        point = $P(5, '10');
        expect(point).to.be.equalTo([5, 10]);
        point = $P([0, 1], [10, 0]);
        expect(point).to.be.equalTo([10, -1]);
        point = $P('dsa', 'dsadsa');
        expect(point).to.be.empty;
    });
    it('point operation', () => {
        const point = $P(1, 2);
        // 加减
        expect(point.add(1)).to.be.equalTo([2, 3]);
        expect(point.add([2, 3])).to.be.equalTo([3, 5]);
        expect(point.add(-1, 5)).to.be.equalTo([-4, -3]);
        expect(point.add(-1, [2, 3])).to.be.equalTo([-1, -1]);
        // 乘除
        expect(point.mul(3)).to.be.equalTo([3, 6]);
        expect(point.mul([2, 3])).to.be.equalTo([2, 6]);
        expect(point.mul(-1, 5)).to.be.equalTo([0.2, 0.4]);
        expect(point.mul(-1, [2, 4])).to.be.equalTo([0.5, 0.5]);
        // 点距离
    });
    it('point standardized', () => {
        // 四舍五入
        expect($P(912, 830).round()).to.be.equalTo([920, 840]);
        expect($P(912, 835).round(10)).to.be.equalTo([910, 840]);
        expect($P(-575, -328).round()).to.be.equalTo([-580, -320]);
        expect($P(-575, -328).round(10)).to.be.equalTo([-580, -330]);
        // 四舍五入至小单位
        expect($P(912, 830).roundToSmall()).to.be.equalTo([46, 42]);
        expect($P(912, 835).roundToSmall(10)).to.be.equalTo([91, 84]);
        expect($P(-575, -328).roundToSmall()).to.be.equalTo([-29, -16]);
        expect($P(-575, -328).roundToSmall(10)).to.be.equalTo([-58, -33]);
        // 向下取整
        expect($P(912, 830).floor()).to.be.equalTo([900, 820]);
        expect($P(912, 835).floor(10)).to.be.equalTo([910, 830]);
        expect($P(-575, -328).floor()).to.be.equalTo([-580, -340]);
        expect($P(-575, -328).floor(10)).to.be.equalTo([-580, -330]);
        // 向下取整至小单位
        expect($P(912, 830).floorToSmall()).to.be.equalTo([45, 41]);
        expect($P(912, 835).floorToSmall(10)).to.be.equalTo([91, 83]);
        expect($P(-575, -328).floorToSmall()).to.be.equalTo([-29, -17]);
        expect($P(-575, -328).floorToSmall(10)).to.be.equalTo([-58, -33]);
    });
    it('vector transfrom', () => {
        // 向量相乘
        expect($P(1, -2).product([10, 0.5])).to.be.equal(9);
        expect($P(10, 0.8).product([2, 10])).to.be.equal(28);
        // 向量绝对值
        expect($P(-1, -2).abs()).to.be.equalTo([1, 2]);
        // 向量单位化
        const unit01 = [-0.4472135954999579, -0.8944271909999159];
        const unit02 = [-0.12403473458920847, 0.9922778767136677];
        const unit03 = [-1.2403473458920847, 9.922778767136677];
        expect($P(-1, -2).toUnit()).to.be.approximate(unit01);
        expect($P(-1, 8).toUnit()).to.be.approximate(unit02);
        expect($P(-1, 8).toUnit(10)).to.be.approximate(unit03);
    });
    it('vector predicate', () => {
        // 整数点
        expect($P(1, -2).isInteger()).to.be.true;
        expect($P(1, -1.8).isInteger()).to.be.false;
        // 是否平行
        expect($P(1, -2).isParallel([-1, 2])).to.be.true;
        expect($P(1, -2).isParallel([0, 0])).to.be.false;
        // 是否垂直
        expect($P(1, -2).isVertical([2, 1])).to.be.true;
        expect($P(1, -4).isVertical([4, 1])).to.be.true;
        expect($P(0, -4).isVertical([-4, 1])).to.be.false;
        // 方向相同
        expect($P(1, -2).isSameDire([2, -4])).to.be.true;
        // 方向相反
        expect($P(1, -2).isOppoDire([-2, 4])).to.be.true;
    });
});
