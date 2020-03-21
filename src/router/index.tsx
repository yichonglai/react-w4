import { Route, Router, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import ErrorBoundary from '@components/ErrorBoundary';
import history from './history';

// React16.6 lazy/Suspense 处理异步渲染场景-代码分割/按需加载
const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@page/Dashboard'));
const Demo = lazy(() => import(/* webpackChunkName: "Demo" */ '@page/Demo'));
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@page/NotFound'));
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