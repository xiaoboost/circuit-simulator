import { Point } from '@circuit/algorithm';
import {
  ILoggerService,
  IStateCoreService,
} from '@circuit/contracts/global';
import { definePlugin,
  DragSceneHookPayload,
  IEventListenerHook,
  IHoverService,
  IDragSceneHook,
  ISelectService,
  IDragSceneService,
  IMapHashService,
  EntityKind,
  IConnectionService,
  ICursorService,
  CursorKind,
  ICollisionService,
  IVariableObserverService,
} from '@circuit/contracts/painter';
import {
  getPartPin,
  createLineByPath,
  createPartReferenceTag,
  isPartId,
} from '@circuit/electronics';
import {
  type LineStructuredData,
  type ElectronicIdWithPin,
} from '@circuit/types';
import {
  type PathSearcher,
  findPartPin,
  findLinePinAndIndex,
  findNearestLineByPoint,
  removeRepeat,
  createSearchHook,
  setSearchResult,
  getPainterAdapter,
} from '../algorithm';
import { PIN_DRAW_FIXED_STYLE } from '../algorithm/searcher/constant';
import { CreateLineSceneName, LoggerName } from './constant';
import { createDrawLineSearcher as createSearcher } from './search';

interface StartPayloadType extends DragSceneHookPayload {
  /** 新导线 */
  line: LineStructuredData;
  /** 搜索器 */
  searcher: PathSearcher;
}

definePlugin(({ registerHook, getServices }) => {
  const services = getServices({
    dragScene: IDragSceneService,
    hover: IHoverService,
    state: IStateCoreService,
    connection: IConnectionService,
    mapHash: IMapHashService,
    variable: IVariableObserverService,
    logger: ILoggerService,
    select: ISelectService,
    cursor: ICursorService,
    collision: ICollisionService,
  });

  // 注册创建导线场景触发器
  registerHook(IEventListenerHook, {
    order: 5,
    onMouseDown(event) {
      const { dragScene, hover } = services;
      const { data: hoverData } = hover.current;

      if (
        dragScene.isLeftMouseDownNoMovingNoScene(event)
        && (
          hoverData
          && (
            hoverData.kind === EntityKind.PartPin
            || hoverData.kind === EntityKind.LinePin
          )
        )
      ) {
        dragScene.trigger(CreateLineSceneName, { event });
      }
    },
    onMouseUp(event) {
      const { dragScene } = services;
      if (dragScene.isLeftMouseUpNoMovingHasScene(event, CreateLineSceneName)) {
        dragScene.triggerEnd(CreateLineSceneName, { event });
      }
    },
  });

  // 创建的拖动场景
  registerHook(IDragSceneHook, {
    name: CreateLineSceneName,
    afterStart(payload: StartPayloadType) {
      const { search, event } = payload;
      const { logger } = services;

      if (!event) {
        const msg = '创建导线事件触发时，必须传入鼠标事件';
        logger.error(LoggerName, msg);
        throw new Error(msg);
      }

      const { state, variable, select, cursor, hover } = services;
      const { positionInDrawer: mousePosition } = event;
      const { commitState: { data: commitData } } = state;
      const { data: hoverData } = hover.current;

      debugger;

      let line: StartPayloadType['line'];
      let searcher: StartPayloadType['searcher'];
      const connectedElectronics: ElectronicIdWithPin[] = [];

      // 从器件引脚创建
      if (hoverData!.kind === EntityKind.PartPin) {
        const partWithPin = findPartPin(mousePosition.round(20), commitData.parts);

        if (!partWithPin) {
          const msg = `无法找到鼠标附近的器件引脚：${mousePosition.toString()}`;
          logger.error(LoggerName, msg);
          throw new Error(msg);
        }

        const { data: part, pin: partPinIndex } = partWithPin;
        const pin = getPartPin(part, partPinIndex);

        line = createLineByPath([pin.position]);
        searcher = createSearcher({
          lineId: line.id,
          start: pin.position,
          direction: pin.direction,
          painter: getPainterAdapter({
            ...services,
            ignoreSet: new Set([hoverData!.id]),
          }),
          hook: createSearchHook(variable),
        });
        // startPins = [
        //   {
        //     id: hoverData!.id,
        //     pin: hoverData!.pin,
        //     tag: createPartReferenceTag(part),
        //   },
        // ];

        state.draft(({ lines }) => {
          lines.push(line);
        });

        logger.info(
          LoggerName,
          '开始创建导线',
          `从器件 ${createPartReferenceTag(part)} 第 ${hoverData!.pin} 引脚开始`,
          `新导线编号 ${line!.id}`,
        );
      }
      // 从导线引脚修改导线
      else {
        debugger;
        const crossLines = findNearestLineByPoint(mousePosition, commitData.lines);

        if (!crossLines) {
          const msg = `无法找到鼠标附近的导线：${mousePosition.toString()}`;
          logger.error(LoggerName, msg);
          throw new Error(msg);
        }

        const {
          nearest: {
            data: nearestLine,
            pin: nearestPin,
          },
          rest: restLines,
        } = crossLines;
        const { path: nearestPath } = nearestLine;
        /** 鼠标点击点是否在器件引脚上 */
        const partWithPin = findPartPin(mousePosition.round(20), commitData.parts);
        /** 最近的导线起点 */
        const startPoint = nearestPin === 1 ? nearestPath[0] : nearestPath[nearestPath.length - 1];
        /** 起始方向 */
        const direction = nearestPin === 1
          ? new Point(nearestPath[0], nearestPath[1]).toUnit()
          : new Point(
            nearestPath[nearestPath.length - 1],
            nearestPath[nearestPath.length - 2],
          ).toUnit();

        line = nearestLine;
        searcher = createSearcher({
          lineId: line.id,
          start: startPoint,
          direction,
          painter: getPainterAdapter({
            ...services,
            ignoreSet: new Set([nearestLine.id]),
          }),
          hook: createSearchHook(variable),
          refPath: nearestPath,
        });

        // 鼠标点击点在器件引脚上
        if (partWithPin) {
          const { data: part, pin: partPinIndex } = partWithPin;
          connectedElectronics.push({
            id: part.id,
            pin: partPinIndex,
          });
        }
        // 鼠标点击点在交错节点上，并且只剩下 2 个导线
        else if (restLines.length === 2) {
          connectedElectronics.push(...restLines.map((item) => ({
            id: item.data.id,
            pin: item.pin,
          })));
        }

        logger.info(LoggerName, `开始修改 ${line.id} 导线`);
      }

      // 选中导线
      select.set(line!.id);
      // 设置鼠标样式
      cursor.set(CursorKind.DrawLine);
      // 保存临时数据
      payload.line = line!;
      payload.searcher = searcher!;

      // 初始化导线路径和初始化样式
      setSearchResult(variable, [
        ...search(event.positionInDrawer),
        // 导线起点固定缩小
        {
          id: line!.id,
          pin: 0,
          style: PIN_DRAW_FIXED_STYLE,
        },
        // 修改模式下，原始点击的点其余连接关系的节点缩小
        ...(connectedElectronics.map((item) => ({
          id: item.id,
          pin: item.pin,
          style: PIN_DRAW_FIXED_STYLE,
        }))),
      ]);
    },
    onDragMove({ positionInDrawer, movement }, { searcher }: StartPayloadType) {
      setSearchResult(services.variable, searcher(positionInDrawer, movement));
    },
    beforeEnd({ line, searcher, originalLine, originalLinePin }: StartPayloadType) {
      // const {
      //   mapHash,
      //   collision,
      //   logger,
      //   state,
      //   connection,
      //   cursor,
      //   variable,
      //   select,
      // } = services;

      // /** 导线路径 */
      // const linePath = searcher.getSearchPath().map((point) => point.round(20));
      // /** 导线终点 */
      // const endPoint = linePath[linePath.length - 1];

      // // 导线路径不可能小于等于1
      // if (linePath.length <= 1) {
      //   logger.error(LoggerName, '导线路径计算错误：', linePath.join(' -> '));
      //   state.dropDraft();
      //   return;
      // }

      // const { commitState: { data: { parts, lines } } } = state;
      // const endInPartPin = findPartPin(endPoint, parts);
      // const endInLinePinAndIndex = findLinePinAndIndex(endPoint, lines);
      // // 不沿用旧导线编号，是为了规避旧编号各种临时状态带来的干扰
      // const newLineData: LineStructuredData = createLineByPath(linePath);
      // /** 修改模式 */
      // const isModifyMode = lines.find((v) => v.id === line.id);

      // // 当前导线包含在提交的导线中，那么肯定是修改模式，需要清楚当前导线的所有内容
      // if (isModifyMode) {

      // }

      // // 终点在器件引脚上
      // if (endInPartPin) {
      //   const connections = connection.getConnections(endInPartPin.data.id, endInPartPin.pin);

      //   if (connections.length > 0) {
      //     logger.error(LoggerName, '导线终点在器件引脚上，但引脚已连接', endInPartPin.tag, endInPartPin.pin);
      //     state.dropDraft();
      //     return;
      //   }

      //   // 设置连接关系
      //   connection.createConnection(startPin.id, startPin.pin, newLineData.id, 0);
      //   connection.createConnection(newLineData.id, 1, endInPartPin.data.id, endInPartPin.pin);
      //   // 设置导线图纸数据
      //   mapHash.setMark(newLineData);
      //   // 设置碰撞数据
      //   collision.setEntity(newLineData);
      //   // 暂存操作，创建新导线
      //   state.stage({
      //     name: `创建导线 ${line.id}`,
      //     description: `创建导线 ${line.id}，终点在器件引脚上`,
      //     patch({ lines }) {
      //       lines.push(newLineData);
      //     },
      //   });
      // }
      // // 终点在导线上
      // else if (endInLinePinAndIndex) {
      //   if (Array.isArray(endInLinePinAndIndex)) {
      //     // 在空导线引脚上，合并导线
      //     if (endInLinePinAndIndex.length === 1) {
      //       const { data: mergedLine, pin: mergedLinePin } = endInLinePinAndIndex[0];
      //       const { id: mergedLineId } = mergedLine;
      //       const mergedLineConnection = connection.getConnections(mergedLineId, 1 - mergedLinePin);

      //       // 因为要顺序连接，所以这里需要反转
      //       if (mergedLinePin === 1) {
      //         mergedLine.path.reverse();
      //       }

      //       // 合并，并去除重复节点
      //       newLineData.path = removeRepeat([
      //         ...newLineData.path,
      //         ...mergedLine.path,
      //       ]);

      //       // 移除旧导线相关数据
      //       connection.removeDevice(mergedLineId);
      //       collision.removeEntity(mergedLineId);
      //       mapHash.removeMark(mergedLine);
      //       // 设置新导线相关数据
      //       connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
      //       connection.createConnections(newLineData.id, 1, mergedLineConnection);
      //       collision.setEntity(newLineData);
      //       mapHash.setMark(newLineData);

      //       // 暂存操作，创建新导线，且删除旧导线
      //       state.stage({
      //         name: `创建导线 ${line.id}`,
      //         description: `创建导线 ${line.id}，并合并导线 ${mergedLineId}`,
      //         patch({ lines }) {
      //           lines.push(newLineData);
      //           lines.splice(lines.findIndex((item) => item.id === mergedLineId), 1);
      //         },
      //       });
      //     }
      //     // 在导线交错节点上，连接导线
      //     else {
      //       // 设置导线相关数据
      //       connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
      //       connection.createConnections(newLineData.id, 1, endInLinePinAndIndex.map((v) => ({
      //         id: v.data.id,
      //         pin: v.pin,
      //       })));
      //       collision.setEntity(newLineData);
      //       mapHash.setMark(newLineData);

      //       // 暂存操作，创建新导线
      //       state.stage({
      //         name: `创建导线 ${line.id}`,
      //         description: `创建导线 ${line.id}`,
      //         patch({ lines }) {
      //           lines.push(newLineData);
      //         },
      //       });
      //     }
      //   }
      //   // 在导线线段上，分割导线
      //   else {
      //     const { data: splitLine, index: splitIndex } = endInLinePinAndIndex;
      //     const { id: splitLineId } = splitLine;
      //     const splitLine1Path = splitLine.path.slice(0, splitIndex + 1);
      //     const splitLine2Path = splitLine.path.slice(splitIndex + 1);

      //     splitLine1Path.push(endPoint);
      //     splitLine2Path.unshift(endPoint);

      //     const splitLine1 = createLineByPath(splitLine1Path);
      //     const splitLine2 = createLineByPath(splitLine2Path);
      //     const crossConnections = [
      //       {
      //         id: splitLineId,
      //         pin: 1,
      //       },
      //       {
      //         id: splitLineId,
      //         pin: 0,
      //       },
      //       {
      //         id: newLineData.id,
      //         pin: 1,
      //       },
      //     ];

      //     splitLine1.path = removeRepeat(splitLine1.path);
      //     splitLine2.path = removeRepeat(splitLine2.path);

      //     // 新导线起点的连接是旧导线的起点连接
      //     connection.createConnections(splitLine1.id, 0, connection.getConnections(splitLineId, 0));
      //     // 新导线终点的连接是旧导线的终点连接
      //     connection.createConnections(splitLine2.id, 1, connection.getConnections(splitLineId, 1));
      //     // 设置三个导线的连接
      //     connection.createConnections(splitLine1.id, 1, crossConnections);
      //     connection.createConnections(splitLine2.id, 0, crossConnections);
      //     connection.createConnections(newLineData.id, 1, crossConnections);
      //     connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);

      //     // 移除旧导线相关信息
      //     connection.removeDevice(splitLineId);
      //     collision.removeEntity(splitLineId);
      //     mapHash.removeMark(splitLine);
      //     // 设置新导线相关信息
      //     collision.setEntity(splitLine1);
      //     mapHash.setMark(splitLine1);
      //     collision.setEntity(splitLine2);
      //     mapHash.setMark(splitLine2);
      //     collision.setEntity(newLineData);
      //     mapHash.setMark(newLineData);

      //     // 提交新导线，且删除旧导线
      //     commit({
      //       name: `创建导线 ${line.id}`,
      //       description: `创建导线 ${line.id}，并拆分旧导线 ${splitLine.id}，拆分出来的导线为 ${splitLine1.id} 和 ${splitLine2.id}`,
      //       patch({ lines }) {
      //         lines.push(newLineData);
      //         lines.push(splitLine1);
      //         lines.push(splitLine2);
      //         lines.splice(lines.findIndex((item) => item.id === splitLineId), 1);
      //       },
      //     });
      //   }
      // }
      // // 终点在空位置
      // else {
      //   // 空位置需要设置起点的连接关系
      //   connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
      //   // 设置导线图纸数据
      //   mapHash.setMark(newLineData);
      //   // 设置碰撞数据
      //   collision.setEntity(newLineData);
      //   // 提交新导线
      //   commit({
      //     name: `创建导线 ${line.id}`,
      //     description: `创建导线 ${line.id}，终点在器件引脚上`,
      //     patch({ lines }) {
      //       lines.push(newLineData);
      //     },
      //   });
      // }

      // // 如果是修改已有导线，需要处理原始导线的清理和合并
      // if (originalLine && originalLinePin !== undefined) {
      //   // 清理原始点击的导线所在点的连接关系
      //   // 找到该点连接的所有导线（排除新导线和原始导线）
      //   const originalPointConnections = connection.getConnections(
      //     originalLine.id,
      //     originalLinePin,
      //   );
      //   const connectedLines = originalPointConnections
      //     .filter(
      //       (conn) => !isPartId(conn.id)
      //         && conn.id !== newLineData.id
      //         && conn.id !== originalLine.id,
      //     )
      //     .map((conn) => ({
      //       lineId: conn.id,
      //       pin: conn.pin,
      //     }));

      //   // 如果原始点所在导线只剩下两条（新导线 + 另一条导线），则合并这两个导线
      //   if (connectedLines.length === 1) {
      //     const otherLineId = connectedLines[0].lineId;
      //     const otherLinePin = connectedLines[0].pin;
      //     const otherLine = lines.find((l) => l.id === otherLineId);

      //     if (otherLine) {
      //       // 合并新导线和另一条导线
      //       const otherLineOtherPin = 1 - otherLinePin;
      //       const otherLineOtherConnections = connection.getConnections(
      //         otherLineId,
      //         otherLineOtherPin,
      //       );

      //       // 确定合并后的路径方向
      //       let mergedPath: Point[];
      //       if (otherLinePin === 1) {
      //         // 另一条导线的终点连接原始点，需要反转
      //         mergedPath = removeRepeat([
      //           ...newLineData.path,
      //           ...otherLine.path.reverse(),
      //         ]);
      //       }
      //       else {
      //         // 另一条导线的起点连接原始点
      //         mergedPath = removeRepeat([
      //           ...newLineData.path,
      //           ...otherLine.path,
      //         ]);
      //       }

      //       const mergedLine = createLineByPath(mergedPath);

      //       // 移除旧导线相关数据
      //       connection.removeDevice(newLineData.id);
      //       connection.removeDevice(otherLineId);
      //       collision.removeEntity(newLineData.id);
      //       collision.removeEntity(otherLineId);
      //       mapHash.removeMark(newLineData);
      //       mapHash.removeMark(otherLine);

      //       // 设置合并后导线的连接关系
      //       connection.createConnection(mergedLine.id, 0, startPin.id, startPin.pin);
      //       connection.createConnections(mergedLine.id, 1, otherLineOtherConnections);
      //       collision.setEntity(mergedLine);
      //       mapHash.setMark(mergedLine);

      //       // 暂存操作，用合并后的导线替换新导线和另一条导线
      //       state.stage({
      //         name: `修改导线 ${originalLine.id}`,
      //         description: `修改导线 ${originalLine.id}，合并导线 ${newLineData.id} 和 ${otherLineId}`,
      //         patch({ lines: stateLines }) {
      //           // 删除新导线和另一条导线
      //           const newLineIndex = stateLines.findIndex((l) => l.id === newLineData.id);
      //           if (newLineIndex >= 0) {
      //             stateLines.splice(newLineIndex, 1);
      //           }
      //           const otherLineIndex = stateLines.findIndex((l) => l.id === otherLineId);
      //           if (otherLineIndex >= 0) {
      //             stateLines.splice(otherLineIndex, 1);
      //           }
      //           // 添加合并后的导线
      //           stateLines.push(mergedLine);
      //         },
      //       });

      //       // 设置选中合并后的导线
      //       select.set(mergedLine.id);
      //       logger.info(LoggerName, '结束修改导线，已合并', mergedLine.id);
      //       return;
      //     }
      //   }

      //   // 如果没有合并，只是清理原始导线的连接关系
      //   // 原始导线的连接关系已经在 getPainterAdapter 中处理过了
      //   logger.debug(LoggerName, '修改导线完成，原始导线已清理', originalLine.id);
      // }

      // 提交变更
      // state.commit();
      // // 清除鼠标样式
      // cursor.clear();
      // // 清除临时变量
      // variable.clearVariable();
      // // 设置选中
      // select.set(newLineData.id);
      // // 打印结束日志
      // logger.info(LoggerName, '结束创建导线', newLineData.id);
    },
    beforeCancel(payload: StartPayloadType) {
      const { logger, state, cursor, variable } = services;
      logger.info(LoggerName, '取消创建导线', payload.line.id);
      state.dropDraft();
      cursor.clear();
      variable.clearVariable();
    },
  });
});
