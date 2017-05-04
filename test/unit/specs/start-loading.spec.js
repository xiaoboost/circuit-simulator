import StartLoading from '@/components/start-loading';
import { createTest, destroyVM } from '../util';

describe('start-loading.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('Loading page, it should be showed', () => {
        vm = createTest(StartLoading, { show: true });

        const text = vm.$el.querySelectorAll('h3');
        expect(text.length).to.be.equal(2);
        expect(text[0].textContent).to.be.equal('加载中……');
        expect(text[1].textContent).to.be.equal('绘制草图·模拟');
    });
    it('Page loading finished, it should be closed', (done) => {
        vm = createTest(StartLoading, { show: false }, true);
        // loading界面消失时有 200ms 的动画，所以这里设置等待 300ms
        setTimeout(() => {
            expect(vm.$el.childNodes.length).to.be.equal(0);
            done();
        }, 300);
    });
});
