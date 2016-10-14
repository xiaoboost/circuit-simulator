//类似jQuery的库，项目中所有关于DOM的操作都在这里
//仅仅是API类似而已，其中的实现细节和原版完全不同

const w = window,
    u = undefined,
    obj = "object",
    str = "string",
    fun = "function",
    num = "number",
    doc = w.document,
    rnotwhite = /\S+/g,
    rkeyEvent = /^key/,
    rselect = /[^.# ]+/g,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    ran = "event" + (1 + Math.random()).toFixed(10).toString().replace( /\D/g, "" );

//有效以及无效函数
function returnTrue() {
    return true;
}
function returnFalse() {
    return false;
}
//检测element的种类是否能接受
function acceptData(owner) {
    // 能接受的节点类型:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    return owner.nodeType === 1 || owner.nodeType === 9;
}
//是否是类似数组的元素
function isArrayLike( obj ) {
    var length = !!obj && "length" in obj && obj.length,
        type = typeof obj;

    if (type === "function") {
        return false;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}
//是否是函数
function isFunction(obj) {
    return (typeof obj === "function");
}
//元素迭代
function each(obj, callback) {
    let length;

    if (isArrayLike(obj)) {
        length = obj.length;
        for (let i = 0; i < length; i++) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        for (let i in obj) if(obj.hasOwnProperty(i)) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }
    return obj;
}
//是否是空对象
function isEmptyObject(obj) {
    for(let name in obj) if(obj.hasOwnProperty(name)) {
        return false;
    }
    return true;
}
//是否是网页元素
function isElement(elem) {
    return elem.setAttribute && elem.classList && elem.hasAttribute;
}
//元素匹配
//选择器没有空格，即没有层级关系；根据选择器的class和id以及tag在elements中选出对应的元素
function mathchDom(elements, selector) {
    const ans = $();
    //删除选择器中的所有空格
    selector = selector.replace(" ", "");
    //没有输入选择器，那么返回$(elements)
    if(!selector) {
        for(let i = 0; i < elements.length; i++) {
            ans.push(elements[i]);
        }
        return(ans);
    }
    let selectors = selector.split(",").map(function(n) {
        const ans = {
            "tag": "",
            "id": "",
            "class": []
        };
        const matchs = (n || "").match(rselect) || [""];
        for(let i = 0; i < matchs.length; i++) {
            const index = n.indexOf(matchs[i]);
            if(index) {
                //id、class
                if(n[index - 1] === "#") {
                    ans.id = matchs[i];
                } else if(n[index - 1] === ".") {
                    ans.class.push(matchs[i]);
                }
            } else {
                //tag
                ans.tag = matchs[i].toLowerCase();
            }
        }
        return(ans);
    });
    for(let i = 0; i < selectors.length; i++) {
        let elem = [];
        const idCheck = selectors[i].id,
            tagCheck = selectors[i].tag,
            classCheck = selectors[i].class;
        //id和tag检查
        for(let j = 0; j < elements.length; j++) {
            if ((!idCheck && !tagCheck) ||
                (!idCheck && tagCheck && elements[j].tagName.toLowerCase() === tagCheck) ||
                (!tagCheck && idCheck && elements[j].getAttribute("id") === idCheck) ||
                (idCheck && tagCheck && elements[j].getAttribute("id") === idCheck && elements[j].tagName.toLowerCase() === tagCheck)) {
                elem.push(elements[j]);
            }
        }
        //class检查
        if(classCheck.length) {
            //对每一个元素检查是否含有所有class
            elem = elem.filter((element) => {
                return classCheck.every((clas) => {
                    return $(element).hasClass(clas);
                });
            });
        }
        for(let j = 0; j < elem.length; j++) {
            ans.push(elem[j]);
        }
    }
    return ans;
}

//事件委托部分的Event类
function Event(src) {
    // Event object
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = src.defaultPrevented ||
        src.defaultPrevented === u &&

        // Support: Android <=2.3 only
        src.returnValue === false ?
            returnTrue :
            returnFalse;

        // Create target properties
        // Support: Safari <= 6 - 7 only
        // Target should not be a text node (#504, #13143)
        this.target = ( src.target && src.target.nodeType === 3 ) ?
            src.target.parentNode :
            src.target;

        this.currentTarget = src.currentTarget;
        this.relatedTarget = src.relatedTarget;

        // Event type
    } else {
        this.type = src;
    }

    // Create a timestamp if incoming event doesn"t have one
    this.timeStamp = src && src.timeStamp;
}
Event.prototype = {
    constructor: Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,

    preventDefault: function() {
        let e = this.originalEvent;
        this.isDefaultPrevented = returnTrue;
        if ( e && !this.isSimulated ) {
            e.preventDefault();
        }
    },
    stopPropagation: function() {
        let e = this.originalEvent;
        this.isPropagationStopped = returnTrue;
        if ( e && !this.isSimulated ) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function() {
        let e = this.originalEvent;
        this.isImmediatePropagationStopped = returnTrue;
        if ( e && !this.isSimulated ) {
            e.stopImmediatePropagation();
        }
        this.stopPropagation();
    }
};
//Event类扩展自mouseEvent类
each(
    {
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        char: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        deltaY: true,

        which: function (event) {
            let button = event.button;

            // Add which for key events
            if (event.which == null && rkeyEvent.test(event.type)) {
                return event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
                return ( (button & 1) ? 1 : ( (button & 2) ? 3 : ( (button & 4) ? 2 : 0 ) ) );
            }

            return event.which;
        }
    },
    function(name, hook) {
        Object.defineProperty(Event.prototype, name, {
            enumerable: true,
            configurable: true,

            get: isFunction(hook) ?
                function () {
                    if (this.originalEvent) {
                        return hook(this.originalEvent);
                    }
                } :
                function () {
                    if (this.originalEvent) {
                        return this.originalEvent[name];
                    }
                },

            set: function (value) {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: value
                });
            }
        });
    }
);

//记录委托数据的Data类
function Data() {
    this.expando = ran;
}
Data.prototype = {
    //创建数据集合
    cache: function (owner) {
        //取出数据
        var value = owner[this.expando];
        //如果没有的话，那么新建
        if (!value) {
            value = {};
            if (acceptData(owner)) {
                owner[this.expando] = value;
            }
        }
        return value;
    },
    get: function (owner, key) {
        return key === u ? this.cache(owner) :
            owner[this.expando] && owner[this.expando][key];
    },
    remove: function (owner, key) {
        let cache = owner[this.expando];

        //非法数据，直接返回
        if (cache === u) {
            return;
        }

        //按照key删除数据
        key = (key || "" ).match(rnotwhite) || [""];
        for(let i = 0; i < key.length; i++) {
            delete cache[key[i]];
        }

        //数据已经空了，那么在网页元素中删除数据
        if (key === u || isEmptyObject(cache)) {
            if (owner.nodeType) {
                owner[this.expando] = u;
            } else {
                delete owner[this.expando];
            }
        }
    },
    hasData: function (owner) {
        var cache = owner[this.expando];
        return cache !== u && !isEmptyObject(cache);
    }
};

//事件委托相关的函数
const delegate = {
    //储存事件的全局变量
    global: new Data(),
    //添加事件
    add: function (elem, types, handler, data, selector) {
        let eventHandle, events, handleObj, handlers, type, bindType,
            elemData = delegate.global.get(elem);

        //非法操作，退出
        if (!elemData) {
            return;
        }
        // 当前Dom首次绑定事件
        if (!(events = elemData.events)) {
            events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function (e) {
                //返回分发函数
                return delegate.dispatch.apply(elem, arguments);
            };
        }
        // 分割事件名称
        types = (types || "").match(rnotwhite) || [""];
        for(let i = 0; i < types.length; i++) {
            type = types[i];

            //非法名称，跳过
            if (!type) {
                continue;
            }
            //特殊事件绑定
            bindType = (delegate.special[type] && delegate.special[type].bindType) || type;

            //句柄对象
            handleObj = {
                type: bindType,
                origType: type,
                data: data,
                handler: handler,
                selector: selector,
                matches: $(selector, $(elem))
            };

            //这个事件是初次定义
            if (!(handlers = events[bindType])) {
                handlers = events[bindType] = [];

                //绑定监听事件
                if (elem.addEventListener) {
                    elem.addEventListener(bindType, eventHandle);
                }
            }
            /*
             在适用性上主要还是selector的问题
             现在的策略是当selector和已有的相同的时候，后面的将会覆盖前面的
             但是实际上还有一种情况，那就是selector的字符串不同，但是选出来的元素是一样的情况
             原版的jq是有自己的选择器模块，防止了这类情况的发生，但是现在这个模块并没有，所以只能在使用的时候避免这个问题
             */
            //selector有重复的，那么就覆盖，没有重复的那就添加到末尾
            if(!(events[bindType].some((n, i, arr) => (selector === n.selector) && (arr[i] = handleObj)))) {
                handlers.push(handleObj);
            }
        }

    },
    //触发事件时分发回调函数
    dispatch: function (nativeEvent) {
        //console.time("dispatch");
        //创建新的event对象
        let event = delegate.fix(nativeEvent),
            handlerQueue, args = new Array(arguments.length),
            handlers = (delegate.global.get(this, "events") || {})[nativeEvent.type] || [];

        //回调函数的参数赋值
        args[0] = event;
        for (let i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        //委托元素赋值
        event.delegateTarget = this;
        //计算句柄队列
        handlerQueue = delegate.handlers.call(this, event, handlers);
        //由队列的顺序运行回调函数
        for(let i = 0; i < handlerQueue.length; i++) if(!event.isPropagationStopped()) {
            let handleObj = handlerQueue[i], ret,
                fn = handleObj.handlers.handler;
            event.currentTarget = handleObj.elem;
            event.handleObj = handleObj;
            event.data = handleObj.handlers.data;
            event.type = handleObj.handlers.origType;

            //特殊事件
            //如果真正触发事件的元素是当前元素的子元素，那么禁止运行回调
            if (delegate.special[event.type] && !delegate.special[event.type].bubble) {
                const related = event.relatedTarget;
                if (!related || (related !== handleObj.elem && !handleObj.elem.contains(related))) {
                    event.type = handleObj.origType;
                    ret = fn.apply(handleObj.elem, args);
                }
            } else {
                //普通事件，直接运行回调
                ret = fn.apply(handleObj.elem, args);
            }

            event.type = handleObj.type;
            //若回调完成返回false，则阻止事件继续冒泡
            if (ret !== undefined) {
                if (( event.result = ret ) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
        return event.result;
    },
    //沿着触发对象向上直到委托对象，将所有触发的事件包装成队列
    handlers: function (event, handlers) {
        let i, handlerQueue = [], delegateCount = handlers.length,
            cur = event.target;

        //存在句柄，节点类型正确，且当前触发事件的元素并不是委托事件的元素
        if (delegateCount && event.target.nodeType && cur !== this) {
            //沿着触发节点向上
            for (; cur !== this; cur = cur.parentNode || this) {
                //节点为 Node.ELEMENT_NODE
                if (cur.nodeType === 1) {
                    for (i = 0; i < delegateCount; i++) {
                        let handleObj = handlers[i];
                        //读取选择器
                        let sel = handleObj.selector,
                            matches = handleObj.matches;
                        //选择器存在，那么进行匹配
                        //在冒泡的过程中，一个element只可能触发一次，所以找到合适的元素之后可以直接跳出循环
                        if(sel && sel.length) {
                            if (!matches.hasElem(cur)) {
                                matches = $(sel, $(this));
                                if(matches.hasElem(cur)) {
                                    handlerQueue.push({elem: cur, handlers: handleObj});
                                    break;
                                }
                            } else {
                                handlerQueue.push({elem: cur, handlers: handleObj});
                                break;
                            }
                        }
                    }
                }
            }
        }

        //最后cur等于了this本身
        for (i = 0; i < delegateCount; i++) {
            let handleObj = handlers[i];
            //从集合中寻找没有选择器的委托事件，因为那个代表了本体的事件
            if(!handleObj.selector) {
                handlerQueue.push({elem: cur, handlers: handleObj});
                break;
            }
        }

        return handlerQueue;
    },
    //统一格式
    fix: function (originalEvent) {
        return originalEvent[ran] ?
            originalEvent : (new Event(originalEvent));
    },
    //去除事件委托
    remove: function (elem, types, handler, selector) {
        let elemData = delegate.global.hasData(elem) && delegate.global.get(elem),
            events = elemData.events;

        //没有找到委托事件数据，直接退出
        if (!elemData || !events) {
            return;
        }

        //拆分事件类型
        types = ( types || "" ).match(rnotwhite) || [""];
        //空类型，表示输入是空数据，当前元素的所有事件都要删除
        //把所有事件类型都加入待删除列表
        if(!types[0]) {
            types.length = 0;
            for(let i in events) if(events.hasOwnProperty(i)) {
                types.push(i);
            }
        }
        //按照列表删除事件
        for (let i = 0; i < types.length; i++) {
            let type = types[i],
                handlers = events[type] || [],
                deletehandler = [];

            //选择器为“任意”，或者选择器和回调函数均没有输入，那么表示去除当前事件的全部委托
            if(selector === "**" || (selector === u && handler === u)) {
                deletehandler.push(type);
            } else {
                for(let j = 0; j < handlers.length; j++) {
                    let handlerObj = handlers[j];
                    if ((selector !== u && handler === u && selector === handlerObj.selector) ||
                        (selector === u && handler !== u && handler === handlerObj.handler) ||
                        (selector === handlerObj.selector && handler === handlerObj.handler)) {
                        handlers.splice(j, 1);
                        break;
                    }
                }
                //委托数组为空
                if(!handlers.length) {
                    deletehandler.push(type);
                }
            }
            //某种事件的委托为空，那么解除委托元素的触发事件，并删除数据
            for(let j = 0; j < deletehandler.length; j++) {
                elem.removeEventListener(type, elemData.handle);
                delete events[type];
            }
        }
        // 如果委托事件已经空了，那么删除整个记录
        if (isEmptyObject(events)) {
            delegate.global.remove(elem, "handle events");
        }
    },
    //特殊事件
    special: {
        mouseenter: {
            delegateType: "mouseover",
            bindType: "mouseover",
            bubble: false
        },
        mouseleave: {
            delegateType: "mouseout",
            bindType: "mouseout",
            bubble: false
        },
    }
};

//$类定义
function $(selector, context, namespace) {
    return new $.fn.init(selector, context, namespace);
}
$.fn = $.prototype = {
    constructor: $,
    length: 0,
    push(elem) {
        this[this.length] = elem;
        this.length++;
    },
    pop() {
        const ans = this[this.length - 1];
        delete this[this.length - 1];
        this.length --;
        return($(ans));
    },
    each(callback) {
        for (let i = 0; i < this.length; i++) {
            callback(this[i], i);
        }
    },
    map(callback) {
        const ans = [];
        for (let i = 0; i < this.length; i++) {
            ans.push(callback(this[i], i));
        }
        return(ans);
    },
    //真正的构造函数
    init(selector, context, namespace) {
        //如果输入的已经是jq元素，那么直接返回这个jq元素
        if(selector instanceof $.fn.init) {
            return(selector);
        }

        //创建html元素部分
        if (typeof selector === str && selector[0] === "<" && selector[selector.length - 1] === ">") {
            //$("<html>")
            if(typeof context === str && namespace === u) {
                //$("<html>", namespace)
                namespace = context;
                context = {};
            } else if (typeof context === str && typeof namespace === obj) {
                //$("<html>", namespace, attr)
                const temp = namespace;
                namespace = context;
                context = temp;
            }
            selector = selector.substring(1, selector.length - 1);
            //没有命名空间，那么就以普通方式创建标签
            if(!namespace) {
                this.push(doc.createElement(selector));
            } else {
                this.push(doc.createElementNS(namespace, selector));
            }
            this.attr(context);
            return this;
        }

        //选择html元素部分
        let root = context ? $(context) : root$;

        if (!selector) {
            //空或者非法输入：$(""), $(null), $(undefined), $(false)
            return this;
        } else if (typeof selector === str) {
            //$(HTML strings)
            root.each((n) => {
                let all = n.querySelectorAll(selector);
                for (let i = 0; i < all.length; i++) {
                    this.push(all[i]);
                }
            });
        } else if (selector.nodeType || selector === w) {
            //$(DOMElement)
            this[0] = selector;
            this.length = 1;
            return (this);
        }
        //this.selector = selector;
        //this.preObject = root;
    },
    //改变内联样式，flag为是否删除原来属性，默认不删除
    css(name, value, flag = false) {
        if (!name) {
            return (this);
        }
        if(typeof name === obj) {
            if (flag) {
                let str = "";
                for (let i in name) if (name.hasOwnProperty(i)) {
                    str += i + "=" + name[i] + ";";
                }
                this.each((n) => n.style = str);
            } else {
                for (let i in name) if (name.hasOwnProperty(i)) {
                    this.each((n) => n.style[i] = name[i]);
                }
            }
        } else if(typeof name === str && typeof value === str || typeof value === num) {
            if (flag) {
                this.each((n) => n.style = name + "=" + value + ";");
            } else {
                this.each((n) => n.style[name] = value);
            }
        }
        return(this);
    },
    //读取或者是设置DOM的attribute
    attr(name, value) {
        if(name instanceof Array) {
            //获取很多属性，返回数组
            const ans = [];
            for(let i = 0; i < name.length; i++) {
                ans.push(this.attr(name[i]));
            }
            return(ans);
        } else if (typeof name === obj) {
            //设置多个值
            for (let i in name) if (name.hasOwnProperty(i)) {
                this.each((n) => n.setAttribute(i, name[i]));
            }
        } else if (typeof name === str && value !== u) {
            //设置单个值
            this.each((n) => n.setAttribute(name, value.toString()));
        } else if (typeof name === str && value === u) {
            //获得单个属性值
            return this[0].getAttribute(name);
        }
        return this;
    },
    prop(name, value) {
        if (typeof name === obj) {
            //设置多个值
            for (let i in name) if (name.hasOwnProperty(i)) {
                this.each((n) => n[i] = name[i]);
            }
            return this;
        } else if (typeof name === str && value !== u) {
            //设置单个值
            this.each((n) => n[name] = value);
        } else if (typeof name === str && value === u) {
            //获得属性值
            return this[0][name];
        }
        return this;
    },
    //删除attribute
    removeAttr(name) {
        if (typeof name === str) {
            this.each((n) => n.removeAttribute(name));
        }
    },
    //删除prop
    removeProp(name) {
        if (typeof name === str) {
            this.each((n) => delete n[name]);
        }
    },
    //添加class
    addClass(name) {
        name = (name || "").match(rnotwhite) || [""];
        this.each((elem) => {
            for(let i = 0; i < name.length; i++) {
                elem.classList.add(name[i]);
            }
        });
    },
    //删除class
    removeClass(name) {
        name = (name || "").match(rnotwhite) || [""];
        this.each((elem) => {
            for(let i = 0; i < name.length; i++) {
                elem.classList.remove(name[i]);
            }
        });
    },
    //第一个element是否含有某个class
    hasClass(name) {
        return this[0].classList.contains(name);
    },
    //是否含有某element
    hasElem(elem) {
        let ans = false;
        for (let i = 0; i < this.length; i++) {
            ans |= this[i] === elem;
            if (ans) return (ans);
        }
        return (false);
    },
    //事件委托
    on(type, selector, data, fn) {
        let types = {};

        if (typeof type === "object") {
            //一次绑定多个事件
            types = type;
        } else {
            //一次只绑定了一个事件
            if (data == null && fn == null) {
                // ( types, fn )
                //给当前元素本身绑定事件
                types[type] = selector;
                data = selector = u;
            } else if (fn == null) {
                if (typeof selector === str) {
                    // ( types, selector, fn )
                    types[type] = data;
                    data = u;
                } else {
                    // ( types, data, fn )
                    types[type] = data;
                    data = selector;
                    selector = u;
                }
            }
        }
        return this.each((n) => {
            for (let i in types) {
                if (types.hasOwnProperty(i)) {
                    delegate.add(n, i, types[i], data, selector);
                }
            }
        });
    },
    //事件解除委托
    off(type, selector, fn) {
        let types = {};

        if (typeof type === obj) {
            // ( types-object [, selector] )
            types = type;
        } else if (typeof selector === fun) {
            // ( types [, fn] )
            types[type] = selector;
            selector = undefined;
        } else if (typeof selector === str && fn === u) {
            // ( types [, selector] )
            types[type] = u;
        } else if (typeof selector === str && typeof fn === fun) {
            // ( types [, selector ] [, handler ]
            types[type] = fn;
        } else if (typeof type === str && selector === u && fn === u) {
            // ( types )
            types[type] = u;
        } else if (type === u) {
            // ()
            // 输入空数据，类型赋值为空字符串
            return this.each((n) => delegate.remove(n, "", u, selector));
        }
        return this.each((n) => {
            for (let i in types) {
                if (types.hasOwnProperty(i)) {
                    delegate.remove(n, i, types[i], selector);
                }
            }
        });
    },
    //把content匹配所有元素追加到this下标为0的元素内部的最后
    append(content) {
        if(isElement(content)) {
            this[0].appendChild(content);
        } else if (content instanceof $.fn.init) {
            content.each((n) => this[0].appendChild(n));
        }
        return($(content));
    },
    //把content匹配所有元素追加到this下标为0的内部的某元素前面
    preappend(content, before) {
        const temp = before ? before : this[0].childNodes[0],
            topElement = (temp instanceof $.fn.init) ? temp[0] : temp;

        if(isElement(content)) {
            this[0].insertBefore(content, topElement);
        } else if (content instanceof $.fn.init) {
            content.each((n) => this[0].insertBefore(n, topElement));
        }
    },
    //把this中的所有元素追加到content内部的最后
    appendTo(content) {
        if(isElement(content)) {
            this.each((n) => content.appendChild(n));
        } else if (content instanceof $.fn.init) {
            this.each((n) => content[0].appendChild(n));
        }
    },
    //把content匹配所有元素追加到this下标为0的内部的最前面
    preappendTo(content) {
        if(isElement(content)) {
            const topElement = content.childNodes[0];
            this.each((n) => content.insertBefore(n, topElement));
        } else if (content instanceof $.fn.init) {
            const topElement = content[0].childNodes[0];
            this.each((n) => content[0].insertBefore(n, topElement));
        }
    },
    //改变元素内容
    text(string) {
        //关于textContent和innerText之间的兼容性，还没有进行验证，所以现在使用看起来兼容性较好的textContent
        if(string === u) {
            return(this[0].textContent);
        } else if(typeof string === str) {
            this.each((n) => n.textContent = string);
            return(this);
        }
    },
    //得到第一个元素宽度
    //所有有效宽度中返回最大的那个
    width() {
        let textWidth;
        if (this[0].getClientRects) {
            const temp = this[0].getClientRects()[0];
            textWidth = temp ? temp.width : 0;
        }
        return Math.max(
            textWidth || 0,
            this[0].clientWidth || 0,
            this[0].offsetWidth || 0,
            this[0].innerWidth || 0
        );
    },
    //得到第一个元素高度
    height() {
        let textHeight;
        if (this[0].getClientRects) {
            const temp = this[0].getClientRects()[0];
            textHeight = temp ? temp.height : 0;
        }
        return Math.max(
            textHeight || 0,
            this[0].clientHeight || 0,
            this[0].offsetHeight || 0,
            this[0].innerHeight || 0
        );
    },
    //元素内边框宽度及长度
    //非块级元素这个值是0
    innerWidth() {
        return(this[0].clientWidth);
    },
    innerHeight() {
        return(this[0].clientHeight);
    },
    //把当前DOM全部移除出HTML文档流
    remove(index) {
        if(index === u) {
            this.each((n) => n.parentNode.removeChild(n));
        } else {
            const sub = (index >= 0) ?
                index : (this.length + index);

            if(index >= 0 || index < this.length) {
                this[sub].parentNode.removeChild(this[sub]);
                delete this[sub];
                for(let i = sub; i < this.length - 1; i++) {
                    this[i + 1] = this[i];
                }
                delete this[this.length - 1];
                this.length --;
            }
        }
    },
    //返回下标为0的元素的单一层级的子元素
    childrens(filter) {
        if (typeof filter === str) {
            let elements = [];
            this.each((n) => elements = elements.concat(Array.prototype.slice.call(n.childNodes)));
            return mathchDom(elements, filter);
        } else if (typeof filter === num) {
            const ans = $();
            this.each((n) => ans.push(n.childNodes[filter]));
            return (ans);
        } else if (filter === u) {
            const ans = $();
            this.each((n) => {
                for (let i = 0; i < n.childNodes.length; i++) {
                    ans.push(n.childNodes[i]);
                }
            });
            return (ans);
        }
    },
    //下标为0的元素的子元素中进行限定搜索
    childSelect(select, max, opt) {
        const selectors = $(select, this),
            tag = "<" + select.split(/[.#]/)[0] + ">";

        opt = opt || {};
        opt.class = select.split(".").splice(1).join(" ");

        while(selectors.length > max) {
            selectors.pop().remove();
        }
        while(selectors.length < max) {
            selectors.push(this.append($(tag, opt))[0]);
        };
        return(selectors);
    },
    //返回匹配元素的标号下的元素
    get(index) {
        const sub = (index >= 0) ?
            index : (this.length + index);

        if(index >= 0 || index < this.length) {
            return($(this[sub]));
        } else {
            return(false);
        }
    },
    // 求当前元素在current内的相对位置
    // current必须是this的祖先元素，且它本身必须是定位元素
    // 如果没有输入current，那么返回最近的相对位置
    offset(current) {
        if(!current[0].contains(this[0])) {
            throw "current必须是this的祖先元素";
        }
        let dom = this[0], offsetX = 0, offsetY = 0;

        while(dom !== current[0]) {
            offsetX += dom.offsetLeft;
            offsetY += dom.offsetTop;
            dom = dom.offsetParent;
            if(dom !== current[0] && dom.contains(current[0])) {
                throw "current不是定位元素";
            }
        }
        return([offsetX, offsetY]);
    }
};

$.maxSelect = function(select, parent, max, opt) {
    const main = $(parent),
        selectors = $(select, main),
        tag = "<" + select.split(".")[0] + ">";

    opt = opt || {};
    opt.class = select.split(".").splice(1).join(" ");

    while(selectors.length > max) {
        selectors.pop().remove();
    }
    while(selectors.length < max) {
        selectors.push(
            main.append($(tag, opt))[0]
        );
    };
    return(selectors);
}
//改变init构造函数的原型链
$.prototype.init.prototype = $.prototype;
//初始化的document
const root$ = $(doc);

export { $ };
