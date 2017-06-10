// 全局常量
const u = undefined,
    doc = window.document,
    rnotwhite = /\S+/g,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;

// 事件代理全局缓存
const cache = new Map();

//有效以及无效函数
function returnTrue() {
    return true;
}
function returnFalse() {
    return false;
}

// 代理事件
function $Event(origin) {
    this.originalEvent = origin;
}
$Event.prototype = Object.create(new Proxy({}, {
    get: (target, property, receiver) => receiver.originalEvent[property]
}));
Object.assign($Event.prototype, {
    constructor: $Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault() {
        this.isDefaultPrevented = returnTrue;
        this.originalEvent.preventDefault();
    },
    stopPropagation() {
        this.isPropagationStopped = returnTrue;
        this.originalEvent.stopPropagation();
    },
    stopImmediatePropagation() {
        this.isImmediatePropagationStopped = returnTrue;
        this.originalEvent.stopImmediatePropagation();
        this.stopPropagation();
    }
});

// 分解选择器
function paserSelector(selector) {
    if (!selector) { return (false); }

    selector = selector.split(' ').pop();
    let tag = /^[a-z]+/.exec(selector),
        id = /\#([a-z]+)/.exec(selector),
        clas = selector.match(/\.[a-z]+/g);

    id = id && id[1];
    tag = tag && tag[0].toLocaleUpperCase();
    clas = clas && clas.map((n) => n.substr(1));

    return { tag, id, clas };
}

// 根据选择器匹配被选中的 DOM
function isContains(elem, handler) {
    const includes = Array.prototype.includes;
    // 选择器缓存中含有被测试 DOM
    if (includes.call(handler.matches, elem)) {
        return (true);
    }
    // 初次匹配选择
    const {tag, id, clas} = handler.characteristic,
        matchTag = tag && elem.tagName !== tag,
        matchId = id && elem.getAttribute() !== tag;

    if (matchTag || matchId) {
        return (false);
    }

    const className = elem.getAttribute('class'),
        matchClass = clas && !clas.every((n) => className && className.includes(n));

    if (matchClass) {
        return (false);
    }

    // 重置选择器选择器件，并再次匹配
    handler.matches = handler.delegate.querySelectorAll(handler.selector);
    return (includes.call(handler.matches, elem));
}

// 沿着捕获路径，将所有回调函数包装成队列
function tohandlers(event, handlers) {
    const path = event.path;
    path.splice(path.indexOf(this));

    // 委托元素本身的事件
    const handlerQueue = handlers
        .filter((n) => !n.selector)
        .map((n) => ({ elem: this, handler: n }));

    // 沿着委托元素向下
    for (let i = path.length - 1; i >= 0; i--) {
        // 若节点不是 Node.ELEMENT_NODE，则跳过
        if (path[i].nodeType !== 1) { continue; }

        handlerQueue.push(
            ...handlers
                .filter((n) => n.selector && isContains(path[i], n))
                .map((n) => ({ elem: path[i], handler: n }))
        );
    }

    return handlerQueue;
}

// 分发事件
function dispatch(...args) {
    const event = new $Event(args[0]),
        elemEvents = (cache.get(this) || {})['events'] || {},
        elemhandlers = elemEvents[args[0].type] || [];

    // 委托元素赋值
    event.delegateTarget = this;
    // 沿捕获路径，依次运行回调
    const handlerQueue = tohandlers.call(this, event, elemhandlers);
    handlerQueue.some((handleObj) => {
        // 如果事件停止捕获，那么跳出
        if (event.isPropagationStopped()) {
            return (true);
        }

        const fn = handleObj.handler.callback;
        event.currentTarget = handleObj.elem;
        event.data = handleObj.handler.data;
        event.type = handleObj.handler.type;

        // 运行回调
        const ret = fn.call(handleObj.elem, event);
        // 若回调完成且返回 true，则阻止事件继续捕获
        if (ret === true) {
            event.preventDefault();
            event.stopPropagation();
            return (true);
        }
    });
}

// 添加委托
function add(elem, types, selector, data, callback) {
    // 如果缓存中没有数据，那么存入空对象
    if (!cache.has(elem)) { cache.set(elem, {}); }
    // 取出当前 DOM 的委托数据
    const elemData = cache.get(elem) || {};
    const events = elemData.events = elemData.events || {};
    // 若是初次绑定，那么定义事件回调函数
    elemData.handle = elemData.handle || ((...args) => dispatch.apply(elem, args));
    // 分割事件名称
    types = (types || '').match(rnotwhite) || [''];
    types.forEach((type) => {
        //非法名称，跳过
        if (!type) { return; }
        // TODO: 在捕获状态，特殊事件是否需要特殊处理？比如 mouseenter、mouseleave
        //句柄对象
        const handleObj = {
            type,
            data,
            callback,
            selector,
            delegate: elem,
            characteristic: paserSelector(selector),
            matches: elem.querySelectorAll(selector)
        };
        //这个事件是初次定义
        if (!events[type]) {
            events[type] = [];
            //绑定监听事件（捕获阶段）
            if (elem.addEventListener) {
                elem.addEventListener(type, elemData.handle, true);
            }
        }
        //selector有重复的，那么就覆盖，没有重复的那就添加到末尾
        if (!(events[type].some((n, i, arr) => (selector === n.selector) && (arr[i] = handleObj)))) {
            events[type].push(handleObj);
        }
    });
}

// 移除委托事件
function remove(elem, types, handler, selector) {
    const elemData = cache.get(elem),
        events = elemData.events;

    // 没有找到委托事件数据，直接退出
    if (!elemData || !events) {
        return;
    }

    // 拆分事件类型
    types = ( types || '' ).match(rnotwhite) || [''];
    // 空类型，表示输入是空数据，当前元素的所有事件都要删除
    if (!types.length) {
        types = Object.keys(events);
    }
    if (types.length > 1) {
        types.forEach((type) => remove(elem, type, handler, selector));
    }

    const type = types[0], deleteHandler = [];
    events[type].filter((handler) => {
        if (selector === '*' || (!selector && !handler)) {
            return (false);
        }
        if ((selector && !handler && selector === handler.selector) ||
            (!selector && handler && handler === handler.handler) ||
            (selector === handler.selector && handler === handler.handler)) {
            return (false);
        }
        return (true);
    });

    // 当前类型的事件已经空了
    if (!events.length) {
        elem.removeEventListener(type, elemData.handle, true);
        delete events[type];
    }

    // 当前委托元素已经没有委托事件了
    if (Object.isEmpty(elemData)) {
        cache.delete(elem);
    }
}

export default { add, remove };
