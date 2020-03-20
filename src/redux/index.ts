import { Store, applyMiddleware, compose, createStore } from 'redux';

import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

export const sagaMiddleware = createSagaMiddleware();
// redux开发工具https://blog.csdn.net/achenyuan/article/details/80884895
const composeEnhancers = process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

const store: Store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(sagas);

export default store;