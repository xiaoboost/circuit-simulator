Object.defineProperty(window, '$ENV', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: {
        NODE_ENV: 'test',
    },
});
