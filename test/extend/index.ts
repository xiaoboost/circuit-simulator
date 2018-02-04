import 'jest-extended';

import toEqualArray from './matchers/toEqualArray';

const jestExpect = (global as any).expect as jest.Expect;

jestExpect.extend({
    toEqualArray,
});
