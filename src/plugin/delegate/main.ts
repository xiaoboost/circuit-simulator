import {
    CustomEvent,
    SelectorParsed,
    AnyObject,
    Callback,
    HandleObj,
    EventsObj,
    ElementData,
    HandlerQueueObj,
} from './options';

import assert from 'src/lib/assertion';

/** 全局常量 */
const rnotwhite = /\S+/g;
/** 事件代理全局缓存 */
const $Cache = new Map();
/** 特殊事件必须有特殊的判断函数 */
const special = {
    mouseenter: (event: CustomEvent) => event.currentTarget === event.target,
    mouseleave: (event: CustomEvent) => event.currentTarget === event.target,
};

/** 有效函数 */
const returnTrue = () => true;
/** 无效函数 */
const returnFalse = () => false;

class $Event implements CustomEvent {
    /**
     * 原生绑定事件的元素
     * @type {HTMLElement}
     */
    currentTarget: HTMLElement;
    /**
     * 被委托的事件附带的数据
     * @type {AnyObject}
     */
    data: AnyObject;
    /**
     * 事件类型
     * @type {string}
     */
    type: string;
    /**
     * 被委托事件的元素
     * @type {HTMLElement}
     */
    delegateTarget: HTMLElement;

    /** 这两个属性是为了兼容用的，实际并未使用它们 */
    target: HTMLElement;
    button: number;

    /** 事件默认行为是否被取消 */
    isDefaultPrevented = returnFalse;
    /** 当前事件的进一步穿鼻是否被取消 */
    isPropagationStopped = returnFalse;
    /** 当前事件的其他侦听器是否被取消 */
    isImmediatePropagationStopped = returnFalse;

    /**
     * 被代理的原事件数据
     * @private
     * @type {Event}
     */
    originalEvent: Event;

    constructor(origin: Event) {
        this.originalEvent = origin;
    }

    /** 取消默认行为 */
    preventDefault(): void {
        this.isDefaultPrevented = returnTrue;
        this.originalEvent.preventDefault();
    }
    /** 阻止捕获和冒泡阶段中当前事件的进一步传播 */
    stopPropagation(): void {
        this.isPropagationStopped = returnTrue;
        this.originalEvent.stopPropagation();
    }
    /** 阻止调用相同事件的其他侦听器 */
    stopImmediatePropagation(): void {
        this.isImmediatePropagationStopped = returnTrue;
        this.originalEvent.stopImmediatePropagation();
        this.stopPropagation();
    }
}

/** 对 $Event 类的修饰 */
Object.setPrototypeOf($Event.prototype, new Proxy({}, {
    get(target, property, receiver: $Event) {
        return receiver.originalEvent[property];
    },
}));

/**
 * 分解选择器
 * @param {string} all
 * @returns
 */
function paserSelector(all: string): SelectorParsed[] {
    return all
        .split(',')
        .map((str) => {
            const selector = str.trim().split(' ').pop();

            if (assert.isNull(selector)) {
                return false;
            }

            const tagMatch = /^[a-z]+/.exec(selector),
                idMatch = /#([^.#]+)/.exec(selector),
                classMatch = selector.match(/\.[^.#]+/g);

            return {
                id: assert.isNull(idMatch) ? '' : idMatch[1],
                tag: assert.isNull(tagMatch) ? '' : tagMatch[1],
                class: (classMatch || []).filter(Boolean).map((n) => n.substr(1)),
            };
        })
        .filter((selector): selector is SelectorParsed => !!selector);
}

// 根据选择器匹配被选中的 DOM
function isContains(delegate: HTMLElement, elem: HTMLElement, handler: HandleObj) {
    // 选择器缓存中含有被测试 DOM
    if (handler.matches.includes(elem)) {
        return (true);
    }

    // 当前 DOM 元素属性
    const elemTag = elem.tagName.toLowerCase(),
        elemId = elem.getAttribute('id'),
        elemClass = elem.classList;

    // 匹配选择器
    if (handler.characteristic.every((selector) =>
        (selector.tag && selector.tag !== elemTag) ||
        (selector.id && selector.id !== elemId) ||
        (selector.class && !selector.class.every((n) => elemClass.contains(n))),
    )) {
        return (false);
    }

    // 重置选择器选择器件，并再次匹配
    handler.matches = Array.from(delegate.querySelectorAll(handler.selector));
    return handler.matches.includes(elem);
}

// 沿着冒泡路径，将满足条件的回调函数包装成队列
function tohandlers(elem: HTMLElement, event: $Event, handlers: HandleObj[]): HandlerQueueObj[] {
    // 组成路径
    const path: HTMLElement[] = [];
    for (let i: HTMLElement | null = event.target; i !== event.currentTarget; i = (i as HTMLElement).parentElement) {
        path.push(i as HTMLElement);
    }
    path.push(event.currentTarget);
    path.reverse();

    // 委托元素本身的事件
    const handlerQueue: HandlerQueueObj[] = handlers
        .filter((n) => !n.selector)
        .map((n) => ({ elem, handler: n }));

    // 沿着委托元素向下
    for (let i = path.length - 1; i >= 0; i--) {
        // 若节点不是 Node.ELEMENT_NODE，则跳过
        if (path[i].nodeType !== 1) {
            continue;
        }

        handlerQueue.push(
            ...handlers
                .filter((n) => n.selector && isContains(elem, path[i], n))
                .map((n) => ({ elem: path[i], handler: n })),
        );
    }

    return handlerQueue;
}

// 分发事件
function dispatch(elem: HTMLElement, args: Event): void {
    const event = new $Event(args),
        elemEvents: EventsObj = (($Cache.get(elem) || {}) as ElementData).events || {},
        elemhandlers: HandleObj[] = elemEvents[args.type] || [];

    // 委托元素赋值
    event.delegateTarget = elem;
    // 沿捕获路径，依次运行回调
    const handlerQueue = tohandlers(elem, event, elemhandlers);
    handlerQueue.every((handleObj: HandlerQueueObj) => {
        // 如果事件停止捕获，那么跳出
        if (event.isPropagationStopped()) {
            return (false);
        }

        const fn = handleObj.handler.callback;
        event.currentTarget = handleObj.elem;
        event.data = handleObj.handler.data;
        event.type = handleObj.handler.type;

        // 特殊类型事件的额外校验
        if (special[event.type] && !(special[event.type] as (e: CustomEvent) => boolean)(event)) {
            return (true);
        }

        // 运行回调
        const ret = fn.call(handleObj.elem, event) as boolean | undefined;
        // 若回调完成且返回 false，则阻止事件继续捕获
        if (ret === false) {
            event.preventDefault();
            event.stopPropagation();
            return (false);
        }
        return (true);
    });
}

/**
 * 添加事件委托
 * @param {HTMLElement} elem
 * @param {string} types
 * @param {string} selector
 * @param {AnyObject} data
 * @param {Callback} callback
 */
function add(elem: HTMLElement, types: string, selector: string, data: AnyObject, callback: Callback) {
    // 如果缓存中没有数据，那么存入空对象
    if (!$Cache.has(elem)) {
        $Cache.set(elem, {});
    }
    // 取出当前 DOM 的委托数据
    const elemData = $Cache.get(elem) as ElementData;
    const events: EventsObj = elemData.events = elemData.events || {};

    // 若是初次绑定，那么定义事件回调函数
    elemData.handle = elemData.handle || ((evevt: Event): void => dispatch(elem, evevt));

    // 分割事件并绑定
    (types.match(rnotwhite) || ['']).forEach((type) => {
        // 非法名称，跳过
        if (!type) {
            return;
        }

        // 句柄对象
        const handleObj: HandleObj = {
            type,
            data,
            callback,
            selector,
            characteristic: paserSelector(selector),
            matches: selector ? Array.from(elem.querySelectorAll(selector)) : [],
        };
        // 这个事件是初次定义
        if (!events[type]) {
            events[type] = [];
            // 绑定监听事件（捕获阶段）
            elem.addEventListener(type, elemData.handle, true);
        }
        // selector 有重复的，那么就覆盖，没有重复的那就添加到末尾
        if (!(events[type].some((n, i, arr) => (selector === n.selector) && (Boolean(arr[i] = handleObj))))) {
            events[type].push(handleObj);
        }
    });
}

/**
 * 移除事件委托
 * @param {object} elem DOM对象
 * @param {string} types 事件类型，多个类型用空格分割
 * @param {string} selector 被委托元素的选择器
 * @param {Callback} callback 事件回调
 */
function remove(elem: HTMLElement, types?: string, selector?: string, callback?: Callback) {
    const elemData = $Cache.get(elem) as ElementData,
        events = elemData && elemData.events;

    // 没有找到委托事件数据，直接退出
    if (!elemData || !events || !types) {
        return;
    }

    // 拆分事件类型
    let typeArr = (types || '').match(rnotwhite);
    // 空类型，表示输入是空数据，当前元素的所有事件都要删除
    if (!typeArr) {
        typeArr = Object.keys(events);
    }

    if (typeArr.length > 1) {
        typeArr.forEach((item) => remove(elem, item, selector, callback));
        return;
    }

    const type = types[0];
    events[type] = events[type].filter((handlerObj) => {
        if (selector === '*' || (!selector && !callback)) {
            return (false);
        }
        if ((assert.isString(selector) && assert.isNull(callback) && selector === handlerObj.selector) ||
            (assert.isNull(selector) && assert.isFuncton(callback) && callback === handlerObj.callback) ||
            (selector === handlerObj.selector && callback === handlerObj.callback)) {
            return (false);
        }
        return (true);
    });

    // 当前类型的事件已经空了
    if (events[type].length === 0) {
        elem.removeEventListener(type, elemData.handle, true);
        delete events[type];
    }

    // 当前委托元素已经没有委托事件了
    if (Object.isEmpty(events)) {
        $Cache.delete(elem);
    }
}

export default { add, remove };
