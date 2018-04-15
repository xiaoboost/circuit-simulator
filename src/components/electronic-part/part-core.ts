import { Vue, Prop } from 'vue-property-decorator';
import { $M, Matrix } from 'src/lib/matrix';
import { clone, randomString } from 'src/lib/utils';
import { $P, Point, PointLike } from 'src/lib/point';
import { createId, findPartCore } from 'src/components/drawing-main';
import * as schMap from 'src/lib/map';

import Electronics, {
    PartTypes,
    ElectronicPrototype,
} from './parts';

/** 兼容 PointLike 类型的点乘矩阵 */
const product = (point: PointLike, ma: Matrix): Point => {
    return Point.prototype.rotate.call(point, ma);
};

/** 器件数据核心类 */
export class PartCore extends Vue {
    /** 器件 ID 编号 */
    id: string;
    /** 器件当前旋转矩阵 */
    rotate: Matrix;
    /** 器件当前位置 */
    position: Point;
    /** 器件类型 */
    readonly type: PartTypes;
    /** 器件唯一切不变的 hash 编号 */
    readonly hash: string;
    /** 当前器件的内部参数 */
    readonly params: string[];
    /** 当前器件的连接表 */
    readonly connect: string[];
    /** 当前器件数据原型 */
    readonly origin: ElectronicPrototype;

    /** 器件原始数据 */
    @Prop({ type: Object, default: () => ({}) })
    protected readonly value!: PartCore;

    constructor() {
        super();

        debugger;
        const origin = clone(Electronics[this.value.type]);

        this.type = this.value.type;
        this.origin = origin;
        this.id = createId(origin.pre);
        this.hash = randomString();
        this.rotate = $M(2, 'E');
        this.position = $P(1e6, 1e6);
        this.params = origin.params.map((n) => n.default);
        this.connect = Array(origin.points.length).fill('');
    }

    /** 当前引脚状态 */
    get points() {
        return this.origin.points.map((point, i) => ({
            position: product(point.position, this.rotate),
            direction: product(point.direction, this.rotate),
            class: this.connect[i] ? 'part-point-close' : 'part-point-open',
        }));
    }
    /** 当前器件范围 */
    get margin() {
        const types = ['margin', 'padding'];
        const outter = [[0, 0], [0, 0]];
        const box = {
            margin: [[0, 0], [0, 0]],
            padding: [[0, 0], [0, 0]],
        };

        for (let i = 0; i < 2; i++) {
            const type = types[i],
                boxSize = this.origin[type] as [number, number, number, number],
                endpoint = [[- boxSize[3], - boxSize[0]], [boxSize[1], boxSize[2]]],
                data = endpoint.map((point) => product(point, this.rotate));

            box[type] = [
                [
                    Math.min(data[0][0], data[1][0]),
                    Math.min(data[0][1], data[1][1]),
                ],
                [
                    Math.max(data[0][0], data[1][0]),
                    Math.max(data[0][1], data[1][1]),
                ],
            ];
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                outter[i][j] = box.margin[i][j] + box.padding[i][j];
            }
        }

        return {
            outter,
            inner: box.padding,
        };
    }

    /** 将数据更新至 vuex */
    dispatch() {
        const keys = ['id', 'type', 'hash', 'params', 'rotate', 'connect', 'position'];
        this.$store.commit(
            'UPDATE_PART',
            clone(keys.reduce((v, k) => ((v[k] = this[k]), v), {})),
        );
    }

    /** 在图纸标记当前器件 */
    markSign() {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 器件内边距占位
        position.everyRect(inner, (node) => schMap.setPoint({
            point: $P(node),
            id: this.id,
            type: 'part',
        }) || true);

        // 器件管脚距占位
        this.points.forEach((point, i) => schMap.setPoint({
            point: point.position.floorToSmall().add(position),
            connect: [],
            type: 'part-point',
            id: `${this.id}-${i}`,
        }));
    }
    /** 删除当前器件在图纸中的标记 */
    deleteSign() {
        const inner = this.margin.inner;
        const position = this.position.floorToSmall();

        // 删除器件内边距占位
        position.everyRect(inner, (node) => schMap.deletePoint(node));
        // 删除器件引脚占位
        this.points.forEach((point) => schMap.deletePoint(point.position.floorToSmall().add(position)));
    }

    /** 当前位置是否被占用 */
    isCover(location: Point = this.position) {
        const coverHash = {}, margin = this.margin;

        let label = false;
        const position = $P(location).floorToSmall();

        // 检查器件管脚，管脚点不允许存在任何元素
        for (const point of this.points) {
            const node = position.add(point.position.floorToSmall());
            if (schMap.hasPoint(node)) {
                return (true);
            }
            coverHash[node.join(',')] = true;
        }

        // 扫描内边距，内边距中不允许存在任何元素
        position.everyRect(margin.inner, (node) => {
            if (schMap.hasPoint(node)) {
                label = true;
                return false;
            }
            else {
                coverHash[node.join(',')] = true;
                return true;
            }
        });

        if (label) {
            return (true);
        }

        // 扫描外边距
        position.everyRect(margin.outter, (node) => {
            // 跳过内边距
            if (coverHash[node.join(',')]) {
                return true;
            }
            // 外边框为空
            if (!schMap.hasPoint(node)) {
                return true;
            }
            // 外边框不是由器件占据
            const status = schMap.getPoint(node);
            if (!status || status.type !== 'part') {
                return true;
            }

            // 校验相互距离
            const part = findPartCore(status.id);
            const another = part.margin.outter;
            const distance = position.add(part.position.floorToSmall(), -1);

            // 分别校验 x、y 轴
            for (let i = 0; i < 2; i++) {
                if (distance[i] !== 0) {
                    const sub = distance[i] > 0 ? 0 : 1;
                    const diffX = Math.abs(distance[i]);
                    const limitX = Math.abs(margin.outter[sub][i]) + Math.abs(another[1 - sub][i]);

                    if (diffX < limitX) {
                        label = true;
                        return false;
                    }
                }
            }

            return true;
        });

        return (label);
    }
}
