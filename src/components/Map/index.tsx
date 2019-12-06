import { CITY_MAP } from './constant/china-main-city-map';
import React from 'react';
import axios from 'axios';
import echarts from 'echarts';

interface StackType {
  mapCode: string;
  mapName: string;
}
interface ScaleLimitType {
  min: number;
  max: number;
}
interface MapProps {
  /**地图行政编码（用于获取地图）、地图名称（用于注册地图） */
  map: StackType;
  /**描点 */
  points?: any[];
  /**是否可变更描点位置 */
  dragAble?: Boolean;
  /**滚动到下级地图 */
  scrollDown?: boolean;
  /**放大缩小地图切换临界点 */
  scaleTabLimit?: ScaleLimitType;
  /**放大缩小地图临界点 */
  scaleLimit?: ScaleLimitType;
  onChange?: (params: any) => void;
};
interface MapState {
  mapStack: StackType[];
  curMap: StackType;
  preAreaName: string;
};
class Map extends React.PureComponent<MapProps, MapState> {
  chartInstance: echarts.ECharts | undefined;
  chartId = `chart-${new Date().getTime()}`;
  toolTipsId = `toolTips-${new Date().getTime()}`;
  state = {
    mapStack: [],
    curMap: {
      mapCode: '',
      mapName: ''
    },
    preAreaName: ''
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate(prevProps: MapProps, prevState: MapState) {
    const {map: prevMap, points: prePoints, dragAble: preDragAble, scrollDown: preScrollDown} = prevProps;
    const {map, points, dragAble, scrollDown} = this.props;
    if (map.mapCode !== prevMap.mapCode) {
      this.loadMap(map.mapCode, map.mapName);
      this.setState({mapStack: [], preAreaName: ''});
    }
    if (points !== prePoints) {
      this.mapRender();
    }
    if (dragAble !== preDragAble || scrollDown !== preScrollDown) {
      this.eventBinding();
    }
  }
  componentWillUnmount() {
    this.chartInstance && this.chartInstance.dispose();
    this.chartInstance = undefined;
  }
  /**地图初始化 */
  init = () => {
    const {map} = this.props;
    // id 需自定义
    this.chartInstance = echarts.init(document.getElementById(this.chartId) as any, 'dark');
    this.loadMap(map.mapCode, map.mapName);
    this.eventBinding();
  }
  /**事件绑定 */
  eventBinding = () => {
    const { chartInstance } = this;
    if (chartInstance) {
      chartInstance.off('georoam');
      chartInstance.off('mouseover');
      chartInstance.off('click');
      chartInstance.on('georoam', (params: any) => {
        if (params.zoom) {
          const {scrollDown, onChange, points, scaleTabLimit = { min: 0.5, max: 1.5}} = this.props;
          const {mapStack, curMap, preAreaName} = this.state;
          const data: any = (chartInstance.getOption() as any).series[0];
          const zoom = data.zoom;
          const curAreaName = (document.getElementById(this.toolTipsId) || {}).innerText;
          
          if (scrollDown && zoom > scaleTabLimit.max && curAreaName && curAreaName !== preAreaName) {
            const mapCode = CITY_MAP[curAreaName];
            if (mapCode && mapStack.length < 2) {
              this.setState({ mapStack: [...mapStack, {...curMap}], preAreaName: curAreaName});
              this.loadMap(mapCode, curAreaName);
              onChange && onChange({
                points,
                map: {mapCode, mapName: curAreaName}
              });
            }
          } else if (zoom < scaleTabLimit.min) {
            if (mapStack.length > 0) {
              const map: StackType = mapStack.pop()!;
              this.loadMap(map.mapCode, map.mapName);
              this.setState({mapStack: [...mapStack]});
              onChange && onChange({
                points, 
                map: {...map},
              });
            }
          }
        }
      });
      chartInstance.on('click', (params: any) => {
        const {points = [], dragAble, onChange} = this.props;
        if (dragAble && points[0]) {
          points[0] = {
            ...points[0],
            coord: chartInstance.convertFromPixel({seriesIndex: 0}, [params.event.offsetX, params.event.offsetY])
          }
          this.mapRender({points: [...points]});
          onChange && onChange({ points: [...points] });
        }
      });
    }
  }
  /**加载地图 */
  loadMap = async (mapCode: string, mapName: string) => {
    this.chartInstance!.showLoading();
    const res: any = await axios.get(`/static/json/china-main-city/${mapCode}.json`).catch(() => {this.chartInstance!.hideLoading()});
    this.chartInstance!.hideLoading();
    if (res.status === 200 && res.data) {
      const {points = [], scaleLimit = { min: 0.3, max: 4 }} = this.props;
      /**颜色映射数据 */
      const data = res.data.features.map((item: any) => {
        return {
          name: item.properties.name,
          value: item.properties.childNum,
        };
      });
      const option: echarts.EChartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: 'rgba(50,50,50,0)',
          borderColor: 'rgba(50,50,50,0)',
          padding: 0,
          formatter: (params: any, ticket, callback) => {
            return `<span id="${this.toolTipsId}" style="display: none">${params.data.name}</span>`
          }
        },
        visualMap: [{
          type: 'piecewise',
          show: false,
          min: 0,
          max: 60,
          splitNumber: 10,
          dimension: 0,
          seriesIndex: 0,
          inRange: {
            color: ['#eac736', '#50a3ba'],
          },
        }],
        series: [
          {
            name: mapName,
            type: 'map',
            map: mapName,
            roam: true,
            zoom: 1,
            scaleLimit,
            left: 'center',
            top: 'center',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    color: "#333"
                  }
                }
              },
              emphasis: { label: { show: true } }
            },
            markPoint: {
              symbol: 'pin',
              symbolSize: 20,
              label: {
                show: false,
              },
              // emphasis: {
              //   itemStyle: {
              //     borderColor: '#fff',
              //   }
              // },
              data: points
            },
            data
          }
        ]
      };
      echarts.registerMap(mapName, res.data);
      this.chartInstance!.setOption(option, true);
      this.setState({curMap: {
        mapCode: mapCode,
        mapName: mapName
      }})
    } else {
      this.chartInstance!.hideLoading();
    }
  }

  mapRender = (params?: any) => {
    const {chartInstance} = this;
    if (chartInstance) {
      let points: any = [];
      if (params) {
        points = params.points
      } else {
        points = this.props.points || [];
      }
      const option: echarts.EChartOption = {
        series: [
          {
            markPoint: {
              symbol: 'pin',
              symbolSize: 20,
              label: {
                show: false,
              },
              data: [...points]
            }
          }
        ]
      }
      chartInstance!.setOption(option);
    }
  }
  
  render() {
    return <div id={this.chartId} style={{ width: '100%', height: '100%' }} />;
  }
}

export default Map;