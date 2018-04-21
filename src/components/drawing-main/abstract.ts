import vuex from 'src/vuex';

import { Vue, Inject } from 'vue-property-decorator';
import { clone, randomString } from 'src/lib/utils';
import Electronics, { PartTypes } from 'src/components/electronic-part/parts';

import { PartCore } from '../electronic-part';
import { LineCore } from '../electronic-line';
import DrawingMain, { MapStatus } from './component';

/** 每类器件的最大数量 */
const maxNumber = 50;

/** 元件数据基类 */
export abstract class ElectronicCore extends Vue {
    /** 元件 ID 编号 */
    id: string;
    /** 元件的连接表 */
    connect: string[];
    /** 当前元件状态 */
    status: string;
    /** 元件类型 */
    readonly type: PartTypes | 'line';
    /** 元件唯一切不变的 hash 编号 */
    readonly hash: string;
    /** 搜索器件数据 */
    readonly findPartCore!: (id: string) => PartCore;
    /** 搜索导线数据 */
    readonly findLineCore!: (id: string) => LineCore;

    /** 图纸相关状态 */
    @Inject()
    readonly mapStatus!: MapStatus;
    /** 设置图纸事件 */
    @Inject()
    readonly setDrawEvent!: DrawingMain['setDrawEvent'];
    /** 搜索器件组件 */
    @Inject()
    readonly findPartComponent!: DrawingMain['findPartComponent'];
    /** 搜索导线组件 */
    @Inject()
    readonly findLineComponent!: DrawingMain['findLineComponent'];

    constructor(type: PartTypes | 'line') {
        super();

        this.type = type;
        this.connect = [];
        this.hash = randomString();
        this.status = 'normal';

        this.id = this.createId(
            type === 'line'
                ? 'line'
                : Electronics[type].pre,
        );
    }

    /**
     * 生成器件或者导线的新 ID
     * @param {string} id
     * @returns {string}
     */
    private createId(id: string): string {
        const electrons = [...vuex.state.Parts, ...vuex.state.Lines];

        const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;
        const max = (pre[1] === 'line') ? Infinity : maxNumber;

        for (let i = 1; i <= max; i++) {
            const ans = `${pre[1]}_${i}`;
            if (electrons.findIndex((elec) => elec.id === ans) === -1) {
                return (ans);
            }
        }

        throw new Error(`(electronic) The maximum number of Devices is ${maxNumber}.`);
    }
}
