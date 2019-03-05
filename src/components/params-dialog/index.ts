import { Component, Vue } from 'vue-property-decorator';
import { SelectList, NumberUnit } from 'src/lib/native';
import Point from 'src/lib/point';

/** 参数接口 */
export interface Params {
    /** 该参数的文字说明 */
    label: string;
    /** 该参数的可选单位 */
    units: SelectList;
    /** 该参数的值 */
    value: string;
    /** 该参数所选的单位 */
    unit: NumberUnit;
}

@Component
export default class ParamsDialog extends Vue {
    /** 编号 */
    id = '';
    /** 标题 */
    title = '';
    /** 是否显示 */
    show = false;
    /** 指向的中心位置 */
    position = new Point(0, 0);
    /** 参数列表 */
    params: Params[] = [];

    /** 用于外部引用的`取消`接口 */
    cancel!: () => void;
    /** 用于外部引用的`确定`接口 */
    confirm!: () => void;

    /** “取消”回调函数 */
    private beforeCancel() {
        // 取消所有状态

        // 运行取消函数
        if (this.cancel) {
            this.cancel();
        }
    }
    /** “确认”回调函数 */
    private beforeConfirm() {
        // 校验内容是否合法

        // 运行确认函数
        if (this.confirm) {
            this.confirm();
        }
    }
}
