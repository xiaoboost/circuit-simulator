// 全局常量
const u = undefined,
    doc = window.document,
    rnotwhite = /\S+/g,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;

// 事件代理全局缓存
const cache = new WeakMap();

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

// 添加委托
function add(elem, types, selector, data, handler) {
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
            handler,
            selector,
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

function isContains(elem, handler) {

}

// 沿着捕获路径，将所有回调函数包装成队列
function tohandlers(event, handlers) {
    const path = event.path;
    path.splice(path.indexOf(this));

    debugger;
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

    debugger;
    handlerQueue.some((handleObj) => {
        // 如果事件停止捕获，那么跳出
        if (event.isPropagationStopped()) { return (true); }

        const fn = handleObj.handlers.handler;
        event.currentTarget = handleObj.elem;
        event.handleObj = handleObj;
        event.data = handleObj.handlers.data;
        event.type = handleObj.handlers.type;

        // 运行回调
        const ret = event.result = fn.apply(handleObj.elem, args);
        // 若回调完成且返回 true，则阻止事件继续捕获
        if (ret === true) {
            event.preventDefault();
            event.stopPropagation();
            return (true);
        }
    });
}

// 移除委托事件
function remove() {

}

export default { add, remove };
