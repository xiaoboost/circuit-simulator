import React from 'react';

import { Tooltip } from 'antd';
import { part } from './styles';
import { Panel } from './components/panel';
import { PartComponent } from 'src/components/electronics';
import { Electronics, ElectronicPrototype, ElectronicKind } from '@circuit/electronics';

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
      ? `translate(40,40) ${transform[type]}`
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

export interface AddPartProps {
  onClose(): void;
}

export function AddPart(props: AddPartProps) {
  const create = (kind: ElectronicKind) => {
    new PartComponent(kind).create();
  };

  return (
    <Panel
      title='添加器件'
      subtitle='Add Parts'
      onClose={props.onClose}
    >
      {categories.map((item, i) => (
        <div key={i} className={part.list}>
          {item.parts.map((kind, i) => (
            <Tooltip key={i} placement='top' title={ Electronics[kind].introduction }>
              <span
                className={part.item}
                onClick={() => create(kind)}>
                <svg x="0px" y="0px" viewBox="0 0 80 80">
                  <PartShape {...Electronics[kind]} />
                </svg>
              </span>
            </Tooltip>
          ))}
        </div>
      ))}
    </Panel>
  );
}
