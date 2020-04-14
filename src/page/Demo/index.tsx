import { DispatchProp, connect } from 'react-redux';

import React from 'react';
import { ReduxState } from '@redux/types';

interface IProps {
  list: number[];
};
class Demo extends React.PureComponent<IProps & DispatchProp> {
  increment = () => {
    const { dispatch } = this.props;
    // 需要一个action生成器 - action creator
    dispatch({ type: 'demo/push_async', payload: Math.floor(Math.random() * 100) });
  }
  render() {
    const { list } = this.props;
    return (
      <div>
        <button style={{ marginRight: '10px' }} onClick={this.increment}>Increment_async</button>
        {JSON.stringify(list)}
      </div>
    );
  }
}

const mapStateToProps: (state: ReduxState) => IProps = state => {
  return {
    list: state.demo.list
  };
};
export default connect(mapStateToProps)(Demo);