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
    oscilloscopes: Store.State['oscilloscopes'];
}

/** 生成过滤器件的函数 */
const findPart = (type: PartType) => {
    return ({ parts }: Store.State) => (parts.filter((part) => part.type === type) || []);
};

@Component
export default class ConfigPanel extends Vue {
    /** 全局缓存的时间参数 */
    @State
    time!: Store.State['time'];

    /** 全局缓存的示波器参数 */
    @State
    oscilloscopes!: Store.State['oscilloscopes'];

    /** 所有电流表 */
    @State(findPart(PartType.CurrentMeter))
    currentMeters!: Store.State['parts'];

    /** 所有电压表 */
    @State(findPart(PartType.VoltageMeter))
    voltageMeters!: Store.State['parts'];

    /** 当前时间参数存入 vuex 中 */
    @Mutation(Store.MutationName.SET_TIME_CONFIG)
    setTime!: Store.Mutation[Store.MutationName.SET_TIME_CONFIG];

    /** 保存示波器配置 */
    @Mutation(Store.MutationName.SET_OSCILLOSCOPES)
    setOscilloscopes!: Store.Mutation[Store.MutationName.SET_OSCILLOSCOPES];

    /** 表单数据 */
    data: FormData = {
        end: 10,
        step: 10,
        endRank: 'm',
        stepRank: 'u',
        oscilloscopes: [],
    };

    // 时间单位选择列表
    endTimeUnits = createSelectList(['', 'm', 'u'], '秒', true);
    stepTimeUnits = createSelectList(['m', 'u', 'n', 'p'], '秒', true);

    @Watch('time')
    private updateTime(time: Store.State['time']) {
        const end = splitNumber(time.end);
        const step = splitNumber(time.step);

        this.data.end = +end.number;
        this.data.step = +step.number;
        this.data.endRank = end.rank;
        this.data.stepRank = step.rank;
    }

    @Watch('oscilloscopes')
    private updateOscilloscopes(oscilloscopes: Store.State['oscilloscopes']) {
        this.data.oscilloscopes = oscilloscopes;
    }

    /** 添加示波器 */
    addMeter() {
        this.data.oscilloscopes.push([]);
    }

    /** 移除示波器 */
    removeMeter(i: number) {
        this.data.oscilloscopes.splice(i, 1);
    }

    /** 验证所有设置 */
    validate() {
        // TODO: 验证数据

        const { data } = this;

        this.setTime({
            end: `${data.end}${data.endRank}`,
            step: `${data.step}${data.stepRank}`,
        });

        this.setOscilloscopes(data.oscilloscopes);

        return true;
    }
}
