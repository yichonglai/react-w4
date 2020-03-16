import React from 'react';
import {connect} from 'react-redux';
import style from './index.less';

interface DashboardProps {
  count: any;
};
interface DashboardState { };
class Dashboard extends React.PureComponent<DashboardProps & DispatchProp, DashboardState> {
  increment = () => {
    const {dispatch} = this.props;
    dispatch({type: 'INCREMENT'});
  }

  render() {
    console.log(this.props);
    return (
      <div className={style.root}>
        <button onClick={this.increment}>Increment</button>
        {this.props.count.demo.count}
      </div>
    );
  }
}

export default connect((state) => ({count: state}))(Dashboard);