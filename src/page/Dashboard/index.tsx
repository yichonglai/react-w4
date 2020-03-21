import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.less';

interface IProps { };
interface IState { };
function Dashboard() {
  return (
    <div className={style.normal}>
      <h1 className={style.title}>Hi！Welcome to Yep!</h1>
      <div className={style.welcome} />
      <ul className={style.list}>
        <li>To get started, edit <code>src/index.tsx</code> and save to reload.</li>
        <li><a href="https://github.com/yichonglai/react-w4/tree/master">Getting Started</a></li>
        <li><Link to='/demo'>To Demo</Link></li>
      </ul>
    </div>
  );
}

export default Dashboard;
