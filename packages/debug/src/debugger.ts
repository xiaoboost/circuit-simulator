import { NS, elIdName } from './constant';

import type { PointLike } from '@circuit/math';

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
  point([x, y]: PointLike, color = 'black', mul = 1): void {
    const el = document.createElementNS(NS, 'circle');
  
    el.setAttribute('stroke-width', '3');
    el.setAttribute('fill', 'transparent');
    el.setAttribute('class', 'debug-point');
    el.setAttribute('stroke', color);
    el.setAttribute('cx', String(x * mul));
    el.setAttribute('cy', String(y * mul));
    el.setAttribute('r', '4');
  
    this.$el.appendChild(el);
  }
  path(way: PointLike[], color = 'black', mul = 1): void {
    const el = document.createElementNS(NS, 'path');
  
    el.setAttribute('d', `M${way.map((point) => point.join(',')).join('L')}`);
    el.setAttribute('class', 'debug-path');
    el.setAttribute('stroke-width', '2');
    el.setAttribute('fill', 'transparent');
    el.setAttribute('stroke', color);
  
    this.$el.appendChild(el);
  }
  text([x, y]: PointLike, text: string, mul = 1): void {
    const el = document.createElementNS(NS, 'text');
  
    el.textContent = text;
    el.setAttribute('x', String(x * mul));
    el.setAttribute('y', String(y * mul));
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
    // let count = 0;
    // store.state.lines.forEach((line) => {
    //   this.text(
    //   [1000, count * 25 + 50],
    //   `${line.connect[0]} ---> ${line.id} ---> ${line.connect[1]}`,
    //   );
    //   count++;
    // });
    // count++;
  
    // const data = JSON.parse(outputMap()) as MapHash;
  
    // Object.values(data).forEach((status) => {
    //   const point = Point.from(status.point);
    //   // 点本身
    //   this.point(point, nodeColor[status.type], 20);
    //   // 点的 ID
    //   if (status.type === NodeType.Line) {
    //   this.text(point, status.id.split('_')[1], 20);
    //   }
    //   else if (status.type === NodeType.PartPoint) {
    //   this.text(new Point(point, [0.4, -0.4]), status.id, 20);
    //   }
    //   else if (
    //   status.type === NodeType.LineCoverPoint ||
    //   status.type === NodeType.LineCrossPoint
    //   ) {
    //   const textPosition = [1000, count * 25 + 50];
  
    //   this.path([point.mul(20), textPosition], '#222222');
    //   this.text(textPosition, status.id);
    //   count++;
    //   }
  
    //   // 点的连接关系
    //   const connect = (status.connect || []).map(Point.from);
    //   connect.forEach(([tx, ty]) => {
    //   const [x, y] = point;
  
    //   if (x - tx < 0) {
    //     this.path([[x * 20, y * 20 - 3], [tx * 20, ty * 20 - 3]]);
    //   }
    //   else if (x - tx > 0) {
    //     this.path([[x * 20, y * 20 + 3], [tx * 20, ty * 20 + 3]]);
    //   }
    //   else if (y - ty < 0) {
    //     this.path([[x * 20 - 3, y * 20], [tx * 20 - 3, ty * 20]]);
    //   }
    //   else if (y - ty > 0) {
    //     this.path([[x * 20 + 3, y * 20], [tx * 20 + 3, ty * 20]]);
    //   }
    //   });
    // });
  }
}

export const debug = new Debugger();
