import 'webpack-dev-server';
import { BuildConfig } from './types';
import { buildBaseConfig } from './webpack.base';

export function buildDevConfig(config: BuildConfig) {
  const baseConfig = buildBaseConfig(config);

  baseConfig.devtool = 'eval-source-map';
  baseConfig.devServer = {
    port: 8080,
    open: true,
    hot: false,
    compress: true,
    allowedHosts: 'all',
    static: false,
  };

return  baseConfig;
}
