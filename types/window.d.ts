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
    /** The element which is being animated. If no target element is being animated (for example, because the ‘href’ specifies an unknown element) the value returned is null. */
    readonly targetElement: SVGElement | null;

    /** Returns a float representing the begin time, in seconds, for this animation element's current interval, if it exists, regardless of whether the interval has begun yet. If there is no current interval, then a `DOMException` with code `INVALID_STATE_ERR` is thrown. */
    getStartTime(): number;
    /** Returns a float representing the current time in seconds relative to time zero for the given time container. */
    getCurrentTime(): number;
    /** Returns a float representing the number of seconds for the simple duration for this animation. If the simple duration is undefined (e.g., the end time is indefinite), then a `DOMException` with code `NOT_SUPPORTED_ERR` is raised. */
    getSimpleDuration(): number;
    /** Creates a begin instance time for the current time. The new instance time is added to the begin instance times list. The behavior of this method is equivalent to `beginElementAt(0)`. */
    beginElement(): void;
    /** Creates a begin instance time for the current time plus the specified offset. The new instance time is added to the begin instance times list. */
    beginElementAt(offset: number): void;
    /** Creates an end instance time for the current time. The new instance time is added to the end instance times list. The behavior of this method is equivalent to `endElementAt(0)`. */
    endElement(): void;
    /** Creates a end instance time for the current time plus the specified offset. The new instance time is added to the end instance times list. */
    endElementAt(offset: number): void;
}

declare const SVGAnimationElement: {
    prototype: SVGAnimationElement;
    new(): SVGAnimationElement;
};

declare const supportsPassive: boolean;
declare const $ENV: Environment;
declare const $debugger: MapDebug;
declare type EventExtend = Extend;
