import store, {sagaMiddleware} from '@redux/index';

import {IModel} from '@redux/types';
import {injectReducerFactory} from './injectReducerFactory';

const binder = (model: IModel) => {
  const {namespace, state, effects, reducers} = model;
  // injectReducerFactory(store)(namespace, )
  console.log(model);
  
}

export default binder;