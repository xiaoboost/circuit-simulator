import { Component, Watch, Vue } from 'vue-property-decorator';
import { MutationName, Mutation, State } from 'src/vuex';

import { Col } from 'ant-design-vue/types/grid/col';
import { AntdComponent } from 'ant-design-vue/types/component';

import * as deco from 'vuex-class';
import * as Form from 'ant-design-vue/types/form/form';

type LayoutOpt = Partial<Pick<Col, Exclude<keyof Col, keyof AntdComponent>>>;

/** 表单输入的布局选项 */
interface FormItemLayout {
    labelCol?: LayoutOpt;
    wrapperCol?: LayoutOpt;
}

/** 表单数据接口 */
interface FormData {
    /** 模拟时长 */
    end: string;
    /** 模拟步长 */
    step: string;
    /** 模拟时长单位 */
    endUnit: '' | 'm' | 'u';
    /** 模拟步长单位 */
    stepUnit: 'm' | 'u' | 'p';
}

/** 表单修饰参数 */
interface FormDecorator {
    // TODO: 等待修复
    [key: string]: (keyof FormData | Form.FieldDecoratorOptions)[];
}

@Component
export default class ConfigPanel extends Vue {
    /** 表单本身 */
    form!: Form.WrappedFormUtils<FormData>;
    // form!: any;
    /** 表单标签的布局 */
    formItemLayout: FormItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    };

    @deco.State('time')
    time!: State['time'];

    @deco.Mutation(MutationName.SET_TIME_CONFIG)
    setTime!: Mutation[MutationName.SET_TIME_CONFIG];

    /** 表单参数 */
    get formDecorator(): FormDecorator {
        return {
            end: ['end', {
                initialValue: '10',
                validateFirst: true,
                rules: [
                    {
                        required: true,
                        message: '模拟时长不能为空',
                    },
                    {
                        pattern: /^\d+$/,
                        message: '只允许输入正整数',
                    },
                ],
            }],
            step: ['step', {
                initialValue: '10',
                validateFirst: true,
                rules: [
                    {
                        required: true,
                        message: '步长时间是必填的',
                    },
                    {
                        pattern: /^\d+$/,
                        message: '只允许输入正整数',
                    },
                ],
            }],
            endUnit: ['endUnit', {
                initialValue: 'm',
            }],
            stepUnit: ['stepUnit', {
                initialValue: 'u',
            }],
        };
    }

    @Watch('time')
    private update() {
        this.form.setFieldsValue({ ...this.time });
    }

    check() {
        return this.form.validateFields().then((values) => {
            this.setTime({
                end: `${values.end}${values.endUnit}`,
                step: `${values.step}${values.stepUnit}`,
            });
        });

        // if (!this.$refs.end.validate() || !this.$refs.step.validate()) {
        //     return false;
        // }

        // if (
        //     this.end !== this.time.end ||
        //     this.step !== this.time.step
        // ) {
        //     this.$store.commit(Mutation.SET_TIME_CONFIG, {
        //         step: this.step,
        //         end: this.end,
        //     });
        // }

        // return true;
    }

    // 生成当前表单作用域
    beforeCreate() {
        this.form = this.$form.createForm(this);
    }
}
