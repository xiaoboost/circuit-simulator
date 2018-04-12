import '../extend';

import 'src/lib/init';
import 'src/lib/native';

import { delay } from 'src/lib/utils';
import { mount, Wrapper } from '@vue/test-utils';

import ParamsDialog from 'src/components/params-dialog';
import InputVerifiable from 'src/components/input-verifiable';

/** 点击对话框取消按钮 */
function clickCancel() {
    const cancel = document.querySelector('button.cancel');
    cancel && cancel.dispatchEvent(new MouseEvent('click'));
}

/** 点击对话框确定按钮 */
function clickComfirm() {
    const confirm = document.querySelector('button.confirm');
    confirm && confirm.dispatchEvent(new MouseEvent('click'));
}

/** 点击键盘的 Esc 按钮 */
function pressEsc() {
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
}

/** 点击键盘的 Esc 按钮 */
function pressEnter() {
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
}

/** 点击键盘除了 Esc / Enter 的按钮 */
function pressExcludeEscEnter() {
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'h' }));
}

/** 填充对话框中的输入框的值 */
function fillDialogInput(vm: ParamsDialog, params: string[]) {
    const inputs = Array.from(vm.$el.querySelectorAll('input'));

    inputs.forEach((input, index) => {
        if (params[index]) {
            input.value = params[index];
        }

        input.dispatchEvent(new CustomEvent('input'));
    });
}

/**
 * 向对话框填入参数
 * @param {string[]} params 填入对话框的参数
 */
function inputDialog(params: string[]) {
    const inputs = Array.from(document.querySelectorAll('.params-dialog input')) as HTMLInputElement[];

    inputs.forEach((input, i) => {
        input.value = params[i];
    });
}

describe('params-dialog.vue', () => {
    let wrapper: Wrapper<ParamsDialog>;

    afterEach(() => {
        wrapper.vm.$el.parentNode &&
        wrapper.vm.$el.parentNode.removeChild(wrapper.vm.$el);

        wrapper.vm.$destroy();
    });

    test('create a params dialog', async () => {
        wrapper = mount(ParamsDialog);
        document.body.appendChild(wrapper.vm.$el);

        // visible is false, at first.
        expect(wrapper.isVisible()).toBeFalse();

        // visible is controled by var vision.
        wrapper.vm.vision = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.isVisible()).toBeTrue();

        wrapper.vm.vision = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.isVisible()).toBeFalse();
    });
    test('trigger cancel event', async () => {
        wrapper = mount(ParamsDialog);
        document.body.appendChild(wrapper.vm.$el);

        wrapper.vm.params.push({
            label: '阻值',
            value: '10k',
            unit: 'Ω',
        });

        // open dialog
        wrapper.vm.vision = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.isVisible()).toBeTrue();

        // click cancel button
        wrapper.vm.cancel = jest.fn();

        clickCancel();
        expect(wrapper.vm.cancel).toBeCalled();

        // press Esc at keyboard
        wrapper.vm.cancel = jest.fn();

        pressExcludeEscEnter();
        expect(wrapper.vm.cancel).not.toBeCalled();

        pressEsc();
        expect(wrapper.vm.cancel).toBeCalled();

        // when dialog is close, press Esc at keyboard, and happened nothing
        wrapper.vm.vision = false;
        wrapper.vm.cancel = jest.fn();

        pressEsc();
        expect(wrapper.vm.cancel).not.toBeCalled();
    });
    test('trigger confirm event', async () => {
        wrapper = mount(ParamsDialog);
        document.body.appendChild(wrapper.vm.$el);

        wrapper.vm.params.push({
            label: '阻值',
            value: '10_k',
            unit: 'Ω',
        });

        // open dialog
        wrapper.vm.vision = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.isVisible()).toBeTrue();

        // set function mock
        wrapper.vm.confirm = jest.fn();

        // id is wrong, not be called
        clickComfirm();
        expect(wrapper.vm.confirm).not.toBeCalled();

        // input legal id
        fillDialogInput(wrapper.vm, ['R_1']);
        clickComfirm();
        expect(wrapper.vm.confirm).not.toBeCalled();

        // input legal param
        fillDialogInput(wrapper.vm, ['R_1', '10k']);
        clickComfirm();
        expect(wrapper.vm.confirm).toBeCalled();

        // press Enter at keyboard
        wrapper.vm.confirm = jest.fn();

        pressExcludeEscEnter();
        expect(wrapper.vm.confirm).not.toBeCalled();

        pressEnter();
        expect(wrapper.vm.confirm).toBeCalled();
    });
});
