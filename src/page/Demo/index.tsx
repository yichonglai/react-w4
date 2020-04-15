import { DispatchProp, connect } from 'react-redux';

import React from 'react';
import { RootState } from '@redux/types';

interface IProps {
  list: number[];
};
class Demo extends React.PureComponent<IProps & DispatchProp> {
  increment = () => {
    const { dispatch } = this.props;
    // 需要一个action生成器 - action creator
    const actionCreator = (payload: number) => {
      return {
        type: 'demo/async',
        payload
      }
    }
    const res = dispatch(actionCreator(Math.floor(Math.random() * 100)));
    console.log(res);
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

const mapStateToProps: (state: RootState) => IProps = state => {
  return {
    list: state.demo.list
  };
};
export default connect(mapStateToProps)(Demo);