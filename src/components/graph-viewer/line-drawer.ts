import G2 from '@antv/g2/lib/core';

import '@antv/g2/lib/geom/line';
import '@antv/g2/lib/component/legend';
import '@antv/g2/lib/component/tooltip';

import { CreateElement } from 'vue';
import { State, Getter } from 'vuex-class';
import { State as StateTree, Getter as GetterTree } from 'src/vuex';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { PartType } from 'src/components/electronic-part';

import { ScaleConfig } from './type';
import { toScientific } from 'src/lib/number';

/** 曲线类型 */
enum ChartType {
    voltage = PartType.VoltageMeter,
    current = PartType.CurrentMeter,
}

/** 数字格式化函数 */
const formatter = (unit: string) => (num: number) => `${toScientific(num)}${unit}`;

@Component
export default class Chart extends Vue {
    /** 图表类实例 */
    chart!: G2.Chart;

    /** 当前图表编号 */
    @Prop({ type: String, default: '' })
    id!: string;

    /** 当前图表编号 */
    @Prop({ type: Boolean, default: false })
    halfHeight!: boolean;

    /** 当前图表中的曲线编号 */
    @Prop({ type: Array, default: () => [] })
    meters!: string[];

    /** 仪表数据 */
    @State('solverResult')
    result!: StateTree['solverResult'];

    /** 器件数据 */
    @Getter
    findPartById!: GetterTree['findPartById'];

    /** 是否含有电压曲线 */
    get hasVoltage() {
        return this.meters.some((id) => this.findPartById(id).type === PartType.VoltageMeter);
    }
    /** 是否含有电流曲线 */
    get hasCurrent() {
        return this.meters.some((id) => this.findPartById(id).type === PartType.CurrentMeter);
    }
    /** 曲线数据源 */
    get sourceData() {
        /** 仿真结果数据 */
        const { times, meters } = this.result;
        /** 所有波形数据 */
        const metersData = this.meters.map((name) => {
            const meter = meters.find(({ id }) => id === name)!;
            const part = this.findPartById(name);
            const prop = ChartType[part.type];

            return times.map((_time, index) => ({
                _time,
                name,
                [prop]: meter.data[index],
            }));
        });

        return metersData.reduce((ans, data) => ans.concat(data), []);
    }
    /** 数据列配置 */
    get scaleConfig() {
        const option: AnyObject<ScaleConfig> = {};

        option._time = {
            type: 'linear',
            alias: '时间（单位：秒）',
            min: 0,
            max: this.result.times.get(-1),
            tickCount: 11,
            formatter: formatter('s'),
        };

        if (this.hasVoltage) {
            option[ChartType[PartType.VoltageMeter]] = {
                alias: '电压（单位：伏特）',
                type: 'linear',
                formatter: formatter('V'),
            };
        }

        if (this.hasCurrent) {
            option[ChartType[PartType.CurrentMeter]] = {
                alias: '电流（单位：安培）',
                type: 'linear',
                formatter: formatter('A'),
            };
        }

        return option;
    }
    /** 坐标轴配置 */
    get axiosConfig() {
        type AxisConfig = G2.ChartAxisConfig;
        const option: [string, AxisConfig][] = [];
        const grid: AxisConfig['grid'] = {
            type: 'line',
            lineStyle: {
                fill: '#efefef',
                lineDash: [3, 4],
            },
        };
        const label: AxisConfig['label'] = {
            textStyle: {
                fill: '#888',
            },
        };
        const title: AxisConfig['title'] = {
            position: 'center',
            offset: 50,
            textStyle: {
                fill: '#444',
            },
        };

        option.push(['_time', {
            grid,
            label,
            title: {
                ...title,
                offset: 34,
            },
        }]);

        if (this.hasCurrent) {
            option.push([ChartType[PartType.CurrentMeter], {
                grid,
                label,
                title,
            }]);
        }

        if (this.hasVoltage) {
            option.push([ChartType[PartType.VoltageMeter], {
                grid,
                label,
                title,
            }]);
        }

        return option;
    }

    /** 设置波形视图 */
    setChart() {
        this.chart.source(this.sourceData, this.scaleConfig);
        this.axiosConfig.forEach((config) => this.chart.axis(...config));

        this.chart.tooltip({
            crosshairs: {
                type: 'line',
            },
        });

        this.chart.legend('name', {
            position: 'top',
        });

        if (this.hasVoltage) {
            this.chart.line().position('_time*voltage').color('name');
        }

        if (this.hasCurrent) {
            this.chart.line().position('_time*current').color('name');
        }
    }

    mounted() {
        const height = this.halfHeight ? window.innerHeight / 2 : window.innerHeight;
        const right = (this.hasVoltage && this.hasCurrent) ? 80 : 30;

        this.chart = new G2.Chart({
            height,
            forceFit: true,
            container: this.id,
            padding: [50, right, 50, 80],
        });

        this.setChart();
        this.chart.render();
    }

    render(h: CreateElement) {
        const divAttrs = {
            attrs: {
                id: this.id,
            },
        };

        return h('div', divAttrs);
    }
}
