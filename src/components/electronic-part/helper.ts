import Vue from 'vue';

import Point from 'src/lib/point';
import Matrix from 'src/lib/matrix';
import { randomString } from 'src/lib/utils';

import { createId } from './common';
import { PartData } from './component';
import { default as Electronics, ShapeDescription } from './parts';

interface Props {
    value: ShapeDescription[];
}

export const PartShape = Vue.extend<Props>({
    functional: true,
    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },
    render(h, context) {
        return h(
            'g',
            context.props.value.map(
                (shape) =>
                    h(shape.name, { attrs: shape.attribute }),
            ) as any,
        );
    },
});

/** 兼容 PointLike 类型的点乘矩阵 */
export const product = (point: Point | number[], ma: Matrix): Point => {
    return Point.prototype.rotate.call(point, ma);
};

/**
 * 生成完整的初始化器件数据
 * @param type 器件类型
 */
export const createPartData = (type: keyof Electronics): PartData => ({
    type,
    hash: randomString(),
    rotate: new Matrix(2, 'E'),
    position: new Point(1e6, 1e6),
    id: createId(Electronics[type].pre),
    params: Electronics[type].params.map((n) => n.default),
    connect: Array(Electronics[type].points.length).fill(''),
});
