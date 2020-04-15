import * as effects from 'redux-saga/effects';

import { AnyAction, Reducer, Store } from 'redux';

import { Saga } from 'redux-saga';

export type IAction = AnyAction & { payload?: any };
export type IStore = Store & { asyncReducer?: { [key: string]: Reducer } };
export type IReducer<S = any, A = IAction> = (
  state: S,
  action: A
) => S
export interface IdefaultState {
  loading?: { [key: string]: boolean }
}
export type IeffectType = 'takeEvery' | 'takeLeading' | 'takeLatest' | 'throttle';
export type Ieffect<A = IAction, E = typeof effects> = {
  type?: IeffectType;
  /**throttle */
  ms?: number;
  loading?: string | boolean;
  worker: Saga<[A, E]>
} | Saga<[A, E]>
export interface IModel<S = any, A = IAction> {
  namespace: string;
  state: S;
  effects?: { [effect: string]: Ieffect<A> },
  reducers?: { [reducer: string]: IReducer<S> }
}

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
