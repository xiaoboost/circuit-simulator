import Vue from 'vue';
import * as assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';

type callback = (e?: Event) => void | boolean;

/** 生成鼠标结束事件对外的数据接口 */
export interface StopMouseEvent {
    el: HTMLElement;
    type: string;
    which: string;
    // type: 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave';
    // which: 'left' | 'middle' | 'right';
}

/** 绘图代理事件的扩展属性 */
export interface DrawEvent {
    $movement: Point;
    $position: Point;
}

/** 绘图代理事件数据接口 */
export interface DrawEventHandler {
    type: string;
    selector?: string;
    capture?: boolean;
    delegate?: boolean;
    callback(e?: Event): void | boolean;
}

/** 事件控制器设置接口 */
export interface DrawEventSetting {
    stopEvent: (StopMouseEvent | (() => Promise<void>));
    handlers: Array<DrawEventHandler | callback> | DrawEventHandler | callback;
    exclusion?: boolean;
    cursor?: (string | ((e?: Event) => string));
    beforeEvent?(): Promise<void>;
    afterEvent?(): void;
}

/** 事件队列 */
interface Handlers {
    /** 队列数据 */
    queue: DrawEventHandler[];
    /** 绑定所有事件 */
    bind(): void;
    /** 解除所有事件绑定 */
    unbind(): void;
}

/**
 * 生成鼠标的一次性结束事件
 * @param {StopMouseEvent} data
 * @returns {() => Promise<void>}
 */
function mouseEvent(data: StopMouseEvent): () => Promise<void> {
    const code = { left: 0, middle: 1, right: 2 };
    return () => new Promise((resolve): void => {
        data.el.addEventListener(
            data.type,
            function stop(event: Event): void {
                if ((event instanceof MouseEvent) && (event.button === code[data.which])) {
                    data.el.removeEventListener(data.type, stop);
                    resolve();
                }
            },
            true,
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

export default Vue.extend({
    data() {
        return {
            exclusion: false,
        };
    },
    methods: {
        /**
         * 对事件回调函数进行封装
         * 在运行回调之前插入一段矫正鼠标坐标的操作，并将结果传入实际的回调中
         * @param {function} fn
         * @returns {function} callback
         */
        wrapHandler(fn: callback, type: string): (event: MouseEvent & DrawEvent) => void {
            let last: false | Point = false;
            const callbackOutter = (event: MouseEvent & DrawEvent) => {
                const mouse = $P(event.pageX, event.pageY);

                event.$movement = last ? mouse.add(last, -1).mul(1 / this.zoom) : $P();
                event.$position = mouse.add(this.position, -1).mul(1 / this.zoom);

                last = mouse;
                fn(event);
            };

            return ($ENV.NODE_ENV === 'development' && type === 'mousemove')
                /**
                 *     chrome 浏览器（v59 ~ *）的 mousemove 事件似乎有个 bug，表现为 debug 时浏览器的 UI 进程被阻
                 * 塞了，无法进行实时的 UI 更新。目测是因为有某个进程阻塞的 UI 进程，所以这里用异步来运行回调，
                 * 等那某个进程运行完毕就行了。但是又因为回调是异步的，所以经常会造成 afterEvent 运行之后又
                 * 运行了一次回调的情况发生，所以这里必须再进行一次判断，以确保事件被取消之后回调不会被运行。
                 */
                ? (event: MouseEvent & DrawEvent) => setTimeout(() => this.exclusion && callbackOutter(event))
                : callbackOutter;
        },
        createHandlers(handlers: Array<DrawEventHandler | callback>): Handlers {
            const component = this;

            function bind(this: Handlers): void {
                this.queue.forEach((func) => {
                    func.delegate
                        ? component.$$on(component.$el, func.type, func.selector, func.callback)
                        : component.$el.addEventListener(func.type, func.callback, func.capture);
                });
            }
            function unbind(this: Handlers): void {
                this.queue.forEach((func) => {
                    func.delegate
                        ? component.$$off(component.$el, func.type, func.selector, func.callback)
                        : component.$el.removeEventListener(func.type, func.callback, func.capture);
                });
            }
            const queue = handlers.map((handler) => {
                if (assert.isFunction(handler)) {
                    return {
                        capture: false,
                        type: 'mousemove',
                        callback: this.wrapHandler(handler, 'mousemove'),
                    };
                } else {
                    const obj = { ...handler };
                    obj.capture = !!handler.capture;
                    obj.callback = this.wrapHandler(obj.callback, obj.type);
                    return obj;
                }
            });

            return { queue, bind, unbind };
        },
        setDrawEvent({
            handlers,
            stopEvent,
            exclusion = true,
            cursor = 'default',
            beforeEvent = () => Promise.resolve(),
            afterEvent = () => { return; },
        }: DrawEventSetting): void {
            // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
            if (this.exclusion && exclusion) {
                return;
            }
            else {
                this.exclusion = !!exclusion;
            }

            // 设定鼠标指针
            const createCursor = assert.isString(cursor)
                ? toCursor(cursor)
                : (e?: Event) => { this.$el.style.cursor = toCursor(cursor(e)); };

            // 回调事件队列
            const events = assert.isArray(handlers) ? handlers : [handlers];
            // cursor 是函数，则加入回调队列
            assert.isFunction(createCursor) && events.push(createCursor);

            // 生成队列
            const Queue = this.createHandlers(events);
            // 生成终止事件
            const stopCommander = assert.isFunction(stopEvent) ? stopEvent : mouseEvent(stopEvent);

            // 事件回调生命周期
            beforeEvent()
                // 绑定事件本身和结束条件
                .then(() => {
                    if (assert.isString(createCursor)) {
                        this.$el.style.cursor = createCursor;
                    }

                    Queue.bind();
                    return stopCommander();
                })
                // 事件结束，解除事件绑定
                .then(() => {
                    Queue.unbind();
                    afterEvent();
                    this.exclusion = false;
                    this.$el.style.cursor = 'default';
                })
                // 捕获流程中的错误
                .catch((err) => console.error(err));
        },
    },
});
