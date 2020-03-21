import { lazy } from 'react';
import { mergeReducers, mergeSagas, injectReducerFactory } from './utils';
import store, { sagaMiddleware } from './index';
import { IModel } from './types';

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
const lazyConstructor = (pageName: string) => lazy(() => {
  const page = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}`);
  const model = () => import(/* webpackChunkName: "[request]" */ `@page/${pageName}/model`).catch(() => null);
  return Promise.all([page(), model()]).then(ret => {
    ret[1] && asyncModel(ret[1].default || ret[1]);
    return ret[0];
  });
});

export default lazyConstructor;