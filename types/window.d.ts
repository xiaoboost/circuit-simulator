interface Environment {
    readonly NODE_ENV: 'development';
}

interface MapDebug {
    /** 该实例本身的`DOM` */
    $el: HTMLElement;

    /** 在图纸中添加点 */
    point([x, y]: [number, number], color?: string, mul?: number): void;
    /** 在图纸中添加路径 */
    path(way: Array<[number, number]>, color?: string): void;
    /** 在图纸中添加文本 */
    text([x, y]: [number, number], text: string, mul?: number): void;
    /** 清除图纸中的所有调试用的点 */
    clearPoint(): void;
    /** 清除图纸中的全部调试信息 */
    clearAll(): void;
    /** 显示图纸的全部信息 */
    whole(): void;
}

interface Extend extends Event, MouseEvent, WheelEvent, KeyboardEvent {
    target: HTMLElement;
    currentTarget: HTMLElement;
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

interface WebpackWorker extends Worker {}

declare const WebpackWorker: {
    prototype: WebpackWorker;
    new(): WebpackWorker;
};

declare type WorkerConstructor = {
    prototype: Worker;
    new(): Worker;
}

declare const supportsPassive: boolean;
declare const $ENV: Environment;
declare const $debugger: MapDebug;
declare type EventExtend = Extend;
