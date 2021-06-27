import React from 'react';

import { Chart } from '@antv/g2';
import { toScientific } from '@circuit/math';
import { SolverResult } from '@circuit/solver';
import { ElectronicKind } from '@circuit/electronics';
import { useEffect, useRef } from 'react';
import { parts } from 'src/store';
import { isDef } from '@xiao-ai/utils';
import { container as styles, headerHeight } from './styles';

import type { AnyObject } from '@xiao-ai/utils';
import type { AxisCfg, ScaleOption } from '@antv/g2/esm/interface';

export interface Props extends SolverResult {
  oscilloscopes: string[];
}

function find(id: string) {
  return parts.data.find((item) => item.id === id);
}

function hasKind(data: string[], kind: ElectronicKind) {
  return data.some((id) => find(id)?.kind === kind);
}

const timeKey = '_time';
const nameKey = 'name';
const currentKey = 'current';
const voltageKey = 'voltage';

export function Oscilloscope(props: Props) {
  const chartRef = useRef<Chart>();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasVoltage = hasKind(props.oscilloscopes, ElectronicKind.VoltageMeter);
  const hasCurrent = hasKind(props.oscilloscopes, ElectronicKind.CurrentMeter);

  useEffect(() => {
    if (containerRef.current && !chartRef.current) {
      const right = (hasVoltage && hasCurrent) ? 80 : 30;

      chartRef.current = new Chart({
        height: window.innerHeight - headerHeight,
        container: containerRef.current,
        autoFit: true,
        padding: [40, right, 40, 50],
      });

      setChart();
      chartRef.current.render(false);
    }
  }, [containerRef.current]);

  function getSourceData() {
    const metersData = props.oscilloscopes
      .map((id) => {
        const meter = props.meters.find((meter) => meter.id === id);

        if (!meter) {
          return;
        }

        const part = find(meter.id)!;
        const prop = part.kind === ElectronicKind.VoltageMeter ? voltageKey : currentKey;

        return props.times.map((time, index) => ({
          [timeKey]: time,
          [nameKey]: meter.id,
          [prop]: meter.data[index],
        }));
      })
      .filter(isDef);

    return metersData.reduce((ans, data) => ans.concat(data), []);
  }

  function getAxiosConfig() {
    const option: Array<[string, AxisCfg]> = [];
    const baseCfg: AxisCfg = {
      grid: {
        line: {
          style: {
            fill: '#efefef',
            stroke: '#aaa',
            lineDash: [3, 4],
          },
        },
      },
      label: {
        style: {
          fill: '#888',
        },
      },
    };

    option.push([timeKey, baseCfg]);

    if (hasCurrent) {
      option.push([voltageKey, baseCfg]);
    }

    if (hasVoltage) {
      option.push([currentKey, baseCfg]);
    }

    return option;
  }

  function getScaleConfig() {
    const option: AnyObject<ScaleOption> = {};

    function formatter(unit: string) {
      return (num: number) => `${toScientific(num)}${unit}`;
    }

    option[timeKey] = {
      type: 'linear',
      alias: '时间',
      min: 0,
      max: props.times[props.times.length - 1],
      tickCount: 11,
      formatter: formatter('s'),
    };

    if (hasVoltage) {
      option[voltageKey] = {
        // alias: '电压',
        type: 'linear',
        formatter: formatter('V'),
      };
    }

    if (hasCurrent) {
      option[currentKey] = {
        // alias: '电流',
        type: 'linear',
        formatter: formatter('A'),
      };
    }

    return option;
  }

  function setChart() {
    if (!chartRef.current) {
      return;
    }

    const { current: chart } = chartRef;
    const axiosCfg = getAxiosConfig();

    chart.data(getSourceData());
    chart.scale(getScaleConfig());
    axiosCfg.forEach((item) => chart.axis(...item));

    chart.tooltip({
      follow: true,
      offset: 18,
      shared: true,
      showCrosshairs: true,
    });

    chart.legend(nameKey, {
      layout: 'horizontal',
      position: 'left-top',
      offsetY: 4,
      offsetX: 20,
      animate: true,
    });

    if (hasVoltage) {
      chart.line().position(`${timeKey}*${voltageKey}`).color(nameKey);
    }

    if (hasCurrent) {
      chart.line().position(`${timeKey}*${currentKey}`).color(nameKey);
    }
  }

  return <div className={styles.main} ref={containerRef} />;
}
