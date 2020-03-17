import {DispatchProp, connect} from 'react-redux';

import React from 'react';
import style from './index.less';

interface IProps {
  count: number;
};
interface IState { };
class Dashboard extends React.PureComponent<IProps & DispatchProp, IState> {
  increment = () => {
    const {dispatch, count} = this.props;
    // 需要一个action生成器 - action creator
    dispatch({type: 'INCREMENT'})
  }

  render() {
    const {count} = this.props;
    console.log(this.props);
    return (
      <div className={style.root}>
        <button onClick={this.increment}>Increment</button>
        {count}
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => IProps = state => {
  return {
    count: state.demo.count
  };
};

export default connect(mapStateToProps)(Dashboard);