import path from 'path';
import { RootScope } from '@circuit/contracts/global';
import { createScopeTestUtils, clearRegister } from '@circuit/inject-test-utils';

const testUtils = createScopeTestUtils({
  scope: RootScope,
  resolveRegister: (file: string) => import(path.resolve(__dirname, '../src/plugins', file)),
});

export const registerPlugin = testUtils.registerPlugin;
export const getServiceAfterMounted = testUtils.getServiceAfterMounted;

export { clearRegister };
