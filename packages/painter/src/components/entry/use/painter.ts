import { useEffect } from 'react';
import { usePainterService } from '../../../context';
import {
  PAINTER_SERVICE,
  MAP_HASH_SERVICE,
  LOGGER_SERVICE,
  COLLISION_SERVICE,
  CONNECTION_SERVICE,
  EVENT_BUS_SERVICE,
} from '../../../types';
import { type PainterProps } from '../../wrapper';

const methods = ['commit', 'undo', 'redo', 'draft', 'dropDraft'] as const;
const propKeys = [
  {
    key: 'parts' as const,
    default: [],
  },
  {
    key: 'lines' as const,
    default: [],
  },
  {
    key: 'canUndo' as const,
    default: false,
  },
  {
    key: 'canRedo' as const,
    default: false,
  },
];

/** 画布参数变化桥接 */
export function usePainterAdapter(props: PainterProps) {
  const painterService = usePainterService(PAINTER_SERVICE);
  const mapService = usePainterService(MAP_HASH_SERVICE);
  const collisionService = usePainterService(COLLISION_SERVICE);
  const logger = usePainterService(LOGGER_SERVICE);
  const connectionService = usePainterService(CONNECTION_SERVICE);
  const eventBus = usePainterService(EVENT_BUS_SERVICE);

  for (const method of methods) {
    useEffect(() => {
      if (painterService) {
        painterService[method] = (props[method] ?? (() => void 0)) as any;
      }
    }, [props[method], painterService]);
  }

  for (const { key, default: defaultVal } of propKeys) {
    useEffect(() => {
      if (painterService) {
        painterService[key].setData(props[key] as any ?? defaultVal);
      }
    }, [props[key], painterService]);
  }

  // 首次进来需要初始化
  useEffect(() => {
    const { parts, lines } = props;
    const { setPartMark, setLineMark } = mapService;

    for (const part of parts ?? []) {
      setPartMark(part);
      collisionService.setEntity(part);
    }

    for (const line of lines ?? []) {
      setLineMark(line);
      collisionService.setEntity(line);
    }

    // 初始化连接关系
    connectionService.createConnectionFromData(props);
    // 初始化完毕
    props.onReady?.();
    // 启动画布
    painterService.isReady.setData(true);
    // 记录日志
    logger.info('画布', '图纸加载完成');
  }, []);

  // 订阅选中事件
  useEffect(() => {
    return eventBus.observe('SelectElectronics', (data) => props?.onSelect?.(data));
  }, [props.onSelect]);
}
