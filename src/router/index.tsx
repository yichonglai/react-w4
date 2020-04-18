import { Route, Router, Switch } from 'react-router-dom';
import React, { Suspense } from 'react';

import ErrorBoundary from '@components/ErrorBoundary';
import history from './history';
import { lazy } from '@yep/index';

const Dashboard = lazy('Dashboard');
const Demo = lazy('Demo');
const NotFound = lazy('NotFound');
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