import { buildConfig } from '@circuit/build-config';
import { version } from './package.json';
import { startLoading } from './src/styles/constant';

export default buildConfig({
  mode: process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
  version,
  rootDir: __dirname,
  outputDir: 'dist',
  entry: 'src/boot/index.ts',
  template: 'src/index.ejs',
  tsConfig: 'tsconfig.json',
  meta: {
    startLoading,
  },
});
