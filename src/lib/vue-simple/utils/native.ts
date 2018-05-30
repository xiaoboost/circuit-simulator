/**
 * 从数组中移除某一项
 */
export function remove<T>(arr: T[], item: T): T[] | void {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
