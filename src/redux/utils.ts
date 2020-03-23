import * as effectsFactory from 'redux-saga/effects';

import { AnyAction, Reducer, combineReducers } from 'redux';
import { IAction, IModel, IReducer, IStore } from './types';

import { IO } from '@redux-saga/symbols'
import { PuttableChannel } from 'redux-saga';

/**
 * makeEffect
 * @param type 
 * @param payload 
 */
const makeEffect = (type: string, payload: { channel?: PuttableChannel<AnyAction>, action: AnyAction }) => ({
  // '@@redux-saga/IO': true,
  [IO]: true,
  combinator: false,
  type,
  payload,
})
/**
 * 合并reducers
 * @param reducers 
 * @param initState 
 * @param namespace
 */
export const mergeReducers = <S = any, A extends AnyAction = IAction>(reducers: IModel<S, A>['reducers'], initState: IModel<S, A>['state'], namespace: IModel<S, A>['namespace']): IReducer<S, A> => {
  return (state = initState, action: IAction) => {
    const actualReducers: IModel['reducers'] = {};
    Object.keys(reducers).forEach(key => {
      actualReducers[`${namespace}/${key}`] = reducers[key];
    });
    return actualReducers[action.type] ? actualReducers[action.type](state, action) : state;
  }
}
/**
 * 合并sagas model内调用put问题
 * @param effects 
 * @param namespace
 */
export const mergeSagas = (effects: IModel['effects'], namespace: IModel['namespace']) => {
  const put: any = function () {
    let channel = arguments[0];
    let action = arguments[1];
    if (!action) {
      action = channel;
      channel = undefined;
    }
    if (action.type.indexOf('/') === -1) {
      action.type = `${namespace}/${action.type}`;
    }
    return makeEffect(effectsFactory.effectTypes.PUT, { channel, action });
  }
  function* rootSaga() {
    const effectKeys = Object.keys(effects);
    for (let i = 0, len = effectKeys.length; i < len; i++) {
      function* worker(action: AnyAction) {
        yield effectsFactory.fork(effects[effectKeys[i]], action, { ...effectsFactory, put });
      }
      yield effectsFactory.takeEvery(`${namespace}/${effectKeys[i]}`, worker);
    }
  }
  return rootSaga;
}
/**
 * 注入异步reducer
 * @param store 
 */
export const injectReducerFactory = (store: IStore) => (key: string, reducer: Reducer) => {
  if (!store.asyncReducer) store.asyncReducer = {};
  if (Reflect.has(store.asyncReducer, key) && store.asyncReducer[key] === reducer) return;
  store.asyncReducer[key] = reducer;
  store.replaceReducer(combineReducers(store.asyncReducer));
}

// 参考Api：redux --> redux-saga --> dva --> Yep ； vue-router路由配置格式：配置型路由； electron：工作需要