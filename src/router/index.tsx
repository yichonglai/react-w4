import { NavLink, Route, Router, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import ErrorBoundary from '@components/ErrorBoundary';
import history from './history';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@page/Dashboard'));
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@page/NotFound'));
const router = () => {
  return (
    <Router history={history}>
      <ErrorBoundary>
        <NavLink exact to="/" style={{ fontSize: '25px', textDecoration: 'underline' }}>Dashboard</NavLink>
        <NavLink exact to='/page1' style={{ fontSize: '25px', textDecoration: 'underline', margin: '0 10px' }}>Page1</NavLink>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
};

export default router;