interface Environment {
    readonly NODE_ENV: 'development' | 'production' | 'testing';
}

interface Extend {
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

/** 委托事件公共接口 */
interface $Event extends Event {
    /** 触发事件的元素 */
    target: HTMLElement;
    /** 绑定事件的元素 */
    currentTarget: HTMLElement;
    /** 被委托事件的元素 */
    delegateTarget: HTMLElement;
    /** 委托事件内绑定时数据 */
    data: { [x: string]: any };

    /** 当前委托事件默认行为是否被取消 */
    isDefaultPrevented: boolean;
    /** 当前委托事件的进一步穿鼻是否被取消 */
    isPropagationStopped: boolean;
    /** 当前委托事件的其他侦听器是否被取消 */
    isImmediatePropagationStopped: boolean;
}

declare const SVGAnimationElement: {
    prototype: SVGAnimationElement;
    new(): SVGAnimationElement;
};

declare const $ENV: Environment;
declare type EventExtend = Extend;
declare type DelegateEvent = $Event;
