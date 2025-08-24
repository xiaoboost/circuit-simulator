export default [
  {
    name: '桥式整流',
    key: 'bridge-rectifier',
    data: () => import('@circuit/examples/bridge-rectifier').then((m) => m.data),
  },
  {
    name: '射极跟随器',
    key: 'emitter-follower',
    data: () => import('@circuit/examples/emitter-follower').then((m) => m.data),
  },
  {
    name: '共射放大器',
    key: 'common-emitter-amplifier',
    data: () => import('@circuit/examples/common-emitter-amplifier').then((m) => m.data),
  },
  {
    name: '一阶直流电路',
    key: 'first-order-dc',
    data: () => import('@circuit/examples/first-order-dc').then((m) => m.data),
  },
  {
    name: '半波整流器',
    key: 'half-wave-rectifier',
    data: () => import('@circuit/examples/half-wave-rectifier').then((m) => m.data),
  },
  {
    name: '电流放大器',
    key: 'current-amplifier',
    data: () => import('@circuit/examples/current-amplifier').then((m) => m.data),
  },
  {
    name: '一阶交流电路',
    key: 'first-order-ac',
    data: () => import('@circuit/examples/first-order-ac').then((m) => m.data),
  },
  {
    name: '相位放大器',
    key: 'phase-amplifier',
    data: () => import('@circuit/examples/phase-amplifier').then((m) => m.data),
  },
  {
    name: '电阻桥',
    key: 'resistance-bridge',
    data: () => import('@circuit/examples/resistance-bridge').then((m) => m.data),
  },
  {
    name: '电阻串联',
    key: 'resistance-series',
    data: () => import('@circuit/examples/resistance-series').then((m) => m.data),
  },
];
