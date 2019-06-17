import Vue from 'vue';
import Point from 'src/lib/point';

import {
    delay,
    isUndef,
    isArray,
    isFunc,
    supportsPassive,
} from 'src/lib/utils';

type callback = (event: DrawEvent) => any | Promise<any>;
type StopEventOption = StopMouseEvent | ((event?: DrawEvent) => Promise<void>);
type HandlerEventOption = DrawEventHandler | callback | Array<DrawEventHandler | callback>;

/** 生成鼠标结束事件对外的数据接口 */
export interface StopMouseEvent {
    el?: HTMLElement;
    type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave';
    which: 'left' | 'middle' | 'right';
}

/** 绘图代理事件的扩展属性 */
export interface DrawEvent extends MouseEvent {
    $movement: Point;
    $position: Point;
    target: HTMLElement;
    currentTarget: HTMLElement;
}

/** 绘图代理事件数据接口 */
export interface DrawEventHandler {
    type: string;
    capture?: boolean;
    passive?: boolean;
    callback(e?: Event): void | Promise<void>;
}

/** 事件控制器设置接口 */
export interface DrawEventSetting {
    exclusion?: boolean;
    stopEvent: StopMouseEvent | (() => Promise<void>);
    handlers: Array<DrawEventHandler | callback> | DrawEventHandler | callback;
    cursor?: string | ((e?: DrawEvent) => string);
    beforeEvent?(): Promise<void>;
    afterEvent?(): void;
}

/** 事件控制器适用的组件结构 */
export interface EventControllerComp extends Vue {
    zoom: number;
    position: Point;
    exclusion: boolean;
    $el: HTMLElement;
}

/**
 * 生成鼠标的一次性结束事件
 * @param {StopMouseEvent} data
 * @returns {() => Promise<void>}
 */
function createStopMouseEvent({ el, type, which }: Required<StopMouseEvent>) {
    const code = { left: 0, middle: 1, right: 2 };
    const opts = supportsPassive
        ? { passive: true, capture: true }
        : true;

    return () => new Promise<void>((resolve) => {
        el.addEventListener(
            type,
            function stop(event: MouseEvent) {
                if (event.button === code[which]) {
                    el.removeEventListener(type, stop, true);
                    resolve();
                }
            },
            opts,
        );
    });
}

export default class EventController {
    /** 事件控制器操作的组件 */
    private Comp: EventControllerComp;
    /** 当前事件队列是否互斥 */
    private exclusion: boolean;

    /** 事件回调数据 */
    private handlerEvents: DrawEventHandler[] = [];
    /** 停止事件数据 */
    private stopEvent = () => Promise.resolve();
    /** 事件队列，用于异步事件的同步控制 */
    private eventsQueue = Promise.resolve();

    /** 鼠标指针样式 */
    private cursorStyle?: string;

    constructor(Comp: EventControllerComp, exclusion = true) {
        this.Comp = Comp;
        this.exclusion = exclusion;
    }

    private _wrapHandler(fn: callback) {
        let last: false | Point = false;

        const fnWrapper = (event: DrawEvent) => {
            const mouse = new Point(event.pageX, event.pageY);

            event.$movement = last ? mouse.add(last, -1).mul(1 / this.Comp.zoom) : new Point(0, 0);
            event.$position = mouse.add(this.Comp.position, -1).mul(1 / this.Comp.zoom);

            last = mouse;

            // 将回调绑定至异步链条上
            this.eventsQueue = this.eventsQueue.then(async () => {
                if (process.env.NODE_ENV === 'development') {
                    await delay();
                }

                if (!this.Comp.exclusion) {
                    return;
                }

                await fn(event);
            });
        };

        return fnWrapper;
    }
    private _handlerOption(handler: DrawEventHandler) {
        return supportsPassive
            ? { passive: handler.passive, capture: handler.capture }
            : handler.capture;
    }

    start() {
        if (this.cursorStyle) {
            this.Comp.$el.style.cursor = this.cursorStyle;
        }

        // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
        if (this.Comp.exclusion && this.exclusion) {
            return Promise.resolve();
        }
        else {
            this.Comp.exclusion = this.exclusion;
        }

        this.handlerEvents.forEach(
            (handler) => this.Comp.$el.addEventListener(
                handler.type,
                handler.callback,
                this._handlerOption(handler),
            ),
        );

        // 停止事件被触发后自动停止运行
        return this.stopEvent().then(() => this.stop());
    }
    stop() {
        this.Comp.exclusion = false;
        this.Comp.$el.style.cursor = 'default';

        this.handlerEvents.forEach(
            (handler) => this.Comp.$el.removeEventListener(
                handler.type,
                handler.callback,
                this._handlerOption(handler),
            ),
        );

        return this.Comp.$nextTick();
    }

    setCursor(style: string | ((event: DrawEvent) => string)) {
        /**
         * 生成 cursor 属性
         * @param {string} cursor
         * @returns {string}
         */
        function toCursor(cursor: string = 'default'): string {
            return (isUndef(cursor) || cursor === 'default')
                ? 'default'
                : `url(/cur/${cursor}.cur), crosshair`;
        }

        if (isFunc(style)) {
            this.setHandlerEvent((ev: DrawEvent) => {
                this.Comp.$el.style.cursor = toCursor(style(ev));
            });
        }
        else {
            this.cursorStyle = toCursor(style);
        }

        return this;
    }
    setStopEvent(option: StopEventOption) {
        if (isFunc(option)) {
            this.stopEvent = option;
        }
        else {
            this.stopEvent = createStopMouseEvent({
                el: this.Comp.$el as HTMLElement,
                ...option,
            });
        }

        return this;
    }
    setHandlerEvent(option: HandlerEventOption) {
        const options = isArray(option) ? option : [option];
        const handlers = options.map(
            (handler) => isFunc(handler)
                ? {
                    capture: false,
                    passive: true,
                    type: 'mousemove',
                    callback: this._wrapHandler(handler),
                }
                : {
                    type: handler.type,
                    capture: handler.capture || false,
                    passive: handler.passive || true,
                    callback: this._wrapHandler(handler.callback),
                },
        );

        this.handlerEvents = this.handlerEvents.concat(handlers);

        return this;
    }
}
