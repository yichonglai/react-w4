import React, {lazy} from 'react';

import {RouteComponentProps} from 'react-router-dom';

export interface IConfig {
  path?: string | string[];
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  children?: IConfig[];
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
}
const config: IConfig[] =  [
  {
    path: '/',
    component: lazy(() => import(/* webpackChunkName: "Dashboard" */ '@page/Dashboard')),
    exact: true,
  },
  {
    path: '/demo',
    component: lazy(() => import(/* webpackChunkName: "Demo" */ '@page/Demo')),
    exact: true,
  },
  {
    component: lazy(() => import(/* webpackChunkName: "NotFound" */ '@page/NotFound')),
  },
];

export default config;