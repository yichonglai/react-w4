import { Reducer, Store, combineReducers } from 'redux';

// export const createReducer = (reducerObj: {[key: string]: Reducer}) => combineReducers({...reducerObj});

export const injectReducerFactory = (store: Store & { asyncReducer?: { [key: string]: Reducer } }) => (key: string, reducer: Reducer) => {
  if (!store.asyncReducer) store.asyncReducer = {};
  if (Reflect.has(store.asyncReducer, key) && store.asyncReducer[key] === reducer) return;
  store.asyncReducer[key] = reducer;
  store.replaceReducer(combineReducers(store.asyncReducer));
}
