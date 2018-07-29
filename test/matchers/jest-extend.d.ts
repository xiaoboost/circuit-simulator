interface Matrix {
    row: number;
    column: number;
}

declare namespace jest {
    interface Matchers<R> {
        /** 行列式相等 */
        toEqualMatrix(expected: Matrix): R;
    }
}
