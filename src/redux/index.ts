import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { mergeReducers, mergeSagas } from './utils';
import { IStore } from './types';
import model from './model';

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

export default store;