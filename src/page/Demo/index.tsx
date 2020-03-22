import { DispatchProp, connect } from 'react-redux';

import React from 'react';

interface IProps {
  count: number;
};
interface IState { };
class Demo extends React.PureComponent<IProps & DispatchProp, IState> {
  increment = () => {
    const { dispatch } = this.props;
    // 需要一个action生成器 - action creator
    dispatch({ type: 'global/increment_async', payload: 2 });
  }
  render() {
    const { count } = this.props;
    return (
      <div>
        <button onClick={this.increment}>Increment_async</button>
        {count}
      </div>
    );
  }
}

const mapStateToProps: (state: any) => IProps = state => {
  return {
    count: state.global.count
  };
};
export default connect(mapStateToProps)(Demo);