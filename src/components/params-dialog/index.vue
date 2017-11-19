<template>
<transition name="fade" @enter="enter" @leave="leave">
    <section class="wrapper" v-show="vision">
        <div ref="dialog" class="params-dialog">
            <header>参数设置</header>
            <article>
                <section>
                    <label
                        v-text="idLabel"
                        :style="`width: ${maxLabelLength}px`">
                    </label>
                    <v-input
                        ref="id"
                        v-model="id"
                        :pattern="idCheck"
                        :required="true"
                        class="params-input"
                        placeholder="请输入编号">
                    </v-input>
                </section>
                <section v-for="(param, i) in params" :key="i">
                    <label
                        v-text="`${param.label}：`"
                        :style="`width: ${maxLabelLength}px`">
                    </label>
                    <v-input
                        ref="params"
                        v-model="param.value"
                        :pattern="paramsCheck"
                        :required="true"
                        class="params-input"
                        placeholder="请输入参数">
                    </v-input>
                    <span
                        class="unit" v-text="param.unit"
                        :style="`width: ${maxUnitLength}px`">
                    </span>
                </section>
            </article>
            <footer>
                <button class="cancel" @click="beforeCancel">取消</button>
                <button class="comfirm" @click="beforeComfirm">确定</button>
            </footer>
            <i :class="`triangle-down ${location}`"></i>
        </div>
    </section>
</transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Input, { InputVerifiable } from 'src/components/input-verifiable';

import { $P } from 'src/lib/point';
import { Params } from './index';
import * as util from 'src/lib/utils';
import { getScopedName } from 'src/lib/utils';

@Component({
    components: {
        'v-input': Input,
    },
})
export default class ParamsDialog extends Vue {
    /** 指向的器件编号 */
    id: string = '';
    /** 参数列表 */
    params: Params[] = [];
    /** 是否显示 */
    vision = false;
    /** 指向的器件坐标 */
    position = $P();
    /** ID 的说明文本 */
    idLabel = '编号：';
    /** 是否初始化完成标志 */
    isMounted = false;

    /** 编号的验证正则 */
    readonly idCheck = /[a-zA-Z]+_[a-zA-Z0-9]+/;
    /** 参数的验证正则 */
    readonly paramsCheck = Number.SCIMatch;

    /** 子组件定义 */
    $refs: {
        dialog: HTMLElement;
        id: InputVerifiable;
        params: InputVerifiable[];
    };

    mounted() {
        // 初始化完成标记置高
        this.isMounted = true;
    }

    /** 最长参数名称的长度 */
    get maxLabelLength(): number {
        if (!this.isMounted) {
            return 0;
        }

        const labels = this.params.map((param) => param.label + '：').concat([this.idLabel]);
        const dom = document.createElement('label');

        dom.setAttribute(getScopedName(this.$el), '');

        return Math.max(...this.getDomWidth(dom, labels));
    }
    /** 最长参数单位的长度 */
    get maxUnitLength(): number {
        if (!this.isMounted) {
            return 0;
        }

        const labels = this.params.map((param) => param.unit);
        const dom = document.createElement('span');

        dom.setAttribute('class', 'unit');
        dom.setAttribute(getScopedName(this.$el), '');

        return Math.max(...this.getDomWidth(dom, labels));
    }
    /** 对话框方位 */
    get location(): string {
        const direction: string[] = [];
        // 对话框当前大小
        const { height, width } = this.boxSize;
        // 屏幕当前大小
        const { scrollHeight: SHeight, scrollWidth: SWidth } = document.body;

        // Y 轴默认是上方
        direction.push((this.position[1] < (height + 10) ? 'bottom' : 'top'));
        // X 轴只有左右距离不足时才会确定方位
        if (this.position[0] < (width / 2 + 10)) {
            direction.push('right');
        }
        else if ((SWidth - this.position[0]) < (width / 2 + 10)) {
            direction.push('left');
        }

        return direction.join('-');
    }
    /** 对话框宽高 */
    get boxSize(): { height: number; width: number; } {
        const sections = this.params.length;

        const height = (
            36 +    // header height
            5 +     // body top margin
            (sections + 1) * 24 + sections * 5 +  // body height
            24 +    // footer height
            13      // fotter margin
        );
        const width = (
            100 +   // width of input
            20 +    // padding of body
            6 +     // unit's left margin
            this.maxLabelLength +
            this.maxUnitLength
        );

        return { width, height };
    }

    /** 以输入的 dom 为容器，计算所有 labels 的长度 */
    getDomWidth(dom: HTMLElement, labels: string[]): number[] {
        const section = this.$el.querySelector('article section');

        if (!section) {
            return [0];
        }

        // 保存当前 style
        const elStyle = { ...this.$el.style };
        const dislogStyle = { ...this.$refs.dialog.style };

        this.$el.style.display = 'block';
        this.$refs.dialog.style.transition = '';
        this.$refs.dialog.style.transform = 'scale(1)';

        section.appendChild(dom);

        const widths = labels.map((label) => {
            dom.textContent = label;
            return dom.getBoundingClientRect().width;
        });

        dom.remove();
        Object.assign(this.$el.style, elStyle);
        Object.assign(this.$refs.dialog.style, dislogStyle);

        return widths;
    }
    /** 根据对话框的缩放比例，设置对话框偏移量 */
    setBoxBias(scale: number): void {
        const min = 10, { height, width } = this.boxSize;

        // TODO: 这里只是 top 时候的计算规则
        const left = - width / 2;
        const top = - (height + min) / 2 * (1 + scale);

        this.$refs.dialog.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    }

    async enter(el: HTMLElement, done: () => void) {
        this.$refs.dialog.style.left = `${this.position[0]}px`;
        this.$refs.dialog.style.top = `${this.position[1]}px`;

        this.setBoxBias(0.2);
        await util.delay(0);

        this.setBoxBias(1);
        await util.delay(300);

        done();
    }
    async leave(el: HTMLElement, done: () => void) {
        this.setBoxBias(1);
        await util.delay(0);

        this.setBoxBias(0.2);
        await util.delay(300);

        done();
    }

    cancel: () => void;
    comfirm: () => void;
    beforeCancel() {
        this.cancel();
    }
    beforeComfirm() {
        if (
            this.$refs.id.check() &&
            this.$refs.params.every((comp) => comp.check())
        ) {
            this.comfirm();
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

radius = 4px;

.wrapper
    position fixed
    top 0
    left 0
    height 100%
    width 100%
    z-index 100
    overflow auto
    background-color rgba(0, 0, 0, .2)

.params-dialog
    position relative
    background White
    border-radius radius
    box-shadow 0 1px 3px rgba(0, 0, 0, .4)
    user-select none
    display inline-block
    transition transform .3s cubic-bezier(.3,.3,.1,1)

header
    font-size 20px
    height 36px
    color White
    text-align center
    line-height 36px
    background-color Blue
    font-family font-serif
    border-top-left-radius: radius
    border-top-right-radius: radius

article
    padding 0 10px

    section
        font-family: font-default
        font-size: 16px;
        position: relative
        margin: 5px 0
        display flex

    label
        display inline-block;
        font-size: 16px;
        height: 24px;
        line-height: 24px;

    .params-input
        width: 100px
        font-size: 1rem;
        display: inline-block
        position relative
        top: 4px
    
    .unit
        font-size: 18px;
        margin-left: 6px
        display: inline-block
        font-family: font-text
        position relative
        top: 2px

footer
    text-align: right;
    margin: 8px 5px 5px 5px;

    button
        font-size: 14px
        background-color transparent
        margin-left: 5px
        padding: 0 5px
        outline: none
        border none
        height: 24px;
        line-height: 24px;

        &:focus
            border: none
            outline: none
        &.comfirm
            color: Blue
        &.cancel
            color: Yellow
</style>
