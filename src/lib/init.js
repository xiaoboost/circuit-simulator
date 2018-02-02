// 检测浏览器是否支持 passive 监听器
let passive = false;
try {
    const opts = Object.defineProperty({}, 'passive', {
        get() {
            passive = true;
        },
    });
    document.body.addEventListener('test', null, opts);
}
catch (e) {
    if ($ENV.NODE_ENV === 'development') {
        console.log('your computed doesn\'t support passive event.');
    }
}

// 检测浏览器是否支持 once 监听器
let once = false;
try {
    const opts = Object.defineProperty({}, 'once', {
        get() {
            once = true;
        },
    });
    document.body.addEventListener('test', null, opts);
}
catch (e) {
    if ($ENV.NODE_ENV === 'development') {
        console.log('your computed doesn\'t support once event.');
    }
}

Object.defineProperties(window, {
    supportsPassive: {
        enumerable: false,
        writable: false,
        value: passive,
    },
    supportsOnce: {
        enumerable: false,
        writable: false,
        value: once,
    },
});

// 网页禁止右键
window.document.oncontextmenu = () => false;
