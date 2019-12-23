import Map from '@components/Map';
import ChartBar from '@components/ChartBar';
import React from 'react';
import points from './constant/markPoint.json';

interface DemoProps { };
interface DemoState {
  p: any[];
};
class Demo extends React.PureComponent<DemoProps, DemoState> {
  state = {
    p: points,
  }
  onMapChange = (params: any) => {
    console.log(params);
    this.setState({ p: params.points });
  }
  render() {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 80, bottom: 0 }}>
        <div style={{ height: '300px' }}>
          <Map
            map={{ mapCode: '100000', mapName: 'china' }}
            points={this.state.p}
            scrollDown={true}
            dragAble={true}
            onChange={this.onMapChange}
          />
        </div>
        <div style={{ height: '300px' }}>
          <ChartBar />
        </div>
      </div>
    )
  }
}

export default Demo;