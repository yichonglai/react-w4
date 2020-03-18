import {Reducer, Store} from 'redux';

import React from 'react';
import {injectReducerFactory} from './utils';

const HocStore = (key: string, reducer: Reducer, store: Store) => (WrappedComponent: React.ComponentType) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      // reducer inject
      injectReducerFactory(store)(key, reducer);
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return Wrapper;
}

export default HocStore;