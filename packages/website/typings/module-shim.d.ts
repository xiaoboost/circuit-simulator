declare module 'progress-bar-webpack-plugin';
declare module 'terser-webpack-plugin';
declare module 'browser-env';

declare module '*.svg' {
  const svg: string;
  export default svg;
}
