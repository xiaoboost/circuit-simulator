import { schMap } from '@/libraries/maphash';
import { expect } from '../chai-plugin';

const map = window.__map__;

describe('maphash.js', () => {
    it('get and set', () => {
        const obj1 = { id: 'r_1', type: 'part1', test: 'test1' },
            obj2 = { id: 'r_2', type: 'part2', test: 'test1' },
            obj3 = { id: 'r_2', type: 'part2' };

        schMap.setValueBySmalle([1, 1], obj1);
        schMap.setValueBySmalle([1, 2], obj3);
        expect(map[1][1]).to.be.equalTo(obj1);
        expect(map[1][2]).to.be.equalTo(obj3);
        expect(schMap.getValueBySmalle(1, 1)).to.be.equalTo(obj1);
        expect(schMap.getValueBySmalle(1, 2)).to.be.equalTo(obj3);
        expect(schMap.getValueBySmalle([1, 2])).to.be.equalTo(obj3);

        schMap.setValueBySmalle([1, 1], obj3);
        expect(map[1][1]).to.be.equalTo(obj2);

        schMap.setValueBySmalle([1, 1], obj3, true);
        expect(map[1][1]).to.be.equalTo(obj3);

        schMap.setValueByOrigin([100, 100], obj1);
        expect(map[5][5]).to.be.equalTo(obj1);
        expect(schMap.getValueByOrigin(100, 100)).to.be.equalTo(obj1);
        expect(schMap.getValueByOrigin([100, 100])).to.be.equalTo(obj1);
    });
});
