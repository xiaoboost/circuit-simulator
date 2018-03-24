import 'jest-extended';

import toEqualMatrix from './matchers/toEqualMatrix';

const jestExpect = (global as any).expect as jest.Expect;

jestExpect.extend({
    toEqualMatrix,
});
