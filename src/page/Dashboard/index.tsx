import React from 'react';
import style from './index.less';
import { Button } from 'antd';

interface DashboardProps { };
interface DashboardState { };
class Dashboard extends React.PureComponent<DashboardProps, DashboardState> {
  render() {
    return <div className={style.root}>
      Dashboard
      <Button type='primary'>预览按钮</Button>
    </div>;
  }
}

export default Dashboard;