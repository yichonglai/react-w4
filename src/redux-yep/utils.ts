import * as effectsFactory from 'redux-saga/effects';

import { AnyAction, Reducer, combineReducers } from 'redux';
import { IAction, IModel, IReducer, IStore, IeffectType } from './types';

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
export const mergeReducers = <S = any, A extends AnyAction = IAction>(reducers: IModel<S, A>['reducers'] = {}, initState: IModel<S, A>['state'], namespace: IModel<S, A>['namespace']): IReducer<S, A> => {
  return (state = initState, action: IAction) => {
    const actualReducers: IModel['reducers'] = {};
    Object.keys(reducers).forEach(key => {
      actualReducers[`${namespace}/${key}`] = reducers[key];
    });
    // effects loading reducer
    actualReducers[`${namespace}/@@start`] = (state, action) => ({ ...state, loading: { ...state.loading, [action.payload]: true } });
    actualReducers[`${namespace}/@@end`] = (state, action) => ({ ...state, loading: { ...state.loading, [action.payload]: false } });
    return actualReducers[action.type] ? actualReducers[action.type](state, action) : state;
  }
}
/**
 * 合并sagas model内调用put问题 TODO:put方法优化
 * @param effects 
 * @param namespace
 */
export const mergeSagas = (effects: IModel['effects'] = {}, namespace: IModel['namespace']) => {
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
      const effectItem = effects[effectKeys[i]];
      const worker = function*(action: AnyAction) {
        if (typeof effectItem === 'function') {
          yield effectsFactory.call(effectItem, action, { ...effectsFactory, put });
        } else if (typeof effectItem === 'object') {
          const { loading = false } = effectItem;
          if (loading) {
            let loadingKey = effectKeys[i];
            if (typeof loading === 'string') {
              loadingKey = loading
            }
            try {
              yield effectsFactory.put({ type: `${namespace}/@@start`, payload: loadingKey });
              yield effectsFactory.call(effectItem.worker, action, { ...effectsFactory, put });
              yield effectsFactory.put({ type: `${namespace}/@@end`, payload: loadingKey });
            } catch (error) {
              yield effectsFactory.put({ type: `${namespace}/@@end`, payload: loadingKey });
            }
          } else {
            yield effectsFactory.call(effectItem.worker, action, { ...effectsFactory, put });
          }
        }
      }
      let effectType: IeffectType = 'takeEvery';
      let ms = 0;
      if (typeof effectItem === 'object' && effectItem.type) {
        effectType = effectItem.type;
        ms = effectItem.ms || 0;
      }
      if (effectType === 'throttle') {
        yield effectsFactory[effectType](ms, `${namespace}/${effectKeys[i]}`, worker);
      } else {
        yield effectsFactory[effectType](`${namespace}/${effectKeys[i]}`, worker);
      }
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

// 参考Api：redux --> redux-saga --> dva --> Yep 