import 'jest-extended';

import toEqualArray from './matchers/toEqualArray';
import toEqualMatrix from './matchers/toEqualMatrix';

const jestExpect = (global as any).expect as jest.Expect;

jestExpect.extend({
    toEqualArray,
    toEqualMatrix,
});
