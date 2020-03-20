import store, { sagaMiddleware } from '@redux/index';

import { IModel } from '@redux/types';
import { AnyAction } from 'redux';
import * as effectsFactory from 'redux-saga/effects';
import { injectReducerFactory } from './injectReducerFactory';

const createReducer = (reducers: IModel['reducers'], initState: IModel['state']) => {
  return (state = initState, action: AnyAction) => {
    return reducers[action.type] ? reducers[action.type](state, action) : state;
  }
}
const createSaga = (effects: IModel['effects']) => {
  function* rootSaga() {
    const actionTypes = Object.keys(effects);
    for (let i = 0, len = actionTypes.length; i < len; i++) {
      function* worker(action: AnyAction) {
        yield effectsFactory.fork(effects[actionTypes[i]], action, effectsFactory);
      }
      yield effectsFactory.takeEvery(actionTypes[i], worker)
    }
  }
  return rootSaga;
}

export default (model: IModel) => {
  const { namespace, state, effects, reducers } = model;
  injectReducerFactory(store)(namespace, createReducer(reducers, state));
  sagaMiddleware.run(createSaga(effects));
}
