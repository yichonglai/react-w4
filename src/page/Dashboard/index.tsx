import React from 'react';
import style from './index.less';

interface IProps { };
interface IState { };
class Dashboard extends React.PureComponent<IProps, IState> {
  render() {
    return <div className={style.root}>Dashboard</div>;
  }
}

export default Dashboard;