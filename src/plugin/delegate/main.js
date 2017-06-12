// 全局常量
const u = undefined, rnotwhite = /\S+/g;
// 事件代理全局缓存
const cache = new Map();
// 特殊事件必须有特殊的判断函数
const special = {
    mouseenter(event) {
        return event.currentTarget === event.target;
    },
    mouseleave(event) {
        return event.currentTarget === event.target;
    }
};

// 有效以及无效函数
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

    // 取消默认行为
    preventDefault() {
        this.isDefaultPrevented = returnTrue;
        this.originalEvent.preventDefault();
    },
    // 阻止捕获和冒泡阶段中当前事件的进一步传播
    stopPropagation() {
        this.isPropagationStopped = returnTrue;
        this.originalEvent.stopPropagation();
    },
    // 阻止调用相同事件的其他侦听器
    stopImmediatePropagation() {
        this.isImmediatePropagationStopped = returnTrue;
        this.originalEvent.stopImmediatePropagation();
        this.stopPropagation();
    }
});

// 分解选择器
function paserSelector(selector) {
    selector = selector.split(' ').pop();
    let tag = /^[a-z]+/.exec(selector),
        id = /\#([a-z]+)/.exec(selector),
        clas = selector.match(/\.[a-z]+/g);

    id = id && id[1];
    tag = tag && (new RegExp(tag[0], 'i'));
    clas = clas && clas.map((n) => n.substr(1));

    return { tag, id, clas };
}

// 根据选择器匹配被选中的 DOM
function isContains(delegate, elem, handler) {
    const includes = Array.prototype.includes;
    // 选择器缓存中含有被测试 DOM
    if (includes.call(handler.matches, elem)) {
        return (true);
    }

    // 初次匹配选择
    const {tag, id, clas} = handler.characteristic,
        matchTag = tag && !tag.test(elem.tagName),
        matchId = id && elem.getAttribute('id') !== id;

    if (matchTag || matchId) {
        return (false);
    }

    const className = elem.getAttribute('class'),
        matchClass = clas && !clas.every((n) => className && className.includes(n));

    if (matchClass) {
        return (false);
    }

    // 重置选择器选择器件，并再次匹配
    handler.matches = delegate.querySelectorAll(handler.selector);
    return (includes.call(handler.matches, elem));
}

// 沿着捕获路径，将满足条件的回调函数包装成队列
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
                .filter((n) => n.selector && isContains(this, path[i], n))
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
    handlerQueue.every((handleObj) => {
        // 如果事件停止捕获，那么跳出
        if (event.isPropagationStopped()) {
            return (false);
        }

        const fn = handleObj.handler.callback;
        event.currentTarget = handleObj.elem;
        event.data = handleObj.handler.data;
        event.type = handleObj.handler.type;

        // 特殊类型事件的额外校验
        if (special[event.type] && !special[event.type](event)) {
            return (true);
        }

        // 运行回调
        const ret = fn.call(handleObj.elem, event);
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
 * @param {Object} elem DOM对象
 * @param {String} types 事件类型，多个类型用空格分割
 * @param {String} selector 被委托元素的选择器
 * @param {Object} data 事件运行时候的数据
 * @param {Function} callback 事件回调
 */
function add(elem, types, selector, data, callback) {
    // 如果缓存中没有数据，那么存入空对象
    if (!cache.has(elem)) { cache.set(elem, {}); }
    // 取出当前 DOM 的委托数据
    const elemData = cache.get(elem);
    const events = elemData.events = elemData.events || {};
    // 若是初次绑定，那么定义事件回调函数
    elemData.handle = elemData.handle || ((...args) => dispatch.apply(elem, args));
    // 分割事件名称
    types = (types || '').match(rnotwhite) || [''];
    types.forEach((type) => {
        // 非法名称，跳过
        if (!type) { return; }

        // 句柄对象
        const handleObj = {
            type,
            data,
            callback,
            selector,
            characteristic: !!selector && paserSelector(selector),
            matches: !!selector && elem.querySelectorAll(selector)
        };
        // 这个事件是初次定义
        if (!events[type]) {
            events[type] = [];
            // 绑定监听事件（捕获阶段）
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

/**
 * 移除事件委托
 * @param {Object} elem DOM对象
 * @param {String} types 事件类型，多个类型用空格分割
 * @param {String} selector 被委托元素的选择器
 * @param {Function} callback 事件回调
 */
function remove(elem, types, selector, callback) {
    const elemData = cache.get(elem),
        events = elemData.events;

    // 没有找到委托事件数据，直接退出
    if (!elemData || !events) {
        return;
    }

    // 拆分事件类型
    types = ( types || '' ).match(rnotwhite);
    // 空类型，表示输入是空数据，当前元素的所有事件都要删除
    if (!types) {
        types = Object.keys(events);
    }
    if (types.length > 1) {
        types.forEach((type) => remove(elem, type, selector, callback));
        return;
    }

    const type = types[0];
    events[type] = events[type].filter((handlerObj) => {
        if (selector === '*' || (!selector && !callback)) {
            return (false);
        }
        if ((selector && !callback && selector === handlerObj.selector) ||
            (!selector && callback && callback === handlerObj.callback) ||
            (selector === handlerObj.selector && callback === handlerObj.callback)) {
            return (false);
        }
        return (true);
    });

    // 当前类型的事件已经空了
    if (!events[type].length) {
        elem.removeEventListener(type, elemData.handle, true);
        delete events[type];
    }

    // 当前委托元素已经没有委托事件了
    if (Object.isEmpty(events)) {
        cache.delete(elem);
    }
}

export default { add, remove };
