interface BaseScaleConfig {
    /** 数据字段的别名 */
    alias?: string;
    /** 格式化文本内容 */
    formatter?: Function;
    /** 设置坐标轴上刻度点的个数 */
    tickCount?: number;
    /**
     * 输出数据的范围
     * 默认 [ 0, 1 ]，格式为 [ min, max ]
     * min 和 max 均为 0 至 1 范围的数据
     */
    range?: [number, number];
    /**
     * 用于指定坐标轴上刻度点的文本信息
     * 当用户设置了 ticks 就会按照 ticks 的个数和文本来显示
     */
    ticks?: any[];
}

interface LinearScaleConfig extends BaseScaleConfig {
    type: 'linear';
    /**
     * 是否自动优化数值范围
     *  - 默认为 true
     */
    nice?: boolean;
    /** 坐标轴的最小值 */
    min?: number;
    /** 坐标轴的最大值 */
    max?: number;
    /**
     * 对数据的最小值的限制
     * 无论数据中是否存在比这个值小的数据，生成的坐标点不会小于这个值
     */
    minLimit?: number;
    /**
     * 对数据的最大值的限制
     * 无论数据中是否存在比这个值大的数据，生成的坐标点不会大于这个值
     */
    maxLimit?: number;
    /**
     * 定义坐标轴刻度线的条数
     *  - 默认为 5
     */
    tickCount?: number;
    /**
     * 用于指定坐标轴各个刻度点的间距，为原始数据值的差值
     * tickCount 和 tickInterval 不可以同时声明
     */
    tickInterval?: number;
}

interface LogScaleConfig extends BaseScaleConfig {
    type: 'log';
    /**
     * log 的基数
     *  - 默认是 2
     */
    base: number;
}

interface PowScaleConfig extends BaseScaleConfig {
    type: 'pow';
    /**
     * 指数
     *  - 默认是 2
     */
    exponent: number;
}

export type ScaleConfig = LinearScaleConfig | LogScaleConfig | PowScaleConfig;
