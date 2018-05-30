import VNode from '../vnode';
import { HookFuncExport } from './index';
import { remove } from '../../utils';

export function registerRef(vnode: VNode, isRemoval?: boolean) {
    if (!vnode.data.ref || !vnode.context) {
        return;
    }

    const key = vnode.data.ref;
    const vm = vnode.context;
    const ref = (vnode.componentInstance || vnode.elm)!;
    const refs = vm.$refs;
    const refsValue = refs[key] as any;

    if (isRemoval) {
        if (Array.isArray(refsValue)) {
            remove(refsValue, ref);
        }
        else if (refsValue === ref) {
            delete refs[key];
        }
    }
    else if (vnode.data.refInFor) {
        if (!Array.isArray(refsValue)) {
            refs[key] = [ref] as any;
        }
        else if (refsValue.indexOf(ref) < 0) {
            refsValue.push(ref);
        }
    }
    else {
        refs[key] = ref;
    }
}

const module: HookFuncExport = {
    create(_: any, vnode: VNode) {
        registerRef(vnode);
    },
    update(oldVnode: VNode, vnode: VNode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
            registerRef(oldVnode, true);
            registerRef(vnode);
        }
    },
    destroy(vnode: VNode) {
        registerRef(vnode, true);
    },
};

export default module;
