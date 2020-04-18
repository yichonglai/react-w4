import { Istate } from '@yep/index';
/**
 * root state tree
 */
export interface RootState<S = Istate> {
  global: S & {
    count: number;
    platformName: string;
  },
  demo: S & {
    list: number[];
  },
  dashboard: S & {
    data: number[];
  }
}
