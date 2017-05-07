import Vue from 'vue';
import InputVerifiable from '@/components/input-verifiable';
import { createVue, destroyVM, triggerEvent } from '../util';

Vue.component('v-input', InputVerifiable);

// 设定输入框的值，并触发 input 事件
function inputEvent(elm, str) {
    elm.value = str;
    triggerEvent(elm, 'input');
}

describe('input-verifiable.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('create without verification', () => {
        const input = '这是初始输入值',
            placeholder = '这是默认占位符';

        vm = createVue({
            template: `
                <v-input
                    value="${input}"
                    placeholder="${placeholder}">
                </v-input>
            `
        });

        const inputElm = vm.$el.querySelector('input'),
            message = vm.$el.querySelector('.input-message');

        expect(!!message).to.be.false;
        expect(inputElm.value).to.equal(input);
        expect(inputElm.getAttribute('placeholder')).to.equal(placeholder);
    });
    it('input event and default verification', () => {
        vm = createVue({
            template: `
                <v-input
                    v-model="data"
                    @error="hasError">
                </v-input>
            `,
            data() {
                return {
                    data: 'start',
                    error: false
                };
            },
            methods: {
                hasError() {
                    this.error = true;
                }
            }
        });

        const inputElm = vm.$el.querySelector('input'),
            randomStr = 'Q^!L7PX^Tp1Vn@4Uu0MxRH@uY40om6';

        // 父元素传递的初始化值
        expect(inputElm.value).to.equal('start');
        // 组件输入空字符串
        inputEvent(inputElm, '');
        expect(vm.data).to.equal('');
        expect(vm.error).to.be.false;
        // 组件输入随机字符串
        inputEvent(inputElm, randomStr);
        expect(vm.data).to.equal(randomStr);
        expect(vm.error).to.be.false;
    });
    it('verification of maxlength', () => {
        vm = createVue({
            template: `
                <v-input
                    v-model="data"
                    :maxlength="5">
                </v-input>
            `,
            data() {
                return {
                    data: ''
                };
            }
        });

        const inputElm = vm.$el.querySelector('input');
        // 组件输入字符串小于最大长度
        inputEvent(inputElm, '1234');
        expect(vm.data).to.equal('1234');
        // 组件输入字符串大于最大长度
        inputEvent(inputElm, '123456789');
        expect(vm.data).to.equal('1234');
    });
    it('verification of required', () => {
        vm = createVue({
            template: `
                <v-input
                    required
                    v-model="data"
                    @error="event">
                </v-input>
            `,
            data() {
                return {
                    data: '',
                    error: ''
                };
            },
            methods: {
                event(name) {
                    this.error = name;
                }
            }
        });

        const inputElm = vm.$el.querySelector('input');
        // 初始化不验证
        expect(vm.error).to.equal('');
        // 输入字符串，没有发生错误
        inputEvent(inputElm, '1234');
        expect(vm.error).to.equal('');
        // 输入字符串为空，发生错误
        inputEvent(inputElm, '');
        expect(vm.error).to.equal('required');
    });
    it('verification of pattern', () => {
        vm = createVue({
            template: `
                <v-input
                    :pattern="reg"
                    v-model="data"
                    @error="event">
                </v-input>
            `,
            data() {
                return {
                    reg: /[a-zA-Z]/,
                    data: '',
                    error: ''
                };
            },
            methods: {
                event(name) {
                    this.error = name;
                }
            }
        });

        const inputElm = vm.$el.querySelector('input');
        // 初始化不验证
        expect(vm.error).to.equal('');
        // 输入符合正则的字符串，没有发生错误
        inputEvent(inputElm, 'abscf');
        expect(vm.error).to.equal('');
        // 输入符合不正则的字符串，发生错误
        inputEvent(inputElm, '0123456');
        expect(vm.error).to.equal('pattern');
    });
    it('verification of function', () => {
        vm = createVue({
            template: `
                <v-input
                    :func="func"
                    v-model="data"
                    @error="event">
                </v-input>
            `,
            data() {
                return {
                    func: () => false,
                    data: '',
                    error: ''
                };
            },
            methods: {
                event(name) {
                    this.error = name;
                }
            }
        });

        const inputElm = vm.$el.querySelector('input');
        // 初始化不验证
        expect(vm.error).to.equal('');
        // 输入任意字符串都不通过
        inputEvent(inputElm, 'abscf');
        expect(vm.error).to.equal('function');
    });
    it('error message of verification', (done) => {
        const errorText = '输入文本格式错误';

        vm = createVue({
            template: `
                <v-input
                    required
                    v-model="data"
                    :message="message">
                </v-input>
            `,
            data() {
                return {
                    data: '',
                    message: errorText
                };
            }
        });

        const inputElm = vm.$el.querySelector('input'),
            message = vm.$el.querySelector('.input-error-message');

        // 错误文本存在，但是不显示
        expect(message.textContent).to.equal(errorText);
        expect(message.style.display).to.equal('none');
        // 输入字符串为空时，触发验证事件，显示错误提示
        inputEvent(inputElm, '');
        // 等待网页渲染
        vm.$nextTick(() => {
            expect(message.style.display).to.equal('');
            done();
        });
    });
});
