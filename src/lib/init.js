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

Object.defineProperty(window, 'supportsPassive', {
    enumerable: false,
    writable: false,
    value: passive,
});

// 网页禁止右键
window.document.oncontextmenu = () => false;
