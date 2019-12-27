import './index.scss';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/markPoint';

import {PointType, PropsPointType, ScaleLimitType, StackType} from './type';

import React from 'react';
import axios from 'axios';
import echarts from 'echarts/lib/echarts';
import parentsMap from './constant/parentsMap.json';

const ajax = axios.create({baseURL: '/'});
const DEFAULT_MAP: StackType = {
  mapCode: '100000',
  mapName: '中华人民共和国',
};

/* <Map
    map={{mapCode: '100000', mapName: 'china'}}
    points={[
      {
        name: '广西',
        coord: [108.320004, 22.82402],
      },
    ]}
    scrollDown={true}
    dragAble={true}
  /> */
interface MapProps {
  /**地图行政编码（用于获取地图）、地图名称（用于注册地图） */
  map: StackType;
  /**地图最高等级1: 全国；2：省级；3：市级 */
  rootLevel?: 1 | 2 | 3;
  /**描点 */
  points?: PropsPointType[];
  /**是否可变更描点位置 */
  dragAble?: boolean;
  /**滚动到下级地图 */
  scrollDown?: boolean;
  /**放大缩小地图切换临界点 */
  scaleTabLimit?: ScaleLimitType;
  /**放大缩小地图临界点 */
  scaleLimit?: ScaleLimitType;
  onTracPoint?: (params: PointType) => void;
}
interface MapState {
  curMap: StackType;
  vitualData: any[];
  mapLoading: boolean;
}
class Map extends React.PureComponent<MapProps, MapState> {
  chartInstance: echarts.ECharts | undefined;
  chartDom: any;
  toolTipsId = `toolTips-${new Date().getTime()}`;
  state = {
    curMap: {
      mapCode: '',
      mapName: '',
    },
    vitualData: [],
    mapLoading: false,
  };
  componentDidMount() {
    this.init();
  }
  componentDidUpdate(prevProps: MapProps, prevState: MapState) {
    const {dragAble: preDragAble, scrollDown: preScrollDown} = prevProps;
    const {map, points, dragAble, scrollDown} = this.props;
    if (map.mapCode !== prevProps.map.mapCode) {
      this.loadMap(map.mapCode, map.mapName);
    } else if (points !== prevProps.points) {
      this.refresh({});
    }
    if (dragAble !== preDragAble || scrollDown !== preScrollDown) {
      this.eventBinding(false);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    this.chartInstance && this.chartInstance.dispose();
    this.chartInstance = undefined;
  }
  /**地图初始化 */
  init = () => {
    const {map} = this.props;
    this.chartInstance = echarts.init(this.chartDom);
    this.loadMap(map.mapCode, map.mapName);
    this.eventBinding();
  };
  /**事件绑定 */
  eventBinding = (resize = true) => {
    const {chartInstance} = this;
    if (chartInstance) {
      chartInstance.off('georoam');
      chartInstance.off('click');
      window.removeEventListener('resize', this.resizeHandler);
      chartInstance.on('georoam', (params: any) => {
        if (params.zoom) {
          const {scrollDown, scaleTabLimit = {min: 0.5, max: 4}} = this.props;
          const {curMap} = this.state;
          const data: any = (chartInstance.getOption() as any).series[0];
          const zoom = data.zoom;
          const curAreaStr = (document.getElementById(this.toolTipsId) || {}).innerText || '';
          const mapCode = curAreaStr.split(':')[1];
          const mapName = curAreaStr.split(':')[0];
          const hasChildren = curAreaStr.split(':')[2];

          if (scrollDown && zoom > scaleTabLimit.max && hasChildren && mapCode && mapCode !== curMap.mapCode) {
            this.loadMap(mapCode, mapName);
          } else if (zoom < scaleTabLimit.min) {
            const parentStack = parentsMap[mapCode] || [];
            const parentLen = parentStack.length;
            if (parentLen > 1) {
              const parentMap = parentStack[parentLen - 2];
              this.loadMap(parentMap.mapCode, parentMap.mapName);
            }
          }
        }
      });
      chartInstance.on('click', (params: any) => {
        const {points = [], dragAble, onTracPoint} = this.props;
        const curData = {...params.data};

        if (dragAble && points[0]) {
          const stack = [...(parentsMap[curData.value + ''] || []), {mapCode: curData.value + '', mapName: curData.name}];
          const tempPoint = {
            ...points[0],
            coord: chartInstance.convertFromPixel({seriesIndex: 0}, [params.event.offsetX, params.event.offsetY]) as any,
          };
          // this.refresh({points: [...tempPoint]});
          onTracPoint && onTracPoint({...tempPoint, stack});
        }
      });
      resize && window.addEventListener('resize', this.resizeHandler); // 图表大小自适应
    }
  };
  resizeHandler = () => {
    this.chartInstance?.resize();
  };
  /**加载地图 */
  loadMap = async (mapCode: string, mapName: string) => {
    const {chartInstance} = this;
    const {rootLevel = 1} = this.props;
    const {mapLoading} = this.state;
    const stackLen = (parentsMap[mapCode] || []).length + 1;
    if (!chartInstance || stackLen < rootLevel || mapLoading) return;
    this.setState({mapLoading: true});
    chartInstance.showLoading('default', {
      text: '',
      color: 'rgba(255, 255, 255, 0)',
      textColor: '#53F9FF',
      maskColor: 'rgba(255, 255, 255, 0)',
      zlevel: 0,
    });
    const res: any = await ajax
      // .get(`${initEnv.staticPath}json/china-main-city/${mapCode}.json`)
      .get(`${initEnv.staticPath}map/china/json_full/${mapCode}.json`)
      .catch((err: any) => ({msg: err && err.message}))
      .finally(() => {
        this.setState({mapLoading: false});
        chartInstance.hideLoading();
      });
    if (res && res.status === 200 && res.data) {
      /**颜色映射数据 */
      const data = res.data.features.map((item: any) => {
        return {
          ...item,
          name: item.properties.name,
          value: item.properties.adcode,
        };
      });
      echarts.registerMap(mapName, res.data);
      this.setState(
        {
          curMap: {
            mapCode: mapCode,
            mapName: mapName,
          },
          vitualData: data,
        },
        () => {
          let center: any = undefined;
          mapCode === '100000' && (center = [108.07598174083593, 33.72929925655643]);
          chartInstance.clear();
          chartInstance.setOption(this.generateOptions({data, mapName, center}), true);
          chartInstance.resize();
        }
      );
    } else {
      this.loadMap(DEFAULT_MAP.mapCode, DEFAULT_MAP.mapName);
    }
  };
  /**获取参数 */
  generateOptions = (params: {mapName?: string; data?: any; points?: PropsPointType[]; zoom?: number; center?: [number, number]}): echarts.EChartOption => {
    const {points = [], scaleLimit = {min: 0.3, max: 6}} = this.props;
    const {curMap, vitualData} = this.state;
    const tempParams = {
      mapName: params.mapName || curMap.mapName,
      data: params.data || vitualData,
      points: params.points || points,
      zoom: params.zoom || 1.5,
      center: params.center,
    };
    this.toolTipsId = `toolTipss-${new Date().getTime()}`;
    this.delDom();
    return {
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: 'rgba(50,50,50,0)',
        borderColor: 'rgba(50,50,50,0)',
        padding: 0,
        formatter: (params: any) => {
          let innerHtml = '';
          params.data && (innerHtml = `${params.data.name}:${params.data.value}:${params.data.properties.childrenNum ? 'children' : ''}`);
          return `<span id="${this.toolTipsId}" style="display: none">${innerHtml}</span>`;
        },
      },
      visualMap: [
        {
          type: 'piecewise',
          show: false,
          min: 100000,
          max: 900000,
          splitNumber: 10,
          dimension: 0,
          seriesIndex: 0,
          inRange: {
            color: ['#eac736', '#50a3ba'],
          },
        },
      ],
      series: [
        {
          name: tempParams.mapName,
          type: 'map',
          map: tempParams.mapName,
          roam: true,
          zoom: tempParams.zoom,
          scaleLimit,
          center: tempParams.center,
          // left: 'center',
          // top: 'center',
          label: {
            show: true,
            textStyle: {
              color: '#333',
            },
          },
          emphasis: {
            label: {show: true},
          },
          markPoint: {
            symbol: 'pin',
            symbolSize: 20,
            label: {
              show: true,
              color: '#fff',
              formatter: (param: any) => {
                return param.data.name;
              },
            },
            // emphasis: {
            //   itemStyle: {
            //     borderColor: '#fff',
            //   },
            // },
            data: tempParams.points,
          },
          data: tempParams.data,
        },
      ],
    };
  };
  /**删除多余dom 执行clear方法后产生多余dom bug */
  delDom = () => {
    const allNodes = this.chartDom.children;
    if (allNodes[0] && allNodes[0].nodeType == 1) {
      for (let i = 1; i < allNodes.length; i++) {
        if (allNodes[i].nodeType == 1 && allNodes[i] != allNodes[0]) {
          this.chartDom.removeChild(allNodes[i]);
        }
      }
    }
  };
  refresh = (params: {points?: PropsPointType[]}) => {
    const {zoom, center} = this.getZoom();
    this.chartInstance?.clear();
    this.chartInstance?.setOption(this.generateOptions({...params, zoom, center}), true);
    this.chartInstance?.resize();
  };
  getZoom = (): {zoom?: number; center?: [number, number]} => {
    const option = this.chartInstance?.getOption();
    let zoom: number | undefined = undefined;
    let center: [number, number] | undefined = undefined;
    if (option && option.series && option.series[0]) {
      zoom = (option.series[0] as any).zoom;
      center = (option.series[0] as any).center;
    }
    return {zoom, center};
  };

  render() {
    return <div styleName="root" ref={dom => (this.chartDom = dom)} />;
  }
}
export default Map;
