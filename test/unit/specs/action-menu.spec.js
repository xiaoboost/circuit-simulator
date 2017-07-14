import store  from '@/vuex';
import ActionMenu from '@/components/action-menu';
import { createTest, createVue, destroyVM, triggerEvent } from '../util';

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
    it('switch aside', () => {
        vm = createVue({
            template: `
                <action-menu></action-menu>
            `,
            store,
            components: {
                'action-menu': ActionMenu,
            },
        });

        // 点击添加器件按钮
        const buttonAdd = vm.$el.querySelector('[tip=添加器件] .fab');
        triggerEvent(buttonAdd, 'click');
        expect(vm.$store.state.page).to.be.equal('add-parts');
        // 点击运行设置按钮
        const buttonConfig = vm.$el.querySelector('[tip=运行设置] .fab');
        triggerEvent(buttonConfig, 'click');
        expect(vm.$store.state.page).to.be.equal('main-config');
    });
});
