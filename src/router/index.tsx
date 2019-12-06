import { NavLink, Route, Router, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import ErrorBoundary from '@components/ErrorBoundary';
import history from './history';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '@page/Dashboard'));
const Demo = lazy(() => import(/* webpackChunkName: "Demo" */ '@page/Demo'));
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@page/NotFound'));
const router = () => {
  return (
    <Router history={history}>
      <ErrorBoundary>
        <NavLink exact to="/" style={{ fontSize: '25px', textDecoration: "underline", }}>Dashboard</NavLink>
        <NavLink exact to="/demo" style={{ fontSize: '25px', margin: '0 10px', textDecoration: "underline", }}>Demo</NavLink>
        <NavLink exact to='/page1' style={{ fontSize: '25px', textDecoration: 'underline', }}>Page1</NavLink>
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