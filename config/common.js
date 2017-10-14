exports.merge = function(base, ...extend) {
    extend.forEach((data) => Object.entries(data).forEach(([key, value]) => {
        if (!base[key]) {
            if (value instanceof Object) {
                base[key] = Object.assign({}, value);
            } else {
                base[key] = value;
            }
        } else {
            Object.assign(base[key], value);
        }
    }));
};

exports.data = {
    $DATA: {
        SVG_NS: 'http://www.w3.org/2000/svg',
    },
};
