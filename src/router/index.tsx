import { Route, Router, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import ErrorBoundary from '@components/ErrorBoundary';
import history from './history';
import { lazyConstructor } from '@redux/index';

const Dashboard = lazyConstructor('Dashboard');
const Demo = lazyConstructor('Demo');
const NotFound = lazyConstructor('NotFound');
const router = () => {
  return (
    <Router history={history}>
      <ErrorBoundary>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/demo" component={Demo} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
};

export default router;