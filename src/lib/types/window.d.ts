// interface Window {
//     $ENV: {
//         readonly NODE_ENV: 'development' | 'production' | 'testing';
//     };
//     $DATA: {
//         readonly SVG_NS: 'http://www.w3.org/2000/svg';
//     };
//     $DEBUG: any;
// }

interface Environment {
    readonly NODE_ENV: 'development' | 'production' | 'testing';
}

interface WindowData {
    readonly SVG_NS: 'http://www.w3.org/2000/svg';
}

declare const $ENV: Environment;
declare const $DATA: WindowData;
