import {
  ElectronicCategory,
  ElectronicCategoryName,
  ElectronicKind,
  ElectronicName,
  Electronics,
} from '@circuit/electronics';
import { CategoryData } from './types';

export function getCategoryData(filter = ''): CategoryData[] {
  const categories: CategoryData[] = [];
  const keys: ElectronicCategory[] = [
    ElectronicCategory.Passive,
    ElectronicCategory.Power,
    ElectronicCategory.Semiconductor,
    ElectronicCategory.Virtual,
    ElectronicCategory.Meter,
  ];

  for (const key of keys) {
    categories.push({
      key,
      title: ElectronicCategoryName[key],
      components: [],
    });
  }

  for (const [key, value] of Object.entries(Electronics)) {
    const category = categories.find(
      (category) => category.key === value.category,
    );

    if (!category || (filter && !ElectronicName[value.kind].includes(filter))) {
      continue;
    }

    const kind = key as unknown as ElectronicKind;

    category.components.push({
      key: kind,
      title: ElectronicName[kind],
      component: value,
    });
  }

  return categories.filter((category) => category.components.length > 0);
}
