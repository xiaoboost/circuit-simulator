import type { BuildConfig } from './types';
import { buildDevConfig } from './webpack.dev';
import { buildProdConfig } from './webpack.prod';

export function buildConfig(config: BuildConfig) {
  return config.mode === 'dev' ? buildDevConfig(config) : buildProdConfig(config);
}
