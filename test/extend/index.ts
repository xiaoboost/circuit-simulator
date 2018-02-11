import 'jest-extended';

import toEqualArray from './matchers/toEqualArray';
import toEqualMatrix from './matchers/toEqualMatrix';
import toEqualObject from './matchers/toEqualObject';

const jestExpect = (global as any).expect as jest.Expect;

jestExpect.extend({
    toEqualArray,
    toEqualMatrix,
    toEqualObject,
});
