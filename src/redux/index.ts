import { lazy } from 'react';
import { Store, AnyAction, Reducer, applyMiddleware, compose, createStore, combineReducers } from 'redux';
import * as effectsFactory from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { IModel, IStore } from './types';
import model from './model';

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
// export const putFactory = (namespace: IModel['namespace']) => {
//   const put: typeof effectsFactory.put = () => {
//     if ([1]) {

//     } else {

//     }
//     // if (action.type.indexof('/') === -1) {

//     //   // return effectsFactory.put({...action, type: `${namespace}/${action.type}`});
//     // } else {
//     //   // return effectsFactory.put(action);
//     // }
//   }
// }
/**
 * 合并sagas
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
/**
 * 初始化redux
 */
export const sagaMiddleware = createSagaMiddleware();
// redux开发工具https://blog.csdn.net/achenyuan/article/details/80884895
const composeEnhancers = process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const defaultReducer = mergeReducers(model.reducers, model.state, model.namespace);
const store: IStore = createStore(
  combineReducers({ [model.namespace]: defaultReducer }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

if (!store.asyncReducer) store.asyncReducer = {};
store.asyncReducer[model.namespace] = defaultReducer;
sagaMiddleware.run(mergeSagas(model.effects, model.namespace));
/**
 * 异步数据模型绑定
 * @param model 
 */
export const asyncModel = (model: IModel) => {
  const { namespace, state, effects, reducers } = model;
  injectReducerFactory(store)(namespace, mergeReducers(reducers, state, namespace));
  sagaMiddleware.run(mergeSagas(effects, namespace));
}
/**
 * 异步组件构造器
 * @param pageName 
 */
export const lazyConstructor = (pageName: string) => lazy(() => {
  const page = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}`);
  const model = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}/model`).catch(() => null);
  return Promise.all([page(), model()]).then(ret => {
    ret[1] && asyncModel(ret[1].default || ret[1]);
    return ret[0];
  });
});

export default store;