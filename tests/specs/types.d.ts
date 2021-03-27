import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';

export type WrapperElement<T> = Omit<Wrapper<Vue>, 'element'> & { element: T };
