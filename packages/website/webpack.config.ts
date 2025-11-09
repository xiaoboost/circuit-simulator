import { buildConfig } from '@circuit/build-config';
import { GlobalMarker } from '@circuit/shared';
import { version } from './package.json';
import { startLoadingId } from './src/styles/constant';

export default buildConfig({
  mode: process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
  version,
  analyze: process.env.ANALYZE === 'true',
  rootDir: __dirname,
  outputDir: 'dist',
  entry: 'src/boot/index.ts',
  template: 'src/index.ejs',
  tsConfig: 'tsconfig.json',
  meta: {
    startLoadingId,
    startUpMarker: GlobalMarker.startUp,
  },
});
