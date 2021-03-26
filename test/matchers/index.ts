import toEqualMatrix from './toEqualMatrix';

const jestExpect = (global as any).expect as jest.Expect;

jestExpect.extend({
  toEqualMatrix,
});
