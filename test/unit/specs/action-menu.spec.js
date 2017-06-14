import Vue from 'vue';
import Router from 'vue-router';
import ActionMenu from '@/components/action-menu';
import { createTest, createVue, destroyVM, triggerEvent } from '../util';

Vue.use(Router);

describe('action-menu.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('create', () => {
        vm = createTest(ActionMenu);
        expect(vm.isRun).to.be.false;

        const button = vm.$el.querySelectorAll('.fab-container');
        expect(button[0].getAttribute('tip')).to.be.equal('时域模拟');
        expect(button[1].getAttribute('tip')).to.be.equal('添加器件');
        expect(button[2].getAttribute('tip')).to.be.equal('运行设置');
    });
    it('click the button of run', (done) => {
        vm = createTest(ActionMenu);
        // 点击运行按钮
        const buttonConfig = vm.$el.querySelector('[tip=时域模拟] .fab');
        triggerEvent(buttonConfig, 'click');
        expect(vm.isRun).to.be.true;

        vm.$nextTick(() => {
            // 其余三个按键被隐藏，进度条按钮显示
            const buttons = vm.$el.querySelectorAll('.fab-container');
            expect(buttons.length).to.equal(4);
            // 进度条文本元素存在
            const text = !!vm.$el.querySelector('#fab-text');
            expect(text).to.be.true;
            done();
        });
    });
    it('switch router to addParts page', (done) => {
        const addText = '虚拟添加器件页面',
            AddParts = createVue({ template: `<div id="add-parts">${addText}</div>` }),
            router = new Router({routes: [{ path: 'add-parts', name: 'AddParts', component: AddParts }]});

        vm = createVue({
            template: `
                <action-menu></action-menu>
            `,
            router,
            components: {
                'action-menu': ActionMenu
            }
        });

        // 点击添加器件按钮
        const buttonAdd = vm.$el.querySelector('[tip=添加器件] .fab');
        triggerEvent(buttonAdd, 'click');
        vm.$nextTick(() => {
            const elm = document.getElementById('add-parts');
            expect(elm.textContent).to.equal(addText);
            done();
        });
    });
    it('switch router to config page', (done) => {
        const configText = '虚拟运行设置页面',
            Config = createVue({ template: `<div id="config">${configText}</div>` }),
            router = new Router({routes: [{ path: 'config', name: 'Config', component: Config }]});

        vm = createVue({
            template: `
                <action-menu></action-menu>
            `,
            router,
            components: {
                'action-menu': ActionMenu
            }
        });

        // 点击运行设置按钮
        const buttonConfig = vm.$el.querySelector('[tip=运行设置] .fab');
        triggerEvent(buttonConfig, 'click');
        vm.$nextTick(() => {
            const elm = document.getElementById('config');
            expect(elm.textContent).to.equal(configText);
            done();
        });
    });
});
