import { useEffect } from 'react';
import { Point } from '@circuit/math';
import { cursorStyles } from 'src/styles';
import {
  LinePin,
  Line as LineInstance,
  getDrawSearcher,
} from '@circuit/electronics';
import { DrawEventController } from '@circuit/event';
import { LineProps } from './line';

function drawing(pin: LinePin.Start | LinePin.End, line: LineInstance, forceUpdate: () => void) {
  // if (pin === LinePin.Start) {
  //   this.reverse();
  // }

  // this.deleteMark();
  // this.updatePoints();
  // this.updateView();
  // this._rects = [];

  // const start = this.path[0];
  // const connect = this.connections[0];

  // if (!connect.value) {
  //   throw new Error(`空连接导线`);
  // }

  // const startPart = this.find<PartComponent>(connect.value.id);
  // const direction = startPart?.points[connect.value.mark]?.direction;

  // if (!startPart || !direction) {
  //   throw new Error(`不存在的器件：${connect.value.id}`);
  // }

  // const pathSearcher = new DrawPathSearcher(start, direction, this);
  // const drawEvent = new DrawEventController();
  // const overSelector = [
  //   `.${partStyles.part} .${partStyles.partFocus}`,
  //   `.${lineStyles.line} .${lineStyles.lineFocus}`,
  // ].join(', ');

  // this.sortIndex = 0;
  // this.updateListView();

  // await drawEvent
  //   .setClassName(cursorStyles.drawLine)
  //   .setStopEvent({ type: 'mouseup', which: 'Left' })
  //   .setMoveEvent((ev) => {
  //     this.path = pathSearcher.search(ev.position, ev.movement);
  //   })
  //   .setEvent({
  //     type: 'mouseenter',
  //     selector: overSelector,
  //     callback: (ev) => {
  //       const element = ev.target.parentElement!;
  //       const currentId = element.dataset.id as string;

  //       if (currentId && currentId !== this.id) {
  //         const el = this.find<LineComponent | PartComponent>(currentId);

  //         if (el) {
  //           pathSearcher.setMouseOver(el);
  //         }
  //       }
  //     },
  //   })
  //   .setEvent({
  //     type: 'mouseleave',
  //     selector: overSelector,
  //     callback: (ev) => {
  //       const element = ev.target.parentElement!;
  //       const currentId = element.dataset.id as string;

  //       if (currentId && currentId !== this.id) {
  //         pathSearcher.freeMouse();
  //       }
  //     },
  //   })
  //   .start();

  // /** 格式化终点坐标 */
  // let finalEnd = this.path.get(-1).round();
  // /** 终点信息 */
  // const endData = this.map.get(finalEnd);
  // /** 终点坐标 */
  // const endNode = this.path.get(-1);

  // // 起点和终点相等或者只有一个点，则删除当前导线
  // if (this.path.length < 2 || finalEnd.isEqual(this.path[0])) {
  //   this.delete();
  //   return;
  // }

  // // // 终点被占用
  // // if (endData && endData.kind === MarkNodeKind.Part) {
  // //   finalEnd = (
  // //     finalEnd
  // //       .around((node) => !this.map.has(node))
  // //       .reduce((pre, next) =>
  // //         endNode.distance(pre) < endNode.distance(next) ? pre : next,
  // //       )
  // //   );
  // // }

  // this.sortIndex = undefined;
  // this.points[1].size = -1;
  // this.path.endToPoint(finalEnd);

  // this.setConnectionByPath(LinePin.End);
  // this.setMark();
  // this.updateRects();
  // this.updateListView();
}

/** 导线创建时 */
export function useLineCreate(props: LineProps, forceUpdate: () => void) {
  const {
    instance,
    onBeforeCreate,
    onCreated,
    onDeleted,
  } = props;

  useEffect(() => {
    // 不是新建导线则退出
    if (instance.path.length !== 1) {
      return;
    }

    onBeforeCreate?.(instance.id);
    drawing(LinePin.Start, instance, forceUpdate);

    const searcher = getDrawSearcher();

    DrawEventController.create()
      .setClassName(cursorStyles.drawLine)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setStopEvent()
      .setMoveEvent((e) => {
        // ..
      })
      .start()
      .then(() => {
        // ..
      });
  }, []);
}

/** 导线修改时 */
export function drawingLine(props: LineProps, forceUpdate: () => void) {
  // ..
}
