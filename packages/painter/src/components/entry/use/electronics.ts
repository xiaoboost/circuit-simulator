import { useEffect } from 'react';
import { usePainterService } from '../../../context';
import { ELECTRONIC_SERVICE_KEY, MAP_SERVICE_KEY } from '../../../types';
import { type PainterProps } from '../../wrapper';

/** 元件变化桥接 */
export function useElectronicChangeAdapter(props: PainterProps) {
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
  const mapService = usePainterService(MAP_SERVICE_KEY);

  useEffect(() => {
    if (electronicService) {
      electronicService.updateData = props.onChange ?? (() => void 0);
    }
  }, [props.onChange, electronicService]);

  useEffect(() => {
    if (electronicService) {
      electronicService.parts.setData(props.parts);
    }
  }, [props.parts, electronicService]);

  useEffect(() => {
    if (electronicService) {
      electronicService.lines.setData(props.lines);
    }
  }, [props.lines, electronicService]);

  // 首次进来需要初始化
  useEffect(() => {
    const { parts, lines } = props;
    const { setPartMark, setLineMark } = mapService;

    for (const part of parts) {
      setPartMark(part);
    }

    for (const line of lines) {
      setLineMark(line);
    }
  }, []);
}
