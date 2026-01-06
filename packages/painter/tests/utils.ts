import path from 'path';
import { PainterScope } from '@circuit/contracts/painter';
import { createScopeTestUtils, clearRegister } from '@circuit/inject-test-utils';

const testUtils = createScopeTestUtils({
  scope: PainterScope,
  resolveRegister: (file: string) => import(path.resolve(__dirname, '../src/plugins', file)),
});

export const registerPlugin = testUtils.registerPlugin;
export const getService = testUtils.getService;
export const getServiceAfterMounted = testUtils.getServiceAfterMounted;
export { clearRegister };
