import { AnyAction, Reducer, Store } from 'redux';
import * as effectsFactory from 'redux-saga/effects';
import { Saga } from 'redux-saga';

export type IReducer<S = any, A = AnyAction> = (
  state: S,
  action: A
) => S
export interface IModel<S = any> {
  namespace: string;
  state: S;
  effects: { [effect: string]: Saga<[AnyAction, typeof effectsFactory]> },
  reducers: { [reducer: string]: IReducer<S> }
}

export type IAction = AnyAction & { payload: any };
export type IStore = Store & { asyncReducer?: { [key: string]: Reducer } }
