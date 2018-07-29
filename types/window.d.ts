interface Point {
    0: number;
    1: number;
    length: number;
}

type PointInput = Point | number[] | [number, number];

interface MapDebug {
    /** 该实例本身的`DOM` */
    $el: HTMLElement;

    /** 在图纸中添加点 */
    point(point: PointInput, color?: string, mul?: number): void;
    /** 在图纸中添加路径 */
    path(way: PointInput[], color?: string): void;
    /** 在图纸中添加文本 */
    text(point: PointInput, text: string, mul?: number): void;
    /** 清除图纸中的所有调试用的点 */
    clearPoint(): void;
    /** 清除图纸中的全部调试信息 */
    clearAll(): void;
    /** 显示图纸的全部信息 */
    whole(): void;
}

interface SVGAnimationElement extends SVGElement {
    readonly targetElement: SVGElement | null;

    getStartTime(): number;
    getCurrentTime(): number;
    beginElement(): void;
    endElement(): void;
}

declare const SVGAnimationElement: {
    prototype: SVGAnimationElement;
    new(): SVGAnimationElement;
};

declare const supportsOnce: boolean;
declare const supportsPassive: boolean;
declare const $debugger: MapDebug;
