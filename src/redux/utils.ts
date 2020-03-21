import { AnyAction, Reducer, combineReducers } from 'redux';
import * as effectsFactory from 'redux-saga/effects';
import { IModel, IStore } from './types';

/**
 * 合并reducers
 * @param reducers 
 * @param initState 
 * @param namespace
 */
export const mergeReducers = (reducers: IModel['reducers'], initState: IModel['state'], namespace: IModel['namespace']) => {
  return (state = initState, action: AnyAction) => {
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
  function* rootSaga() {
    const effectKeys = Object.keys(effects);
    // // 得重构
    // const put: typeof effectsFactory.put = (a, b) => {
    //   const args = arguments;
    //   if (args[1]) {
    //     if (args[1].type.indexof('/') === -1) {
    //       return effectsFactory.put(args[0], {...args[1], type: `${namespace}/${args[1].type}`});
    //     }
    //     return effectsFactory.put(args[0], args[1]);
    //   } else {
    //     if (args[0].type.indexof('/') === -1) {
    //       return effectsFactory.put({ ...args[0], type: `${namespace}/${args[0].type}` });
    //     }
    //     return effectsFactory.put(args[0]);
    //   }
    // }

    for (let i = 0, len = effectKeys.length; i < len; i++) {
      function* worker(action: AnyAction) {
        yield effectsFactory.fork(effects[effectKeys[i]], action, effectsFactory);
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

