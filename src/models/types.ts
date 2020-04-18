import { IdefaultState } from '@yep/index';
/**
 * root state tree
 */
export interface RootState<S extends IdefaultState = IdefaultState> {
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
