export default [
  {
    name: '桥式整流',
    key: 'bridge-rectifier',
    data: () => import('@circuit/examples/bridge-rectifier').then((m) => m.data),
  },
];
