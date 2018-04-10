<template>
<transition name="fade" @enter="enter" @leave="leave">
    <section class="wrapper" v-show="vision">
        <div
            ref="dialog"
            class="params-dialog"
            :style="{
                left: `${position[0]}px`,
                top: `${position[1]}px`,
                transform: `translate(${bias[0]}px, ${bias[1]}px) scale(${scale})`,
            }">
            <header>参数设置</header>
            <article>
                <section class="params__label">
                    <label v-text="idLabel"></label>
                    <label
                        v-for="(param, i) in params"
                        :key="i" v-text="`${param.label}：`">
                    </label>
                </section>
                <section class="params__input">
                    <v-input
                        ref="id"
                        v-model="id"
                        :rules="idRules"
                        placeholder="请输入编号">
                    </v-input>
                    <v-input
                        ref="params"
                        v-for="(param, i) in params"
                        v-model="param.value"
                        :key="i" :rules="paramsRules"
                        placeholder="请输入参数">
                    </v-input>
                </section>
                <section class="params__unit">
                    <span>&nbsp;</span>
                    <span
                        v-for="(param, i) in params"
                        :key="i" v-text="`${param.unit}`">
                    </span>
                </section>
            </article>
            <footer>
                <button class="cancel" @click="beforeCancel">取消</button>
                <button class="confirm" @click="beforeConfirm">确定</button>
            </footer>
            <i class="triangle-icon" :style="triangleStyle"></i>
        </div>
    </section>
</transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import InputVerifiable, { ValidateRule } from 'src/components/input-verifiable';

import vuex from 'src/vuex';
import { $P } from 'src/lib/point';
import { delay } from 'src/lib/utils';
import { Params, ComponentInterface } from './types';
import * as assert from 'src/lib/assertion';

const passive = supportsPassive ? { passive: true } : false;

@Component({
    components: {
        'v-input': InputVerifiable,
    },
})
export default class ParamsDialog extends Vue implements ComponentInterface {
    /** 指向的器件编号 */
    id: string = '';
    /** 参数列表 */
    params: Params[] = [];
    /** 是否显示 */
    vision = false;
    /** ID 的说明文本 */
    idLabel = '编号：';
    /** 是否初始化完成标志 */
    isMounted = false;

    /** 指向的器件坐标 */
    position = $P();
    /** 对话框偏移量 */
    bias = $P();
    /** 对话框缩放比例 */
    scale = 1;

    /** 中心最小限制 */
    min = 10;

    /** ID 编号验证规则 */
    idRules: ValidateRule[] = [
        {
            required: true,
            message: 'ID 标签不能为空',
        },
        {
            pattern: /[a-zA-Z]+_[a-zA-Z0-9]+/,
            message: 'ID 标签格式错误',
        },
    ];

    /** 参数验证规则 */
    paramsRules: ValidateRule[] = [
        {
            required: true,
            message: '该项不能为空',
        },
        {
            pattern: Number.SCIENTIFIC_COUNT_MATCH,
            message: '参数值格式错误',
        },
    ];

    /** 子组件定义 */
    $refs: {
        id: InputVerifiable;
        params: InputVerifiable[];
        dialog: HTMLElement;
    };

    mounted() {
        // 初始化完成标记置高
        this.isMounted = true;
    }

    @Watch('vision')
    visionHandler(status: boolean) {
        if (status) {
            document.body.addEventListener('keyup', this.keyboardHandler, passive);
            this.$nextTick(() => this.$refs.id.focus());
        }
        else {
            document.body.removeEventListener('keyup', this.keyboardHandler);
        }
    }

    /** 对话框方位 */
    get location(): string[] {
        const direction: string[] = [];
        const min = this.min;
        // 对话框当前大小
        const { height, width } = this.boxSize;
        // 屏幕当前大小
        const { scrollHeight: SHeight, scrollWidth: SWidth } = document.body;
        // 侧边栏宽度
        const aside = vuex.getters.isSpace ? 0 : 380

        // Y 轴方位
        if (this.position[1] < (height + min)) {
            direction.push('bottom');
        }
        else if ((SHeight - this.position[1]) < (height + min)) {
            direction.push('top');
        }

        // X 轴方位
        if (this.position[0] < (width / 2 + min)) {
            direction.push('right');
        }
        else if ((SWidth - this.position[0] - aside) < (width / 2 + min)) {
            direction.push('left');
        }

        // 默认在上方
        if (direction.length === 0) {
            direction.push('top');
        }

        return direction;
    }
    /** 对话框宽高 */
    get boxSize() {
        if (!this.isMounted) {
            return { width: 0, height: 0 };
        }

        // 保存当前样式
        const elStyle = {
            display: this.$el.style.display,
        };
        const dislogStyle = {
            opacity: this.$refs.dialog.style.opacity,
            transition: this.$refs.dialog.style.transition,
            transform: this.$refs.dialog.style.transform,
        };

        this.$el.style.display = 'block';
        this.$refs.dialog.style.opacity = '0';
        this.$refs.dialog.style.transition = '';
        this.$refs.dialog.style.transform = 'scale(1)';

        const len = this.params.length;

        const labelWidth = this.getMaxWidth(
            this.$el.querySelector('.params__label label')!,
            this.params.map((param) => (param.label + '：')).concat([this.idLabel]),
        );
        const unitWidth = this.getMaxWidth(
            this.$el.querySelector('.params__unit span')!,
            this.params.map((param) => param.unit),
        );

        const height = (
            36 +    // header height
            6 +     // header bottom margin
            (len + 1) * 24 + len * 2 +  // body height
            24 +    // footer height
            12 +    // fotter margin
            2       // extra
        );
        const width = (
            100 +   // width of input
            20 +    // padding of body
            6 +     // unit's left margin
            labelWidth +
            unitWidth
        );

        Object.assign(this.$el.style, elStyle);
        Object.assign(this.$refs.dialog.style, dislogStyle);

        return { width, height };
    }
    /** 计算倒三角形状 */
    get triangleStyle(): { [x: string]: string } {
        const len = this.location.length;
        const deg = { bottom: 0, left: 90, top: 180, right: 270 };

        const base = {
            'border-bottom': `${10 * len}px solid ${this.location.includes('bottom') ? '#20A0FF' : '#FFFFFF'}`,
            'border-left': `${6 * len}px solid transparent`,
            'border-right': `${6 * len}px solid transparent`,
            'transform': '',
            'left': '',
            'top': '',
        };

        // 旋转角度
        const avg = this.location.reduce((add, di) => add + deg[di], 0) / len;
        base.transform = this.location.isEqual(['bottom', 'right'])
            ? 'rotate(315deg)'
            : `rotate(${avg}deg)`;

        // 坐标
        if (len === 1) {
            if (/(top|bottom)/.test(this.location[0])) {
                base.left = 'calc(50% - 6px)';
                base.top = (this.location[0] === 'top') ? 'calc(100% - 1px)' : '-10px';
            }
            else {
                base.left = (this.location[0] === 'left') ? 'calc(100% - 1px)' : '-10px';
                base.top = 'calc(50% - 6px)';
            }
        }
        else {
            base.top = (this.location[0] === 'top') ? 'calc(100% - 11px)' : '-9px';
            base.left = (this.location[1] === 'toleftp') ? 'calc(100% - 13px)' : '-10px';
        }

        return base;
    }

    keyboardHandler(event: KeyboardEvent) {
        if (!this.vision) {
            return;
        }

        if (event.key === 'Escape') {
            this.beforeCancel();
        }
        else if (event.key === 'Enter') {
            this.beforeConfirm();
        }
    }

    /** 计算待选文字中最大的长度 */
    getMaxWidth(dom: Element, texts: string[]): number {
        const originText = dom.textContent;
        const widths = texts.map((text) => {
            dom.textContent = text;
            return dom.getBoundingClientRect().width;
        });

        dom.textContent = originText;

        return Math.max(...widths);
    }
    /** 根据对话框的缩放比例，设置对话框偏移量 */
    setBoxStyle(scale: number): void {
        const min = 20, { height, width } = this.boxSize;

        // 设置缩放比例
        this.scale = scale;

        // X 轴计算
        if (this.location.includes('left')) {
            this.bias[0] = - width * (1 + scale) / 2 - min;
        }
        else if (this.location.includes('right')) {
            this.bias[0] = - width * (1 - scale) / 2 + min;
        }
        else {
            this.bias[0] = - width / 2;
        }

        // Y 轴计算
        if (this.location.includes('top')) {
            this.bias[1] = - height * (1 + scale) / 2 - min;
        }
        else if (this.location.includes('bottom')) {
            this.bias[1] = - height * (1 - scale) / 2 + min;
        }
        else {
            this.bias[1] = - height / 2;
        }
    }

    async enter(el: HTMLElement, done: () => void) {
        this.setBoxStyle(0.2);
        await delay(0);

        this.setBoxStyle(1);
        await delay(300);

        done();
    }
    async leave(el: HTMLElement, done: () => void) {
        this.setBoxStyle(1);
        await delay(0);

        this.setBoxStyle(0.2);
        await delay(300);

        done();
    }

    cancel: () => void;
    confirm: () => void;
    beforeCancel() {
        // 清除所有错误提示
        this.$refs.id.clearError();
        this.$refs.params && this.$refs.params.forEach((input) => input.clearError());

        // 运行取消
        this.cancel();
    }
    beforeConfirm() {
        if (
            this.$refs.id.validate() &&
            this.$refs.params.every((comp) => comp.validate())
        ) {
            this.confirm();
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
    margin-bottom 6px
    background-color Blue
    font-family font-serif
    border-top-left-radius: radius
    border-top-right-radius: radius

article
    padding 0 10px
    display flex
    line-height 24px
    
    > section
        flex-grow 0
        flex-shrink 0
        display inline-flex
        flex-direction column

        > *
            height 24px
            margin-bottom 2px
            line-height inherit
    
    .params__label
        font-size 16px
        font-family font-default
        align-items flex-start
    .params__input
        width 100px
        font-family font-default
        /deep/ .input-bar:before
            bottom 1px

    .params__unit
        font-size 18px
        margin-left 6px
        font-family font-text
        align-items flex-start
        position relative
        top 2px

footer
    text-align: right;
    margin: 6px;

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
        &.confirm
            color: Blue
        &.cancel
            color: Yellow

// TODO: 三角阴影
.triangle-icon
    display: inline;
    position: absolute;
    width: 0;
    height: 0;
</style>
