import {
  getPartPin,
  createLineByPath,
  createPartReferenceTag,
  isPartId,
} from '@circuit/electronics';
import {
  ILoggerService,
  IStateCoreService,
} from '@circuit/shared';
import { LineStructuredData } from '@circuit/types';
import {
  type PartWithPin,
  type ElectronicWithPin,
} from '@circuit/types';
import { definePlugin } from '../../../../context';
import {
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
} from '../../../../types';
import {
  type PathSearcher,
  findPartPin,
  findLinePinAndIndex,
  removeRepeat,
  createSearchHook,
  setSearchResult,
  getPainterAdapter,
} from '../algorithm';
import { PIN_DRAW_FIXED_STYLE } from '../algorithm/searcher/constant';
// import { painterStateGetter, createSearchHook, setSearchResult } from '../test.utils';
import { CreateLineSceneName, LoggerName } from './constant';
import { createDrawLineSearcher as createSearcher } from './search';

interface StartPayloadType extends DragSceneHookPayload {
  /** 新导线 */
  line: LineStructuredData;
  /** 起点连接引脚 */
  startPins: (PartWithPin | ElectronicWithPin)[];
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
    afterStart({ search, event }: StartPayloadType) {
      const { logger } = services;

      debugger;

      if (!event) {
        const msg = '创建导线事件触发时，必须传入鼠标事件';
        logger.error(LoggerName, msg);
        throw new Error(msg);
      }

      const { state, connection, variable, select, cursor, hover } = services;
      const { data: hoverData } = hover.current;

      debugger;
      /**
       * 绘制全新导线
       *   必须要一开始就把新导线提交到草稿
       *   但是因为是新的，所以 hash 和方框这些都还没有，不需要提交
       * 修改旧导线
       *   这里的问题是，草稿也可以提交，但是 hash 和方框这些怎么处理，初次搜索的时候再删除吗
       *
       * 流程需要统一
       * 点击时
       *   创建新导线时，提交草稿数据，然后触发事件，创建 searcher
       *   旧导线时，直接触发事件，创建 searcher
       * 触发事件开始
       *   主要是各种状态变更，设置选中，设置绘制导线节点之类的，还有打印日志
       * 移动开始
       *   创建导线时，没有别的内容
       *   修改导线时
       *       如果点击的点是导线的起点，还要把导线翻转
       *       删除 hash、方框等内容，连接数据的话，考虑和创建新导线时情况一样，连接数据也全都删了吧，还有，如果节点只剩下两个，那么剩下的两个导线需要合并
       * 移动中
       *   传入旧的导线作为判定标准之一
       * 正常结束
       *   创建导线时，正式提交数据，设置 hash 等内容
       *   修改导线时，正式提交数据，设置 hash 等内容
       * 取消
       *   需要有还原的函数，这里直接执行
       *
       * 整体来说，从创建到最后，都不应该区分两种情况。
       * 那么就需要在触发事件开始时，就把所有的回调
       */

      let line: StartPayloadType['line'];
      let searcher: StartPayloadType['searcher'];
      let startPins: StartPayloadType['startPins'];

      // 从器件引脚创建
      if (hoverData!.kind === EntityKind.PartPin) {
        const part = state.getPart(hoverData!.id);
        const pin = getPartPin(part, hoverData!.pin);

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
        startPins = [
          {
            id: hoverData!.id,
            pin: hoverData!.pin,
            tag: createPartReferenceTag(part),
          },
        ];

        state.draft(({ lines }) => {
          lines.push(line);
        });
      }
      // 从导线引脚修改导线
      else {
        // 当前鼠标所在位置的坐标
        const mouseRound = event.position.round(20);
        // const connections = connection.getConnections(hoverData.id, hoverData.pin);

        // // 没有连接，表示是空位置
        // if (connections.length === 0) {
        //   // ..
        // }
        // // 连接器件
        // else if (connections.some((item) => isPartId(item.id))) {
        //   // ..
        // }
        // // 连接导线
        // else {
        //   // ..
        // }
      }

      // 打印日志
      logger.info(
        LoggerName,
        '开始创建导线',
        `从器件 ${startPins![0].id} 第 ${startPins![0].pin} 引脚开始`,
        `新导线编号 ${line!.id}`,
      );
      // 选中导线
      select.set(line!.id);
      // 设置鼠标样式
      cursor.set(CursorKind.DrawLine);
      // 初始化导线路径和初始化样式
      setSearchResult(variable, [
        ...search(event.positionInDrawer),
        // // 作为起点的器件引脚固定缩小
        // {
        //   ...startPin,
        //   style: PIN_DRAW_FIXED_STYLE,
        // },
        // 导线起点固定缩小
        {
          id: line!.id,
          pin: 0,
          style: PIN_DRAW_FIXED_STYLE,
        },
      ]);
    },
    onFirstDragMove({ positionInDrawer, movement }, { searcher }: StartPayloadType) {
      // TODO: 处理第一次拖动
    },
    onDragMove({ positionInDrawer, movement }, { searcher }: StartPayloadType) {
      setSearchResult(services.variable, searcher(positionInDrawer, movement));
    },
    beforeEnd({ line, searcher, startPin }: StartPayloadType) {
      const {
        mapHash,
        collision,
        logger,
        state,
        connection,
        cursor,
        variable,
        select,
      } = services;

      /** 导线路径 */
      const linePath = searcher.getSearchPath().map((point) => point.round(20));
      /** 导线终点 */
      const endPoint = linePath[linePath.length - 1];

      // 导线路径不可能小于等于1
      if (linePath.length <= 1) {
        logger.error(LoggerName, '导线路径计算错误：', linePath.join(' -> '));
        state.dropDraft();
        return;
      }

      const { commitState: { data: { parts, lines } }, commit } = state;
      const endInPartPin = findPartPin(endPoint, parts);
      const endInLinePinAndIndex = findLinePinAndIndex(endPoint, lines);
      // 不沿用旧导线编号，是为了规避旧编号各种临时状态带来的干扰
      const newLineData: LineStructuredData = createLineByPath(linePath);

      // 终点在器件引脚上
      if (endInPartPin) {
        const connections = connection.getConnections(endInPartPin.id, endInPartPin.pin);

        if (connections.length > 0) {
          logger.error(LoggerName, '导线终点在器件引脚上，但引脚已连接', endInPartPin.tag, endInPartPin.pin);
          state.dropDraft();
          return;
        }

        // 设置连接关系
        connection.createConnection(startPin.id, startPin.pin, newLineData.id, 0);
        connection.createConnection(newLineData.id, 1, endInPartPin.id, endInPartPin.pin);
        // 设置导线图纸数据
        mapHash.setMark(newLineData);
        // 设置碰撞数据
        collision.setEntity(newLineData);
        // 提交新导线
        commit({
          name: `创建导线 ${line.id}`,
          description: `创建导线 ${line.id}，终点在器件引脚上`,
          patch({ lines }) {
            lines.push(newLineData);
          },
        });
      }
      // 终点在导线上
      else if (endInLinePinAndIndex) {
        if (Array.isArray(endInLinePinAndIndex)) {
          // 在空导线引脚上，合并导线
          if (endInLinePinAndIndex.length === 1) {
            const { id: mergedLineId, pin: mergedLinePin } = endInLinePinAndIndex[0];
            const mergedLine = lines.find((item) => item.id === mergedLineId);

            if (!mergedLine) {
              throw new Error(`合并的导线 ${mergedLineId} 不存在`);
            }

            const mergedLineConnection = connection.getConnections(mergedLineId, 1 - mergedLinePin);

            // 因为要顺序连接，所以这里需要反转
            if (mergedLinePin === 1) {
              mergedLine.path.reverse();
            }

            // 合并，并去除重复节点
            newLineData.path = removeRepeat([
              ...newLineData.path,
              ...mergedLine.path,
            ]);

            // 移除旧导线相关数据
            connection.removeDevice(mergedLineId);
            collision.removeEntity(mergedLineId);
            mapHash.removeMark(mergedLine);
            // 设置新导线相关数据
            connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
            connection.createConnections(newLineData.id, 1, mergedLineConnection);
            collision.setEntity(newLineData);
            mapHash.setMark(newLineData);

            // 提交新导线，且删除旧导线
            commit({
              name: `创建导线 ${line.id}`,
              description: `创建导线 ${line.id}，并合并导线 ${mergedLineId}`,
              patch({ lines }) {
                lines.push(newLineData);
                lines.splice(lines.findIndex((item) => item.id === mergedLineId), 1);
              },
            });
          }
          // 在导线交错节点上，连接导线
          else {
            // 设置导线相关数据
            connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
            connection.createConnections(newLineData.id, 1, endInLinePinAndIndex);
            collision.setEntity(newLineData);
            mapHash.setMark(newLineData);

            // 提交新导线，且删除旧导线
            commit({
              name: `创建导线 ${line.id}`,
              description: `创建导线 ${line.id}`,
              patch({ lines }) {
                lines.push(newLineData);
              },
            });
          }
        }
        // 在导线线段上，分割导线
        else {
          const { id: splitLineId, index: splitIndex } = endInLinePinAndIndex;
          const splitLine = lines.find((item) => item.id === splitLineId);

          if (!splitLine) {
            throw new Error(`拆分的导线 ${splitLine} 不存在`);
          }

          const splitLine1Path = splitLine.path.slice(0, splitIndex + 1);
          const splitLine2Path = splitLine.path.slice(splitIndex + 1);

          splitLine1Path.push(endPoint);
          splitLine2Path.unshift(endPoint);

          const splitLine1 = createLineByPath(splitLine1Path);
          const splitLine2 = createLineByPath(splitLine2Path);
          const crossConnections = [
            {
              id: splitLineId,
              pin: 1,
            },
            {
              id: splitLineId,
              pin: 0,
            },
            {
              id: newLineData.id,
              pin: 1,
            },
          ];

          splitLine1.path = removeRepeat(splitLine1.path);
          splitLine2.path = removeRepeat(splitLine2.path);

          // 新导线起点的连接是旧导线的起点连接
          connection.createConnections(splitLine1.id, 0, connection.getConnections(splitLineId, 0));
          // 新导线终点的连接是旧导线的终点连接
          connection.createConnections(splitLine2.id, 1, connection.getConnections(splitLineId, 1));
          // 设置三个导线的连接
          connection.createConnections(splitLine1.id, 1, crossConnections);
          connection.createConnections(splitLine2.id, 0, crossConnections);
          connection.createConnections(newLineData.id, 1, crossConnections);
          connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);

          // 移除旧导线相关信息
          connection.removeDevice(splitLineId);
          collision.removeEntity(splitLineId);
          mapHash.removeMark(splitLine);
          // 设置新导线相关信息
          collision.setEntity(splitLine1);
          mapHash.setMark(splitLine1);
          collision.setEntity(splitLine2);
          mapHash.setMark(splitLine2);
          collision.setEntity(newLineData);
          mapHash.setMark(newLineData);

          // 提交新导线，且删除旧导线
          commit({
            name: `创建导线 ${line.id}`,
            description: `创建导线 ${line.id}，并拆分旧导线 ${splitLine.id}，拆分出来的导线为 ${splitLine1.id} 和 ${splitLine2.id}`,
            patch({ lines }) {
              lines.push(newLineData);
              lines.push(splitLine1);
              lines.push(splitLine2);
              lines.splice(lines.findIndex((item) => item.id === splitLineId), 1);
            },
          });
        }
      }
      // 终点在空位置
      else {
        // 空位置需要设置起点的连接关系
        connection.createConnection(newLineData.id, 0, startPin.id, startPin.pin);
        // 设置导线图纸数据
        mapHash.setMark(newLineData);
        // 设置碰撞数据
        collision.setEntity(newLineData);
        // 提交新导线
        commit({
          name: `创建导线 ${line.id}`,
          description: `创建导线 ${line.id}，终点在器件引脚上`,
          patch({ lines }) {
            lines.push(newLineData);
          },
        });
      }

      // 清除鼠标样式
      cursor.clear();
      // 清除临时变量
      variable.clearVariable();
      // 设置选中
      select.set(newLineData.id);
      // 打印结束日志
      logger.info(LoggerName, '结束创建导线', newLineData.id);
    },
  });
});
