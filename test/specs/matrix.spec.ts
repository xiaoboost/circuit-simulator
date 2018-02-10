import '../extend';
import 'src/lib/native';

import { $M, Matrix } from 'src/lib/matrix';

describe('matrix.ts: class of Matrix', () => {
    test('create a instance', () => {
        let ma: Matrix;
        // 0 行列式填充以及从数组到行列式
        expect($M([[0, 0, 0], [0, 0, 0]])).toEqualMatrix($M(2, 3));
        // 0矩阵
        ma = $M(5);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j <= 0; j++) {
                expect(ma.get(i, j)).toEqual(0);
            }
        }
        // 单位矩阵
        ma = $M(5, 'E');
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j <= 0; j++) {
                expect(ma.get(i, j)).toEqual(Number(i === j));
            }
        }
        // 复制矩阵
        const copy = $M(ma);
        expect(copy === ma).toBeFalse();
        expect(copy).toEqualMatrix(ma);

        // 非法矩阵
        // 含有 NaN
        expect(() => $M([[0, NaN, 0], [0, 0, 0]])).toThrowError('(matrix) this is not a matrix.');
        // 列不连续
        expect(() => $M([[0, 0, 0], [0, 0]])).toThrowError('(matrix) this is not a matrix.');
        // 行不连续
        const error = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        Object.defineProperty(error, '1', { enumerable: false });
        expect(() => $M(error)).toThrowError('(matrix) this is not a matrix.');
    });
    test('Matrix.prototype.join()', () => {
        const ma = $M([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
        expect(ma.join('; ')).toEqual('1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 11; 12; 13; 14; 15; 16');
    });
    test('Matrix.prototype.get/set()', () => {
        const ma = $M([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);
        expect(ma.get(1, 2)).toEqual(7);

        ma.set(2, 1, 100);
        expect(ma.get(2, 1)).toEqual(100);

        expect(ma.get(5, 5)).toBeUndefined();
    });
    test('Matrix.prototype.getRow/getColumn()', () => {
        const ma = $M([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);

        expect(ma.getRow(0)).toEqualArray([1, 2, 3, 4]);
        expect(ma.getRow(-1)).toEqualArray([13, 14, 15, 16]);
        expect(() => ma.getRow(9)).toThrowError('(matrix) index of row out of bounds.');

        expect(ma.getColumn(0)).toEqualArray([1, 5, 9, 13]);
        expect(ma.getColumn(-1)).toEqualArray([4, 8, 12, 16]);
        expect(() => ma.getColumn(9)).toThrowError('(matrix) index of column out of bounds.');
    });
    test('Matrix.prototype.exchangeRow/exchangeColumn()', () => {
        const ma = $M([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);

        ma.exchangeRow(1, 1);
        expect(ma.getRow(1)).toEqual([5, 6, 7, 8]);

        ma.exchangeRow(1, 2);
        expect(ma.getRow(1)).toEqual([9, 10, 11, 12]);
        expect(ma.getRow(2)).toEqual([5, 6, 7, 8]);

        ma.exchangeColumn(2, 2);
        expect(ma.getColumn(2)).toEqual([3, 11, 7, 15]);

        ma.exchangeColumn(1, 3);
        expect(ma.getColumn(1)).toEqual([4, 12, 8, 16]);
        expect(ma.getColumn(3)).toEqual([2, 10, 6, 14]);
    });
});
