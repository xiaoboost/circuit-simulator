declare module 'progress-bar-webpack-plugin';

declare module '@antv/g2/lib/core' {
    import G2 from '@antv/g2/lib/index';
    export default G2;
}

declare module '*.svg' {
    const svg: string;
    export default svg;
}
