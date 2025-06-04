import { PropertyValue, PropertyDescription } from '@circuit/electronics';
import { PartLabelVisibleKind as Kind } from '../../../../types';

export function getTextLineCount(partLabelVisible: Kind, texts: string[]) {
  if (partLabelVisible === Kind.NotVisible) {
    return 0;
  }

  if (partLabelVisible === Kind.OnlyParam) {
    return texts.length;
  }

  if (partLabelVisible === Kind.OnlyId) {
    return 1;
  }

  return 1 + texts.length;
}

export function propertyToString(val: PropertyValue, property: PropertyDescription): string {
  if ('pre' in val) {
    return `${val.pre}_${val.number}`;
  }
  else if (Array.isArray(val.value)) {
    return val.value.join(',');
  }
  else {
    const rank = 'rank' in val
      ? val.rank === 'u' ? 'μ' : val.rank
      : '';

    if ('unit' in property) {
      return `${val.value}${rank}${property.unit ?? ''}`;
    }
    else {
      return `${val.value}${rank}`;
    }
  }
}
