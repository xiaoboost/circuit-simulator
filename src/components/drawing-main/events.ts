import * as assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';
import { Component, Vue } from 'vue-property-decorator';
import { delay } from 'src/lib/utils';

import { Required } from 'type-zoo';

type callback = (event: DrawEvent) => void | Promise<void>;

/** 生成鼠标结束事件对外的数据接口 */
export interface StopMouseEvent {
    el?: HTMLElement;
    type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave';
    which: 'left' | 'middle' | 'right';
}

/** 绘图代理事件的扩展属性 */
export interface DrawEvent extends EventExtend {
    $movement: Point;
    $position: Point;
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

/**
 * 生成鼠标的一次性结束事件
 * @param {StopMouseEvent} data
 * @returns {() => Promise<void>}
 */
function createStopMouseEvent({ el, type, which }: Required<StopMouseEvent>): () => Promise<void> {
    const code = { left: 0, middle: 1, right: 2 };
    const opts = supportsPassive
        ? { passive: true, capture: true }
        : true;

    return () => new Promise((resolve): void => {
        el.addEventListener(
            type,
            function stop(event: MouseEvent): void {
                if (event.button === code[which]) {
                    el.removeEventListener(type, stop, true);
                    resolve();
                }
            },
            opts,
        );
    });
}

/**
 * 生成 cursor 属性
 * @param {string} cursor
 * @returns {string}
 */
function toCursor(cursor: string = 'default'): string {
    return (assert.isNull(cursor) || cursor === 'default') ? 'default' : `url(/cur/${cursor}.cur), crosshair`;
}

/** 事件控制器 */
class Handlers {
    /** 事件控制器操作的组件 */
    private Comp: DrawEvents;
    /** 事件回调数据 */
    private eventsData: DrawEventHandler[];
    /** 事件队列，用于异步事件的同步控制 */
    private eventsQueue = Promise.resolve();

    get $el() {
        return this.Comp.$el;
    }
    get zoom() {
        return this.Comp.zoom;
    }
    get position() {
        return $P(this.Comp.position);
    }
    get exclusion() {
        return this.Comp.exclusion;
    }

    constructor(comp: DrawEvents, handlers: Array<DrawEventHandler | callback>) {
        this.Comp = comp;
        this.eventsData = handlers.map(
            (handler) => assert.isFunction(handler)
                ? {
                    capture: false,
                    type: 'mousemove',
                    callback: this.wrapHandler(handler),
                }
                : {
                    type: handler.type,
                    capture: handler.capture || false,
                    passive: handler.passive || true,
                    callback: this.wrapHandler(handler.callback),
                },
        );
    }

    wrapHandler(fn: callback) {
        let last: false | Point = false;

        const callbackOutter = (event: DrawEvent) => {
            const mouse = $P(event.pageX, event.pageY);

            event.$movement = last ? mouse.add(last, -1).mul(1 / this.zoom) : $P();
            event.$position = mouse.add(this.position, -1).mul(1 / this.zoom);

            last = mouse;

            // 将回调绑定至异步链条上
            this.eventsQueue = this.eventsQueue.then(async () => {
                if ($ENV.NODE_ENV === 'development') {
                    await delay();
                }

                if (!this.exclusion) {
                    return;
                }

                await fn(event);
            });
        };

        return callbackOutter;
    }
    bind() {
        this.eventsData.forEach(
            (handler) => this.$el.addEventListener(
                handler.type,
                handler.callback,
                supportsPassive
                    ? { passive: handler.passive, capture: handler.capture }
                    : handler.capture,
            ),
        );
    }
    unbind() {
        this.eventsData.forEach(
            (handler) => this.$el.removeEventListener(
                handler.type,
                handler.callback,
                handler.capture,
            ),
        );
    }
}

@Component
export default class DrawEvents extends Vue {
    zoom: number;
    position: Point;

    exclusion = false;

    async setDrawEvent({
        handlers,
        stopEvent,
        exclusion = true,
        cursor = 'default',
        beforeEvent = () => Promise.resolve(),
        afterEvent = () => { return; },
    }: DrawEventSetting) {
        // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
        if (this.exclusion && exclusion) {
            return;
        }
        else {
            this.exclusion = !!exclusion;
        }

        // 回调事件队列
        const events = assert.isArray(handlers) ? handlers : [handlers];

        let cursorStyle = '';
        // 直接指定指针样式
        if (assert.isString(cursor)) {
            cursorStyle = toCursor(cursor);
        }
        // 指定指针回调
        else {
            events.push((e?: DrawEvent) => { this.$el.style.cursor = toCursor(cursor(e)); });
        }

        // 生成队列
        const Queue = new Handlers(this, events);
        // 生成终止事件
        const stopCommander = assert.isFunction(stopEvent)
            ? stopEvent
            : createStopMouseEvent({
                el: this.$el,
                ...stopEvent,
            });

        await beforeEvent();
        this.$el.style.cursor = cursorStyle;

        Queue.bind();
        await stopCommander();

        Queue.unbind();
        afterEvent();
        this.exclusion = false;
        this.$el.style.cursor = 'default';
    }
}
