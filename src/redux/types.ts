import * as effects from 'redux-saga/effects';

import { AnyAction, Reducer, Store } from 'redux';

import { Saga } from 'redux-saga';

export type IAction = AnyAction & { payload?: any };
export type IStore = Store & { asyncReducer?: { [key: string]: Reducer } };
export type IReducer<S = any, A = IAction> = (
  state: S,
  action: A
) => S
export interface IModel<S = any, A = IAction> {
  namespace: string;
  state: S;
  effects: { [effect: string]: Saga<[A, typeof effects]> },
  reducers: { [reducer: string]: IReducer<S> }
}

/**
 * redux state tree
 */
export interface ReduxState {
  global: {
    count: number;
    platformName: string;
  },
  demo: {
    list: number[];
  }
}
