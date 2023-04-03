import 'webpack-dev-server';
import baseConfig from './webpack.base';

baseConfig.devtool = 'eval-source-map';
baseConfig.devServer = {
  port: 8080,
  open: true,
  hot: false,
  compress: true,
  allowedHosts: 'all',
  static: false,
};

export default baseConfig;
