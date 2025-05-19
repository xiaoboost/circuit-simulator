import { useEffect } from 'react';
import { usePainterService } from '../../../context';
import { PAINTER_SERVICE_KEY, MAP_SERVICE_KEY, LOGGER_SERVICE } from '../../../types';
import { type PainterProps } from '../../wrapper';

const methods = ['commit', 'undo', 'redo'] as const;
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
  const painterService = usePainterService(PAINTER_SERVICE_KEY);
  const mapService = usePainterService(MAP_SERVICE_KEY);
  const logger = usePainterService(LOGGER_SERVICE);

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
    }

    for (const line of lines ?? []) {
      setLineMark(line);
    }

    // 初始化完毕
    props.onReady?.();
    // 启动画布
    painterService.isReady.setData(true);
    // 记录日志
    logger.info('Painter', '图纸加载完成');
  }, []);
}
