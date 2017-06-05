// 全局常量
const u = undefined,
    doc = window.document,
    rnotwhite = /\S+/g,
    rkeyEvent = /^key/,
    rselect = /[^.# ]+/g,
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
$Event.prototype = {
    constructor: $Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,

    preventDefault() {
        const e = this.originalEvent;
        this.isDefaultPrevented = returnTrue;
        if ( e && !this.isSimulated ) {
            e.preventDefault();
        }
    },
    stopPropagation() {
        const e = this.originalEvent;
        this.isPropagationStopped = returnTrue;
        if ( e && !this.isSimulated ) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation() {
        const e = this.originalEvent;
        this.isImmediatePropagationStopped = returnTrue;
        if ( e && !this.isSimulated ) {
            e.stopImmediatePropagation();
        }
        this.stopPropagation();
    }
};
Object.defineProperty($Event.prototype, new Proxy({}, {
    get(target, property) {
        return this.originalEvent.property;
    }
}));

// 添加委托
function add(elem, types, handler, data, selector) {
    // 取出当前 DOM 的委托数据
    const elemData = cache.get(elem) || {};
    // 初始化
    const events = elemData.events = elemData.events || {};
    elemData.handle = elemData.handle || (() => dispatch.apply(elem, arguments));
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
            matches: {}
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

// 分发事件
function dispatch(...args) {
    const event = new $Event(args[0]),
        elemEvents = (cache.get(this) || {})['events'] || {},
        elemhandlers = elemEvents[args[0].type] || [];

    // 委托元素赋值
    event.delegateTarget = this;
    // 沿捕获路径，依次运行回调
    const handlerQueue = handlers.call(this, event, elemhandlers);
    handlerQueue.forEach((handle) => {
        // 如果事件停止捕获，那么跳出
        if (event.isPropagationStopped()) { return; }


    });
}

// 移除委托事件
function remove() {

}

// 沿着捕获路径，将所有回调函数包装成队列
function handlers() {

}

export default { add, remove, dispatch, handlers };
