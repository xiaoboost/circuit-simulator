import { useCallback, useEffect } from 'react';
import type { DrawEventBusInitParam } from './types';
import { sheetEl } from './constant';

const mousemove: DrawEventBusInitParam['mousemove'] = (event) => {

};

const enterLine: DrawEventBusInitParam['enterLine'] = (id) => {

};

const enterPart: DrawEventBusInitParam['enterPart'] = (id) => {

};

const leaveLine: DrawEventBusInitParam['leaveLine'] = (id) => {

};

const leavePart: DrawEventBusInitParam['leavePart'] = (id) => {

};

export function useDrawEventBusInit(): DrawEventBusInitParam {
  return {
    mousemove,
    enterLine,
    enterPart,
    leaveLine,
    leavePart,
  };
}
