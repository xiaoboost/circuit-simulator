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
});
