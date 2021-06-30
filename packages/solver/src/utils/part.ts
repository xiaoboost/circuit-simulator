import { ElectronicKind } from '@circuit/shared';

interface Part {
  kind: ElectronicKind
}

export function isMeterGnd({ kind }: Part) {
  return (
    kind === ElectronicKind.CurrentMeter ||
    kind === ElectronicKind.VoltageMeter ||
    kind === ElectronicKind.ReferenceGround
  );
}
