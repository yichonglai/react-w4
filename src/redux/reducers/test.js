import { createStore } from 'redux'

// 定义将始终存在于应用程序中的 Reducer
const staticReducers = {
  users: usersReducer,
  posts: postsReducer
}

// Configure the store
export default function configureStore(initialState) {
  const store = createStore(createReducer(), initialState)

  // 添加一个对象以跟踪已注册的异步 Reducer
  store.asyncReducers = {}

  //创建注入 reducer 函数
  // 此函数添加 async reducer，并创建一个新的组合 reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(this.asyncReducers))
  }

  // 返回修改后的 store
  return store
}

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}


// -----------------------------------------------------------------------------


import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getInjectors from './reducerInjectors';

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default ({ key, reducer }) => (WrappedComponent) => {
  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    static displayName = `withReducer(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    injectors = getInjectors(_.get(this.context, 'store'));

    componentWillMount() {
      const { injectReducer } = this.injectors;
      injectReducer(key, reducer);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};

// ---------------------------------------------------------------------------
import createReducer from 'js/redux/reducers';

export function injectReducerFactory(store) {
  return function injectReducer(key, reducer) {
    // Check `store.injectedReducers[key] === reducer` for hot reloading when a key is the same but a reducer is different
    if (
      Reflect.has(store.injectedReducers, key) &&
      store.injectedReducers[key] === reducer
    ) {
      return;
    }

    store.injectedReducers[key] = reducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.injectedReducers));
  };
}

export default function getInjectors(store) {
  return {
    injectReducer: injectReducerFactory(store),
  };
}

