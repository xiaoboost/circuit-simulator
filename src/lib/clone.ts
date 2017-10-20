// Object.assign(Array, {
//     clone<T>(from: T[]): T[] {
//         return from.map(clone);
//     },
// });

// Object.assign(Object, {
//     clone<T>(from: T): T {
//         return Object
//             .keys(from)
//             .reduce((obj, key) => ((obj[key] = clone(from[key])), obj), ({}));
//     },
// };

// // 深复制
// // TODO: 还需要考虑循环引用的情况，此时应当直接抛出错误
// function clone<T>(from: T): T {
//     if (from instanceof Array) {
//         return Array.clone(from);
//     } else if (from instanceof Object) {
//         return Object.clone(from);
//     } else {
//         return from;
//     }
// }

export default function CloneModule<T>(input: T): T {
    // const record = new Map();

    return (function clone<U>(from: U): U {
        return from;
    })(input);
}
