import { createLineByPath } from '@circuit/electronics';
import type { IStateCoreService, ILoggerService } from '@circuit/shared';
import type { StructuredData, LineStructuredData } from '@circuit/types';
import type {
  IConnectionData,
  IConnectionService,
  ICollisionService,
  IMapHashService,
  ISelectService,
  ICursorService,
  IHoverService,
  IContextMenuService,
} from '../../../../types';
import { removeRepeat } from '../../../interactions/editor/algorithm/electronics/line';
import { getConnections } from '../../../services/connection/utils';
import { LoggerName } from './constant';

export interface DeletePlan {
  /** 新增导线 */
  addedLines: LineStructuredData[];
  /** 因合并被移除的导线 */
  mergedRemovedLineIds: string[];
  /** 直接被删除的选中元件 */
  removedIds: string[];
  /** 新增导线两端需要建立的连接 */
  addLineConnections: {
    id: string;
    pin0: IConnectionData[];
    pin1: IConnectionData[];
  }[];
}

/**
 * 规划删除与导线合并
 */
export function planDeleteAndMerge(input: StructuredData, selected: Set<string>): DeletePlan {
  if (selected.size === 0) {
    return {
      addedLines: [],
      mergedRemovedLineIds: [],
      removedIds: [],
      addLineConnections: [],
    };
  }

  const removedIds = Array.from(selected);
  const next: StructuredData = {
    parts: input.parts.filter((p) => !selected.has(p.id)),
    lines: input.lines.filter((l) => !selected.has(l.id)),
  };

  const mergedRemovedLineIds: string[] = [];
  const addedLines: LineStructuredData[] = [];
  const addLineConnections: DeletePlan['addLineConnections'] = [];

  // 迭代合并，直到没有可合并的导线
  // 两个导线的端点在同一点相接，且该连接点仅有这两个导线端点（无器件引脚、无第三根导线端点）
  while (true) {
    // 所有连接点
    const connections = getConnections(next);
    // 仅连接了两个元件的连接点
    const onlyTwoConnections = connections.filter((g) => g.length === 2);

    // 找到一个可合并的候选
    let candidate:
      | { aId: string; aPin: 0 | 1; bId: string; bPin: 0 | 1 }
      | undefined;

    for (const group of onlyTwoConnections) {
      const linePins = group.filter((c) => isLinePin(next, c));
      // 仅有两根导线端点在此处，才可合并
      if (linePins.length === 2) {
        const [a, b] = linePins as [IConnectionData, IConnectionData];
        candidate = {
          aId: a.id,
          aPin: a.pin as 0 | 1,
          bId: b.id,
          bPin: b.pin as 0 | 1,
        };
        break;
      }
    }

    if (!candidate) {
      break;
    }

    const a = next.lines.find((l) => l.id === candidate!.aId);
    const b = next.lines.find((l) => l.id === candidate!.bId);
    if (!a || !b) {
      break;
    }

    // 规范化路径方向：a 从另一端到连接点；b 从连接点到另一端
    const aPath = a.path.slice();
    if (candidate.aPin === 0) {
      aPath.reverse();
    }
    const bPath = b.path.slice();
    if (candidate.bPin === 1) {
      bPath.reverse();
    }

    // 拼接并去除重复交点
    const mergedPath = removeRepeat([...aPath, ...bPath.slice(1)]);
    const mergedLine = createLineByPath(mergedPath);

    // 计算新导线两端的连接：取 a 的另一端组和 b 的另一端组
    const aOtherPin = (candidate.aPin === 0 ? 1 : 0) as 0 | 1;
    const bOtherPin = (candidate.bPin === 0 ? 1 : 0) as 0 | 1;
    const pin0Conns = findGroupConnections(connections, { id: a.id, pin: aOtherPin })
      .filter((c) => !(c.id === a.id && c.pin === aOtherPin));
    const pin1Conns = findGroupConnections(connections, { id: b.id, pin: bOtherPin })
      .filter((c) => !(c.id === b.id
        && c.pin === bOtherPin));

    // 替换数据：删除 a、b，新增 merged
    next.lines = next.lines.filter((l) => l.id !== a.id && l.id !== b.id);
    next.lines.push(mergedLine);
    mergedRemovedLineIds.push(a.id, b.id);
    addedLines.push(mergedLine);
    addLineConnections.push({ id: mergedLine.id, pin0: pin0Conns, pin1: pin1Conns });
  }

  // 当前的所有导线
  const currentLines = new Set(next.lines.map(({ id }) => id));
  // 原始的所有导线
  const oldLines = new Set(input.lines.map(({ id }) => id));

  // 最后还要进行一遍过滤
  return {
    addedLines: addedLines.filter((line) => currentLines.has(line.id)),
    addLineConnections: addLineConnections.filter((line) => currentLines.has(line.id)),
    mergedRemovedLineIds: mergedRemovedLineIds.filter((id) => oldLines.has(id)),
    removedIds,
  };
}

export interface IDeleteService {
  connectionService: IConnectionService;
  collisionService: ICollisionService;
  mapService: IMapHashService;
  stateService: IStateCoreService;
  loggerService: ILoggerService;
  selectService: ISelectService;
  contextMenuService: IContextMenuService;
  cursorService: ICursorService;
  hoverService: IHoverService;
}

export function planDeleteAndMergeWithService(
  {
    connectionService,
    collisionService,
    mapService,
    stateService,
    loggerService,
    selectService,
    contextMenuService,
    cursorService,
    hoverService,
  }: IDeleteService,
) {
  const { value: { data: selected } } = selectService;

  if (selected.size === 0) {
    loggerService.warn(LoggerName, '没有选中元件');
    return false;
  }

  const plan = planDeleteAndMerge(stateService.state.data, selected);

  // 先应用服务层的删除（选中与被合并移除的导线）
  const toRemove = new Set<string>([...plan.removedIds, ...plan.mergedRemovedLineIds]);
  for (const id of toRemove) {
    collisionService.removeEntity(id);
    connectionService.removeDevice(id);
    mapService.removeMark(stateService.getElectronic(id));
  }

  // 应用新增合并导线到服务
  for (const line of plan.addedLines) {
    collisionService.setEntity(line);
    mapService.setMark(line);
  }

  // 变更连接关系
  for (const conn of plan.addLineConnections) {
    if (conn.pin0.length > 0) {
      connectionService.createConnections(conn.id, 0, conn.pin0);
    }
    if (conn.pin1.length > 0) {
      connectionService.createConnections(conn.id, 1, conn.pin1);
    }
  }

  let message = `删除选中元件：${Array.from(selected).join(', ')}`;

  if (plan.addedLines.length > 0) {
    message += `，合并新增导线：${plan.addedLines.map((line) => line.id).join(', ')}`;
  }

  if (plan.mergedRemovedLineIds.length > 0) {
    message += `，合并移除导线：${plan.mergedRemovedLineIds.join(', ')}`;
  }

  // 提交状态
  stateService.commit({
    name: '删除元件',
    description: message,
    patch: (data) => {
      data.parts = data.parts.filter((p) => !toRemove.has(p.id));
      data.lines = data.lines.filter((l) => !toRemove.has(l.id));
      data.lines.push(...plan.addedLines);
    },
  });

  selectService.clear();
  cursorService.clear();
  hoverService.update();
  contextMenuService.close();
}

function isLinePin(data: StructuredData, c: IConnectionData) {
  if (!('lines' in data)) {
    return false;
  }

  const line = data.lines.find((l) => l.id === c.id);
  return Boolean(line) && (c.pin === 0 || c.pin === 1);
}

function findGroupConnections(
  groups: IConnectionData[][],
  pin: IConnectionData,
): IConnectionData[] {
  const group = groups.find((g) => {
    return g.some((c) => c.id === pin.id && c.pin === pin.pin);
  });
  return group ? group.filter((c) => !(c.id === pin.id && c.pin === pin.pin)) : [];
}
