import { useEffect } from 'react';
import { usePainterService } from '../../../context';
import { ELECTRONIC_SERVICE_KEY } from '../../../types';
import { type PainterProps } from '../../wrapper';

/** 元件变化桥接 */
export function useElectronicChangeAdapter(props: PainterProps) {
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);

  useEffect(() => {
    if (electronicService) {
      electronicService.lines.setData(props.lines);
    }
  }, [props.lines, electronicService]);

  useEffect(() => {
    if (electronicService) {
      electronicService.parts.setData(props.parts);
    }
  }, [props.parts, electronicService]);

  useEffect(() => {
    if (electronicService) {
      electronicService.updateData = props.onChange ?? (() => void 0);
    }
  }, [props.onChange, electronicService]);
}
