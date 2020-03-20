import {lazy} from 'react';
import modelBinder from './modelBinder';

const lazyConstructor = (pageName: string) => lazy(() => {
  // model可能不存在
  try {
    const model = require(`@page/${pageName}/model`).default;
    modelBinder(model);
  } catch (error) {}
  return import(/* webpackChunkName: "[request]" */ `@page/${pageName}`)
});

export default lazyConstructor;