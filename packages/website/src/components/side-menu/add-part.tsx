import React from 'react';

import { Tooltip } from 'antd';
import { part } from './styles';
import { Panel } from './components/panel';
import { Sheet } from '../../store';
import { Electronics, ElectronicPrototype, ElectronicKind, Part } from '@circuit/electronics';

interface Category {
  name: string;
  parts: ElectronicKind[];
}

const categories: Category[] = [
  {
    name: '虚拟器件',
    parts: [
      ElectronicKind.ReferenceGround,
      ElectronicKind.VoltageMeter,
      ElectronicKind.CurrentMeter,
    ],
  },
  {
    name: '电源',
    parts: [
      ElectronicKind.DcVoltageSource,
      ElectronicKind.AcVoltageSource,
      ElectronicKind.DcCurrentSource,
    ],
  },
  {
    name: '无源器件',
    parts: [
      ElectronicKind.Resistance,
      ElectronicKind.Capacitor,
      ElectronicKind.Inductance,
    ],
  },
  {
    name: '半导体器件',
    parts: [
      ElectronicKind.Diode,
      ElectronicKind.TransistorNPN,
      ElectronicKind.OperationalAmplifier,
    ],
  },
];

function PartShape({ shape, kind }: ElectronicPrototype) {
  // 器件位置修正
  const transform = {
    [ElectronicKind.CurrentMeter]: 'scale(1.2, 1.2)',
    [ElectronicKind.ReferenceGround]: 'scale(1.2, 1.2) translate(0, 5)',
    [ElectronicKind.TransistorNPN]: 'translate(-5, 0)',
  };
  // 生成修正函数
  const fixElementShape = (type: ElectronicKind) => ({
    transform: transform.hasOwnProperty(type)
      ? `translate(40,40) ${transform[type as keyof typeof transform]}`
      : 'translate(40,40)',
  });

  return <g {...fixElementShape(kind)}>
    {shape.map((dom, i) => (
      React.createElement(dom.name, {
        key: i,
        ...dom.attribute,
      })
    ))}
  </g>;
}

export function AddPart() {
  const create = (kind: ElectronicKind) => {
    Sheet.parts.setData(Sheet.parts.data.concat(new Part(kind)));
  };

  return (
    <Panel title='添加器件' subtitle='Add Parts'>
      {categories.map((item, i) => (
        <div key={i} className={part.category}>
          <div className={part.categoryName}>{item.name}</div>
          <div className={part.categoryList}>
            {item.parts.map((kind, i) => (
              <Tooltip key={i} placement='top' title={ Electronics[kind].introduction } destroyTooltipOnHide>
                <span
                  className={part.item}
                  onMouseDown={() => create(kind)}>
                  <svg x="0px" y="0px" viewBox="0 0 80 80">
                    <PartShape {...Electronics[kind]} />
                  </svg>
                </span>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </Panel>
  );
}
