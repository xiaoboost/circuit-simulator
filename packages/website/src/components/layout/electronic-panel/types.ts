import {
  ElectronicCategory,
  ElectronicKind,
  ElectronicPrototype,
} from '@circuit/electronics';

export interface CategoryData {
  key: ElectronicCategory;
  title: string;
  components: ComponentData[];
}

export interface ComponentData {
  key: ElectronicKind;
  title: string;
  component: ElectronicPrototype;
}
