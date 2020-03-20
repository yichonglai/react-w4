import { AnyAction, Reducer } from 'redux';

import {Saga} from 'redux-saga';

export interface IModel<S = any> {
  namespace: string;
  state: S;
  effects: {[effect: string]: Saga},
  // reducers: {[reducer: string]: Reducer<S, AnyAction>}
  reducers: {[reducer: string]: Reducer}
}

export type IAction = AnyAction & {payload: any}; 