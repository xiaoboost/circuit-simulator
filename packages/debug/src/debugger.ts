import { NS, elIdName, nodeColor } from './constant';

import type { PointLike } from '@circuit/math';
import type { MarkNodeLabel } from '@circuit/map';
import type { Line, Part, Connect } from '@circuit/electronics';

class Debugger {
  /**
   * 每个实例都将直接操作此 SVG 元素
   * @type {SVGGElement}
   */
  $el!: SVGGElement;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.$el = document.createElementNS(NS, 'g');
      this.$el.setAttribute('id', elIdName);
    }
  }
  point([x, y]: PointLike, color = 'black'): void {
    const el = document.createElementNS(NS, 'circle');

    el.setAttribute('stroke-width', '3');
    el.setAttribute('fill', 'transparent');
    el.setAttribute('class', 'debug-point');
    el.setAttribute('stroke', color);
    el.setAttribute('cx', String(x));
    el.setAttribute('cy', String(y));
    el.setAttribute('r', '4');

    this.$el.appendChild(el);
  }
  path(way: PointLike[], color = 'black'): void {
    const el = document.createElementNS(NS, 'path');

    el.setAttribute('d', `M${way.map((point) => point.join(',')).join('L')}`);
    el.setAttribute('class', 'debug-path');
    el.setAttribute('stroke-width', '2');
    el.setAttribute('fill', 'transparent');
    el.setAttribute('stroke', color);

    this.$el.appendChild(el);
  }
  text([x, y]: PointLike, text: string | number): void {
    const el = document.createElementNS(NS, 'text');

    el.textContent = String(text);
    el.setAttribute('x', String(x));
    el.setAttribute('y', String(y));
    el.setAttribute('fill', '#3B4449');
    el.setAttribute('font-size', '14');
    el.setAttribute('stroke-width', '0');
    el.setAttribute('class', 'debug-text');

    this.$el.appendChild(el);
  }
  clearPoint(): void {
    Array
      .from(this.$el.querySelectorAll('.debug-point'))
      .forEach((el) => el.remove());
  }
  clearAll(): void {
    this.$el.innerHTML = '';
  }
  whole() {
    let count = 0;

    const lines: Line[] = (window as any)._lines ?? [];
    const parts: Part[] = (window as any)._parts ?? [];
    const getConnect = (data: Connect | undefined) => data ? `${data.id}-${data.mark}` : '';

    for (const line of lines) {
      this.text(
        [1000, count * 25 + 50],
        `${getConnect(line.connections[0])} ---> ${line.id} ---> ${getConnect(line.connections[1])}`,
      );
      count++;
    }

    count++;

    const map = lines[0].map ?? parts[0].map;

    if (!map) {
      return;
    }

    const getLabels = (labels: MarkNodeLabel[]) => {
      return labels.map((label) => {
        return `${label.id}-${label.mark}`;
      }).join(', ');
    };

    for (const status of Object.values(map.toData())) {
      const point = status.position;
      // 点本身
      this.point(point, nodeColor[status.kind]);

      // 点的 ID
      if (status.kind === 'Line') {
        this.text(point, status.labels[0].mark);
      }
      else if (status.kind === 'PartPin') {
        this.text(point, getLabels(status.labels));
      }
      else if (
        status.kind === 'LineCoverPoint' ||
        status.kind === 'LineCrossPoint'
      ) {
        const textPosition = [1000, count * 25 + 50];

        this.path([point, textPosition], '#222222');
        this.text(textPosition, getLabels(status.labels));

        count++;
      }

      // 点的连接关系
      (status.connections || []).forEach(([tx, ty]) => {
        const [x, y] = point;

        if (x - tx < 0) {
          this.path([[x, y - 3], [tx, ty - 3]]);
        }
        else if (x - tx > 0) {
          this.path([[x, y + 3], [tx, ty + 3]]);
        }
        else if (y - ty < 0) {
          this.path([[x - 3, y], [tx - 3, ty]]);
        }
        else if (y - ty > 0) {
          this.path([[x + 3, y], [tx + 3, ty]]);
        }
      });
    }
  }
}

export const debug = new Debugger();
