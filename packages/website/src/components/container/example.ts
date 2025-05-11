import { Direction } from '@circuit/algorithm';
import { PartStructuredData, LineStructuredData, ElectronicKind } from '@circuit/electronics';

export const parts: PartStructuredData[] = [
  {
    kind: ElectronicKind.Diode,
    id: 'VD_1',
    position: [700, 200],
    rotate: [[1, 0], [0, 1]],
    params: ['1', '0.5', '0.2G'],
  },
  {
    kind: ElectronicKind.Diode,
    id: 'VD_2',
    position: [780, 200],
    rotate: [[1, 0], [0, 1]],
    params: ['1', '0.5', '0.2G'],
  },
  {
    kind: ElectronicKind.Diode,
    id: 'VD_3',
    position: [700, 440],
    rotate: [[1, 0], [0, 1]],
    params: ['1', '0.5', '0.2G'],
  },
  {
    kind: ElectronicKind.Diode,
    id: 'VD_4',
    position: [780, 440],
    rotate: [[1, 0], [0, 1]],
    params: ['1', '0.5', '0.2G'],
  },
  {
    kind: ElectronicKind.AcVoltageSource,
    id: 'V_1',
    position: [580, 320],
    rotate: [[1, 0], [0, 1]],
    params: ['220', '200', '0', '0'],
    textDirection: Direction.Left,
  },
  {
    kind: ElectronicKind.Capacitor,
    id: 'C_1',
    position: [900, 320],
    rotate: [[0, 1], [-1, 0]],
    params: ['100u'],
    textDirection: Direction.Left,
    connections: [],
  },
  {
    kind: ElectronicKind.Resistance,
    id: 'R_1',
    position: [960, 320],
    rotate: [[0, 1], [-1, 0]],
    params: ['2k'],
    text: 'Right',
  },
  {
    kind: ElectronicKind.CurrentMeter,
    id: 'I_out',
    position: [840, 140],
    rotate: [[1, 0], [0, 1]],
  },
  {
    kind: ElectronicKind.VoltageMeter,
    id: 'V_out',
    position: [1040, 320],
    rotate: [[1, 0], [0, 1]],
    text: 'Right',
  },
  {
    kind: ElectronicKind.VoltageMeter,
    id: 'V_in',
    position: [640, 320],
    rotate: [[1, 0], [0, 1]],
    text: 'Right',
  },
  {
    kind: ElectronicKind.ReferenceGround,
    id: 'GND_1',
    position: [700, 540],
    rotate: [[1, 0], [0, 1]],
  },
] as any[];

export const lines: LineStructuredData[] = [
  {
    id: 'L_1',
    kind: ElectronicKind.Line,
    path: [[580, 280], [580, 260], [640, 260]],
  },
  {
    id: 'L_2',
    kind: ElectronicKind.Line,
    path: [[580, 360], [580, 380], [640, 380]],
  },
  {
    id: 'L_3',
    kind: ElectronicKind.Line,
    path: [[700, 160], [700, 140], [780, 140]],
  },
  {
    id: 'L_4',
    kind: ElectronicKind.Line,
    path: [[1040, 280], [1040, 140], [960, 140]],
  },
  {
    id: 'L_5',
    kind: ElectronicKind.Line,
    path: [[1040, 360], [1040, 500], [960, 500]],
  },
  {
    id: 'L_6',
    kind: ElectronicKind.Line,
    path: [[780, 240], [780, 380]],
  },
  {
    id: 'L_7',
    kind: ElectronicKind.Line,
    path: [[780, 380], [780, 400]],
  },
  {
    id: 'L_8',
    kind: ElectronicKind.Line,
    path: [[700, 400], [700, 260]],
  },
  {
    id: 'L_9',
    kind: ElectronicKind.Line,
    path: [[700, 260], [700, 240]],
  },
  {
    id: 'L_10',
    kind: ElectronicKind.Line,
    path: [[960, 280], [960, 140]],
  },
  {
    id: 'L_11',
    kind: ElectronicKind.Line,
    path: [[780, 480], [780, 500]],
  },
  {
    id: 'L_12',
    kind: ElectronicKind.Line,
    path: [[700, 480], [700, 500]],
  },
  {
    id: 'L_13',
    kind: ElectronicKind.Line,
    path: [[780, 500], [900, 500]],
  },
  {
    id: 'L_14',
    kind: ElectronicKind.Line,
    path: [[960, 360], [960, 500]],
  },
  {
    id: 'L_15',
    kind: ElectronicKind.Line,
    path: [[900, 360], [900, 500]],
  },
  {
    id: 'L_16',
    kind: ElectronicKind.Line,
    path: [[860, 140], [900, 140]],
  },
  {
    id: 'L_17',
    kind: ElectronicKind.Line,
    path: [[900, 280], [900, 140]],
  },
  {
    id: 'L_18',
    kind: ElectronicKind.Line,
    path: [[820, 140], [780, 140]],
  },
  {
    id: 'L_19',
    kind: ElectronicKind.Line,
    path: [[780, 140], [780, 160]],
  },
  {
    id: 'L_20',
    kind: ElectronicKind.Line,
    path: [[960, 140], [900, 140]],
  },
  {
    id: 'L_21',
    kind: ElectronicKind.Line,
    path: [[960, 500], [900, 500]],
  },
  {
    id: 'L_22',
    kind: ElectronicKind.Line,
    path: [[640, 280], [640, 260]],
  },
  {
    id: 'L_23',
    kind: ElectronicKind.Line,
    path: [[640, 260], [700, 260]],
  },
  {
    id: 'L_24',
    kind: ElectronicKind.Line,
    path: [[640, 360], [640, 380]],
  },
  {
    id: 'L_25',
    kind: ElectronicKind.Line,
    path: [[640, 380], [780, 380]],
  },
  {
    id: 'L_26',
    kind: ElectronicKind.Line,
    path: [[700, 520], [700, 500]],
  },
  {
    id: 'L_27',
    kind: ElectronicKind.Line,
    path: [[700, 500], [780, 500]],
  },
  {
    id: 'L_28',
    kind: ElectronicKind.Line,
    path: [[1000, 420], [1080, 420], [1080, 500]],
  },
] as any[];
