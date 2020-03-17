import React from 'react';
import style from './index.less';

interface DashboardProps { };
interface DashboardState { };
class Dashboard extends React.PureComponent<DashboardProps, DashboardState> {
  render() {
    return <div className={style.root}>Dashboard</div>;
  }
}

export default Dashboard;