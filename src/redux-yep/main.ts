import { IModel, IStore } from './types';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import { injectReducerFactory, mergeReducers, mergeSagas } from './utils';

import { lazy as tempLazy } from 'react';

let store: IStore | null;
let sagaMiddleware: SagaMiddleware | null;

/**
 * register model
 * @param model
 */
export const register = (model: IModel) => {
  if (store && sagaMiddleware) {
    const { namespace, state, effects, reducers } = model;
    injectReducerFactory(store)(namespace, mergeReducers(reducers, state, namespace));
    sagaMiddleware.run(mergeSagas(effects, namespace));
  } else {
    sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
    const reducer = mergeReducers(model.reducers, model.state, model.namespace);
    store = createStore(
      combineReducers({ [model.namespace]: reducer }),
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    if (!store.asyncReducer) store.asyncReducer = {};
    store.asyncReducer[model.namespace] = reducer;
    sagaMiddleware.run(mergeSagas(model.effects, model.namespace));
  }
  return {
    store,
    sagaMiddleware
  }
}

/**
 * unregister model by namespace
 * @param namespace 
 */
export const unregister = (namespace: string) => {
  console.log('todo:');
}

/**
* async component
* @param pageName 
*/
export const lazy = (pageName: string) => tempLazy(() => {
 const page = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}`).catch(() => null);
 const model = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}/model`).catch(() => null);
 return Promise.all([page(), model()]).then(res => {
   if (res[0]) {
    if (res[1]) {
      const model: IModel = res[1].default || res[1];
      // reset namespace in case of `model.namespace` is empty
      (!model.namespace || !model.namespace.trim()) ? (model.namespace = pageName) : false;
      register(model);
    }
    return res[0];
   }
   return null;
 });
});