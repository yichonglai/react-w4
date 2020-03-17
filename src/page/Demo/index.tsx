import {DispatchProp, connect} from 'react-redux';

import React from 'react';

interface IProps {
  count: number;
};
interface IState { };
class Demo extends React.PureComponent<IProps & DispatchProp, IState> {
  increment = () => {
    const {dispatch} = this.props;
    // 需要一个action生成器 - action creator
    dispatch({type: 'INCREMENT'})
  }
  render() {
    const {count} = this.props;
    console.log(this.props);
    return (
      <div>
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
export default connect(mapStateToProps)(Demo);