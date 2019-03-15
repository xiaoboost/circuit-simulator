import { Component, Watch, Vue } from 'vue-property-decorator';

import * as Store from 'src/vuex';
import { State, Mutation } from 'vuex-class';
import { PartType } from 'src/components/electronic-part';
import { createSelectList, NumberRank, splitNumber } from 'src/lib/number';

/** 表单数据接口 */
interface FormData {
    /** 模拟时长 */
    end: number;
    /** 模拟步长 */
    step: number;
    /** 模拟时长单位 */
    endRank: NumberRank;
    /** 模拟步长单位 */
    stepRank: NumberRank;

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
        endRank: 'm',
        stepRank: 'u',
        charts: [],
    };

    // 时间单位选择列表
    endTimeUnits = createSelectList(['', 'm', 'u'], '秒', true);
    stepTimeUnits = createSelectList(['m', 'u', 'n', 'p'], '秒', true);

    @Watch('time')
    private update() {
        const end = splitNumber(this.time.end);
        const step = splitNumber(this.time.step);

        this.data.end = +end.number;
        this.data.step = +step.number;
        this.data.endRank = end.rank;
        this.data.stepRank = step.rank;
    }

    /** 添加示波器 */
    addMeter() {
        this.data.charts.push([]);
    }

    /** 移除示波器 */
    removeMeter(i: number) {
        this.data.charts.splice(i, 1);
    }

    /** 验证所有设置 */
    validate() {
        return true;
    }
}
