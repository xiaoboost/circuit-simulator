import { useEffect } from 'react';
import { usePainterService } from '../../../context';
import { ELECTRONIC_SERVICE_KEY } from '../../../types';
import { type PainterProps } from '../../wrapper';

/** 元件变化桥接 */
export function useElectronicChangeAdapter(props: PainterProps) {
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);

  useEffect(() => {
    electronicService?.lines.setData(props.lines);
  }, [props.lines]);

  useEffect(() => {
    electronicService?.parts.setData(props.parts);
  }, [props.parts]);
}
