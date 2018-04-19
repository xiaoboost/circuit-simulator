import vuex from 'src/vuex';

import { Vue, Inject } from 'vue-property-decorator';
import { clone, randomString } from 'src/lib/utils';
import Electronics from 'src/components/electronic-part/parts';

import { PartCore } from '../electronic-part';
import DrawingMain, { MapStatus } from './component';
// import { LineCore } from '../electronic-line';

/** 每类器件的最大数量 */
const maxNumber = 50;

export abstract class ElectronicCore extends Vue {
    /** 元件 ID 编号 */
    id: string;
    /** 元件的连接表 */
    connect: string[];
    /** 元件类型 */
    readonly type: keyof Electronics | 'line';
    /** 元件唯一切不变的 hash 编号 */
    readonly hash: string;

    /** 图纸相关状态 */
    @Inject()
    readonly mapStatus!: MapStatus;
    /** 设置图纸事件 */
    @Inject()
    readonly setDrawEvent!: DrawingMain['setDrawEvent'];
    /** 搜索器件 */
    @Inject()
    readonly findPartComponent!: DrawingMain['findPartComponent'];
    // /** 搜索导线 */
    // @Inject()
    // readonly findLineComponent!: FindLineComponent;

    constructor(type: keyof Electronics | 'line') {
        super();

        this.type = type;
        this.hash = randomString();
        this.connect = [];

        this.id = this.createId(
            type === 'line'
                ? 'line'
                : Electronics[type].pre,
        );
    }

    /**
     * 寻找器件数据
     * @param {id} string
     * @return {PartCore}
     */
    findPartCore(id: string): PartCore {
        const idMatch = (id.match(/[a-zA-Z]+_[a-zA-Z0-9]+/)!)[0];
        const result = this.$store.state.Parts.find((part: PartCore) => part.id === idMatch);

        if (!result) {
            throw new Error(`Can not find this part: ${id}`);
        }

        return clone(result);
    }

    /**
     * 寻找导线数据
     * @param {id} string
     * @return {LineCore}
     */
    // findLineCore(id: string): LineCore {
    //     const result = this.$store.state.Lines.find((line: LineCore) => line.id === id);

    //     if (!result) {
    //         throw new Error(`Can not find this line: ${id}`);
    //     }

    //     return clone(result);
    // }

    /**
     * 生成器件或者导线的新 ID
     * @param {string} id
     * @returns {string}
     */
    private createId(id: string): string {
        const electrons = vuex.state.Parts;

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
