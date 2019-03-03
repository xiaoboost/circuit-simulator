import { Component, Watch, Vue } from 'vue-property-decorator';

import * as Store from 'src/vuex';
import { State, Mutation } from 'vuex-class';
import { PartType } from 'src/components/electronic-part/parts';

/** 表单数据接口 */
interface FormData {
    /** 模拟时长 */
    end: number;
    /** 模拟步长 */
    step: number;
    /** 模拟时长单位 */
    endUnit: '' | 'm' | 'u';
    /** 模拟步长单位 */
    stepUnit: 'm' | 'u' | 'p';

    /** 示波器设置 */
    charts: Store.State['charts'];
}

/** 生成过滤器件的函数 */
const findPart = (type: PartType) => {
    return ({ parts }: Store.State) => (parts.filter((part) => part.type === type) || []);
};

@Component
export default class ConfigPanel extends Vue {
    /** vuex 种储存的时间参数 */
    @State('time')
    time!: Store.State['time'];

    /** 所有电流表 */
    @State(findPart(PartType.CurrentMeter))
    currentMeters!: Store.State['parts'];

    /** 所有电压表 */
    @State(findPart(PartType.VoltageMeter))
    voltageMeters!: Store.State['parts'];

    /** 当前时间参数存入 vuex 中 */
    @Mutation(Store.MutationName.SET_TIME_CONFIG)
    setTime!: Store.Mutation[Store.MutationName.SET_TIME_CONFIG];

    /** 表单数据 */
    data: FormData = {
        end: 10,
        step: 10,
        endUnit: 'm',
        stepUnit: 'u',
        charts: [],
    };

    /** 时间单位单选列表 */
    timeUnits = [
        {
            label: '秒',
            value: '',
        },
        {
            label: '毫秒',
            value: 'm',
        },
        {
            label: '微秒',
            value: 'u',
        },
        {
            label: '皮秒',
            value: 'p',
        },
    ];

    /** 示波器类型选项列表 */
    chartTypes = [
        {
            label: '电压表',
            value: Store.ChartType.Voltage,
        },
        {
            label: '电流表',
            value: Store.ChartType.Current,
        },
    ];

    @Watch('time')
    private update() {
        const getNumber = (str: string) => {
            const matcher = /^(\d+)([mup]?)$/;
            const match = matcher.exec(str);

            if (!match) {
                throw new Error(`Time Error: ${str}`);
            }

            return {
                number: +match[1],
                unit: match[2] || '',
            };
        };

        const end = getNumber(this.time.end);
        const step = getNumber(this.time.step);

        this.data.end = end.number;
        this.data.step = step.number;
        this.data.endUnit = end.unit as FormData['endUnit'];
        this.data.stepUnit = step.unit as FormData['stepUnit'];
    }

    /** 添加示波器 */
    addMeter() {
        this.data.charts.push({
            type: Store.ChartType.Voltage,
            meters: [],
        });
    }

    /** 移除示波器 */
    removeMeter(i: number) {
        this.data.charts.splice(i, 1);
    }

    /** 验证所有设置 */
    validate() {
        // ..
    }
}
