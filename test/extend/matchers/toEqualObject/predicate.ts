interface AnyObject {
    [key: string]: any | AnyObject;
}

function isObject(x: any): x is AnyObject {
    return (x !== null && (typeof x === 'object'));
}

function isSameArray(received: any[], argument: any[]) {
    return (
        received.length === argument.length &&
        received.every((item, i) => isSame(item, argument[i]))
    );
}

function isSameObject(received: AnyObject, argument: AnyObject): boolean {
    if (!isObject(received) || !isObject(argument)) {
        return (false);
    }

    if (!isSameArray(Object.keys(received), Object.keys(argument))) {
        return (false);
    }

    return Object.entries(received).every(([key, value]) => isSame(value, argument[key]));
}

function isSame(from: any, to: any): boolean {
    if (from instanceof Array) {
        return isSameArray(from, to);
    }
    else if (isObject(from)) {
        return isSameObject(from, to);
    }
    else {
        return from === to;
    }
}

export default function predicate(received: AnyObject, argument: AnyObject): boolean {
    return isSame(received, argument);
}
