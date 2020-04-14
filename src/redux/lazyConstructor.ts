import { injectReducerFactory, mergeReducers, mergeSagas } from './utils';
import store, { sagaMiddleware } from './index';

import { IModel } from './types';
import { lazy } from 'react';

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
  return Promise.all([page(), model()]).then(res => {
    if (res[1]) {
      const temModel = res[1].default || res[1];
      // 默认命名空间 pageName
      (!temModel.namespace || !temModel.namespace.trim()) ? (temModel.namespace = pageName) : false;
      asyncModel(temModel)
    }
    return res[0];
  });
});

export default lazyConstructor;