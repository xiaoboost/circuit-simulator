import VNode, { cloneVNode } from '../vnode';
import dom, { HooksFunc, FuncTypes } from '../modules';

const emptyNode = new VNode('', {}, []);
const eleHooks: HooksFunc = {} as any;
const hookKeys: Array<keyof HooksFunc> = ['create', 'activate', 'update', 'remove', 'destroy'];

// 集合所有钩子
hookKeys.forEach((key) => {
    const hook: FuncTypes[] = eleHooks[key] = [];

    Object.values(dom).forEach((module) => {
        const fn = module[key];
        fn && hook.push(fn);
    });
});

/** 调用销毁钩子函数 */
export function invokeDestroyHook(vnode: VNode) {
    // 调用当前钩子函数
    const vHook = vnode.data && vnode.data.hook;
    vHook && vHook.destroy && vHook.destroy(vnode);
    eleHooks.destroy.forEach((f) => f(vnode));

    // 调用子节点的钩子函数
    vnode.children.forEach(invokeDestroyHook);
}

/** 调用插入钩子函数 */
export function invokeInsertHook(vnode: VNode, queue: VNode[]) {
    queue.forEach((node) => {
        const vHook = vnode.data && vnode.data.hook;
        vHook && vHook.insert && vHook.insert(node);
    });
}

/** 调用创建钩子函数 */
export function invokeCreateHooks(vnode: VNode, queue: VNode[]) {
    eleHooks.create.forEach((f) => f(emptyNode, vnode));

    const hook = vnode.data.hook;
    if (hook) {
        if (hook.create) {
            hook.create(emptyNode, vnode);
        }
        if (hook.insert) {
            queue.push(vnode);
        }
    }
}
