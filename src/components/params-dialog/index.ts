import { Component, Vue, Watch } from 'vue-property-decorator';
import { SelectList, NumberRank } from 'src/lib/number';
import { isUndef } from 'src/lib/utils';
import { UnitType } from '../electronic-part';

import Point from 'src/lib/point';
import Collapse from '../transitions/collapse';

/** 参数接口 */
export interface Params {
    /** 该参数的文字说明 */
    label: string;
    /** 该参数的可选单位 */
    units: SelectList;
    /** 该参数的单位 */
    unit: UnitType;
    /** 该参数的值 */
    value: string;
    /** 该参数所选的单位 */
    rank: NumberRank;
}

/** 关闭当前正打开的参数对话框 */
export let cancelDialog = () => {};

@Component({
    components: {
        Collapse,
    },
})
export default class ParamsDialog extends Vue {
    /** 前缀 */
    preId = '';
    /** 标签 */
    id = '';
    /** 标题 */
    title = '';
    /** 指向的中心位置 */
    position = new Point(0, 0);
    /** 参数列表 */
    params: Params[] = [];

    // 状态量
    /** 是否显示 */
    show = false;
    /** id 输入是否有错误 */
    idErrMsg = '';
    /** 参数输入是否有错误 */
    paramErrMsgs: string[] = [];

    /** 用于外部引用的`取消`接口 */
    cancel!: () => void;
    /** 用于外部引用的`确定`接口 */
    confirm!: () => void;

    $el!: HTMLElement;

    /** 输入参数是否有错误 */
    get hasError() {
        return Boolean(this.idErrMsg) || this.paramErrMsgs.some(Boolean);
    }

    @Watch('show')
    visibleChange(val: this['show']) {
        // 显示对话框时，导出关闭对话框的方法
        if (val) {
            cancelDialog = () => this.beforeCancel();
        }
        // 关闭后清空函数
        else {
            this.$nextTick(() => cancelDialog = () => {});
        }
    }

    /** TODO: 计算参数单位的最大宽度 */
    unitWidth(units: string[]) {
        // + 42
        return `62px`;
    }

    /** 校验编号 */
    validateId() {
        this.idErrMsg = '';

        if (!this.preId || !this.id) {
            this.idErrMsg = '器件编号不能为空';
            return;
        }

        if (!/^[A-Z]+$/.test(this.preId) || !/^[a-z0-9]+$/.test(this.id)) {
            this.idErrMsg = '器件编号格式错误';
            return;
        }
    }

    /** 校验输入参数 */
    validateParam(index?: number) {
        if (isUndef(index)) {
            this.params.forEach((_, i) => this.validateParam(i));
            return;
        }

        const { value } = this.params[index];

        this.paramErrMsgs.$set(index, '');

        if (!value) {
            this.paramErrMsgs.$set(index, '参数值不能为空');
            return;
        }

        const num = Number(value);

        if (Number.isNaN(num) || num <= 0) {
            this.paramErrMsgs.$set(index, '请输入大于零的合法数字');
            return;
        }
    }

    /** 校验输入内容 */
    validate() {
        this.validateId();
        this.validateParam();
    }

    /** 清除所有错误提示 */
    clear() {
        this.idErrMsg = '';
        this.paramErrMsgs = [];
    }

    /** “取消”回调函数 */
    private beforeCancel() {
        // 运行取消函数
        if (this.cancel) {
            this.cancel();
        }

        // 取消所有状态
        this.$nextTick(() => this.clear());
    }
    /** “确认”回调函数 */
    private beforeConfirm() {
        // 校验内容
        this.validate();

        // 运行确认函数
        if (!this.hasError && this.confirm) {
            this.confirm();
        }
    }
}
