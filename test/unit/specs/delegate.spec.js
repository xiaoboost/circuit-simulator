import Vue from 'vue';
import delegate from '@/plugin/delegate';
import { createVue, destroyVM, triggerEvent } from '../util';

Vue.use(delegate);

describe('plugin-delegate.js', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    describe('base directives', () => {
        const template = {
            template: `
                <div
                    class="outter"
                    v-delegate:click-a="['.text1', click_handler1]"
                    v-delegate:click-b="['.text2', click_handler2]"
                    v-delegate:mouseenter="['.inner', mouseenter_handler]"
                    v-delegate:mouseleave="['.inner', mouseleave_handler]">
                    <div class="inner">
                        <span class="text1">第一个文本</span>
                        <span class="text2">第二个文本</span>
                    </div>
                </div>`,
            data() {
                return {
                    text_click_1: 0,
                    text_click_2: 0,
                    mouseenter: 0,
                    mouseleave: 0
                };
            },
            methods: {
                click_handler1() {
                    this.text_click_1 ++;
                },
                click_handler2() {
                    this.text_click_2 ++;
                },
                mouseenter_handler() {
                    this.mouseenter ++;
                },
                mouseleave_handler() {
                    this.mouseleave ++;
                }
            }
        };
        it('click', () => {
            vm = createVue(template);

            const text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            triggerEvent(text1, 'click');
            expect(vm.text_click_1).to.equal(1);
            expect(vm.text_click_2).to.equal(0);
            triggerEvent(text2, 'click');
            expect(vm.text_click_1).to.equal(1);
            expect(vm.text_click_2).to.equal(1);
        });
        it('mouse(enter|leave)', () => {
            vm = createVue(template);

            const inner = vm.$el.querySelector('.inner'),
                text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            expect(vm.mouseenter).to.equal(0);
            triggerEvent(inner, 'mouseenter');
            expect(vm.mouseenter).to.equal(1);
            triggerEvent(text1, 'mouseenter');
            expect(vm.mouseenter).to.equal(1);

            expect(vm.mouseleave).to.equal(0);
            triggerEvent(inner, 'mouseleave');
            expect(vm.mouseleave).to.equal(1);
            triggerEvent(text2, 'mouseleave');
            expect(vm.mouseleave).to.equal(1);
        });
        it('remove', () => {
            vm = createVue(template);
            vm.$destroy();
        });
    });
    describe('directives with modifiers', () => {
        // 生成不同指令的模板
        function createTemplate(modifiers = '') {
            return {
                template: `
                    <div
                        class="outter"
                        v-delegate:mousedown-a="['span.text1', text_handler]"
                        v-delegate:mousedown-b${modifiers}="['.inner', div_handler]"
                        v-delegate:click${modifiers}="['.inner a#jump', a_handler]">
                        <div class="inner">
                            <span class="text1">第一个文本</span>
                            <span class="text2">第二个文本</span>
                            <a id="jump" href="#test"></a>
                        </div>
                    </div>`,
                data() {
                    return {
                        a_click: 0,
                        div_click: 0,
                        text_click: 0
                    };
                },
                methods: {
                    div_handler() {
                        this.div_click ++;
                    },
                    text_handler() {
                        this.text_click ++;
                    },
                    a_handler() {
                        this.a_click ++;
                    }
                }
            };
        }
        it('no modifiers', () => {
            vm = createVue(createTemplate());

            const inner = vm.$el.querySelector('.inner'),
                text = vm.$el.querySelector('.text1');

            expect(vm.text_click).to.equal(0);
            expect(vm.div_click).to.equal(0);

            triggerEvent(inner, 'mousedown');
            expect(vm.text_click).to.equal(0);
            expect(vm.div_click).to.equal(1);

            triggerEvent(text, 'mousedown');
            expect(vm.text_click).to.equal(1);
            expect(vm.div_click).to.equal(2);
        });
        it('modifiers of self', () => {
            vm = createVue(createTemplate('.self'));

            const inner = vm.$el.querySelector('.inner'),
                text = vm.$el.querySelector('.text1');

            expect(vm.div_click).to.equal(0);
            triggerEvent(text, 'mousedown');
            expect(vm.div_click).to.equal(0);
            triggerEvent(inner, 'mousedown');
            expect(vm.div_click).to.equal(1);
        });
        it('modifiers of left', () => {
            vm = createVue(createTemplate('.left'));

            const inner = vm.$el.querySelector('.inner');

            expect(vm.div_click).to.equal(0);
            triggerEvent(inner, 'mousedown', { button: 0 });
            expect(vm.div_click).to.equal(1);
            triggerEvent(inner, 'mousedown', { button: 2 });
            expect(vm.div_click).to.equal(1);
        });
        it('modifiers of right', () => {
            vm = createVue(createTemplate('.right'));

            const inner = vm.$el.querySelector('.inner');

            expect(vm.div_click).to.equal(0);
            triggerEvent(inner, 'mousedown', { button: 0 });
            expect(vm.div_click).to.equal(0);
            triggerEvent(inner, 'mousedown', { button: 2 });
            expect(vm.div_click).to.equal(1);
        });
        it('modifiers of stop', () => {
            vm = createVue(createTemplate('.stop'));

            const text = vm.$el.querySelector('.text1');

            triggerEvent(text, 'mousedown');
            expect(vm.text_click).to.equal(0);
            expect(vm.div_click).to.equal(1);
        });
        it('modifiers of prevent', () => {
            vm = createVue(createTemplate('.prevent'));

            const a = vm.$el.querySelector('.inner a');

            triggerEvent(a, 'click');
            expect(/#test$/.test(window.location.href)).to.be.false;
        });
    });
    describe('fix on parameters', () => {
        const template = {
            template: `
                <div class="outter">
                    <div class="inner">
                        <span class="text1">第一个文本</span>
                        <span class="text2">第二个文本</span>
                    </div>
                </div>`,
            data() {
                return {
                    click: 0
                };
            }
        };
        it('( type, fn )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', () => this.click++);
                }
            }));

            triggerEvent(vm.$el, 'click');
            expect(vm.click).to.equal(1);
        });
        it('( types, selector, fn )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.inner', () => this.click++);
                }
            }));

            const inner = vm.$el.querySelector('.inner');
            triggerEvent(inner, 'click');
            expect(vm.click).to.equal(1);
        });
        it('( types, data, fn )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', {test: 2008}, (e) => this.click = e.data.test);
                }
            }));

            triggerEvent(vm.$el, 'click');
            expect(vm.click).to.equal(2008);
        });
        it('( type, selector, data, fn )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.inner', {test: 2008}, (e) => this.click = e.data.test);
                }
            }));

            const inner = vm.$el.querySelector('.inner');
            triggerEvent(inner, 'click');
            expect(vm.click).to.equal(2008);
        });
    });
    describe('fix off parameters', () => {
        const template = {
            template: `
                <div class="outter">
                    <div class="inner">
                        <span class="text1">第一个文本</span>
                        <span class="text2">第二个文本</span>
                    </div>
                </div>`,
            data() {
                return {
                    text1: 0,
                    text2: 0
                };
            }
        };
        it('( )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.text1', () => this.text1++);
                    this.$$on('mouseenter', '.text2', () => this.text2++);
                },
                methods: {
                    clear() {
                        this.$$off();
                    }
                }
            }));

            const text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(1);

            vm.clear();
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(1);
        });
        it('( type )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.text1', () => this.text1++);
                    this.$$on('mouseenter', '.text2', () => this.text2++);
                }
            }));

            const text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(1);

            vm.$$off('click');
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(2);

            vm.$$off('mouseenter');
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(2);
        });
        it('( type, fn )', () => {
            let sign = 0;
            const handler = () => sign ++;

            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.text1', handler);
                }
            }));

            const text1 = vm.$el.querySelector('.text1');

            triggerEvent(text1, 'click');
            expect(sign).to.equal(1);

            vm.$$off('click', handler);
            triggerEvent(text1, 'click');
            expect(sign).to.equal(1);
        });
        it('( type, selector )', () => {
            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.text1', () => this.text1++);
                    this.$$on('mouseenter', '.text2', () => this.text2++);
                }
            }));

            const text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(1);

            vm.$$off('click', '.text1');
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(2);

            vm.$$off('mouseenter', '.text2');
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(vm.text1).to.equal(1);
            expect(vm.text2).to.equal(2);
        });
        it('( type, selector, fn )', () => {
            let sign1 = 0, sign2 = 0;
            const handler1 = () => sign1 ++;
            const handler2 = () => sign2 ++;

            vm = createVue(Object.assign(template, {
                mounted() {
                    this.$$on('click', '.text1', handler1);
                    this.$$on('mouseenter', '.text2', handler2);
                }
            }));

            const text1 = vm.$el.querySelector('.text1'),
                text2 = vm.$el.querySelector('.text2');

            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(sign1).to.equal(1);
            expect(sign2).to.equal(1);

            vm.$$off('click', '.text1', handler2);
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(sign1).to.equal(2);
            expect(sign2).to.equal(2);

            vm.$$off('click', '.text1', handler1);
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(sign1).to.equal(2);
            expect(sign2).to.equal(3);

            vm.$$off('mouseenter', '.text2', handler2);
            triggerEvent(text1, 'click');
            triggerEvent(text2, 'mouseenter');
            expect(sign1).to.equal(2);
            expect(sign2).to.equal(3);
        });
    });
    describe('error test', () => {
        it('type error', () => {
            const template = {
                template: `
                    <div
                        class="outter"
                        v-delegate="['span.text1', handler]">
                        <div class="inner">
                            <span class="text1">第一个文本</span>
                            <span class="text2">第二个文本</span>
                        </div>
                    </div>`,
                methods: {
                    handler() {}
                }
            };

            try {
                vm = createVue(template);
            } catch (err) {
                expect(err.toString()).to.equal('Error: Event type is wrong!');
            }
        });
    });
});
