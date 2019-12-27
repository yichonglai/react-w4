import './index.scss';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/effectScatter';

import {PointType, ScaleLimitType, StackType} from './type';

import React from 'react';
import axios from 'axios';
import echarts from 'echarts/lib/echarts';
import parentsMap from './constant/parentsMap.json';

const ajax = axios.create({baseURL: '/'});

interface MapProps {
  /**地图行政编码（用于获取地图）、地图名称（用于注册地图） */
  map: StackType;
  /**描点 */
  points: PointType[];
  /**滚动到下级地图 */
  scrollDown?: boolean;
  /**滚动到上级地图 */
  scrollUp?: boolean;
  /**放大缩小地图切换临界点 */
  scaleTabLimit?: ScaleLimitType;
  /**放大缩小地图临界点 */
  scaleLimit?: ScaleLimitType;
  onMapChange?: (params: {displaylevel: number; pMapCode: string}) => void;
}
interface MapState {
  curMap: StackType;
  vitualData: any[];
  mapLoading: boolean;
  tooltipStr: string;
  w: number;
  h: number;
}
class Map extends React.PureComponent<MapProps, MapState> {
  chartInstance: echarts.ECharts | undefined;
  chartDom: any;
  toolTipsId = `toolTips-${new Date().getTime()}`;
  resizeTimer: any;
  state = {
    curMap: {
      mapCode: '',
      mapName: '',
    },
    tooltipStr: '',
    vitualData: [],
    mapLoading: false,
    w: 0,
    h: 0,
  };
  componentDidMount() {
    this.init();
  }
  componentDidUpdate(prevProps: MapProps, prevState: MapState) {
    const {map, points, scaleLimit} = this.props;
    if (map.mapCode !== prevProps.map.mapCode) {
      this.loadMap(map.mapCode, map.mapName);
    } else if (points !== prevProps.points || scaleLimit !== prevProps.scaleLimit) {
      this.refresh();
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
    this.setState({
      w: this.chartInstance?.getWidth() || 0,
      h: this.chartInstance?.getHeight() || 0,
    });
    this.loadMap(map.mapCode, map.mapName);
    this.eventBinding();
  };
  /**事件绑定 */
  eventBinding = () => {
    const {chartInstance} = this;
    if (chartInstance) {
      chartInstance.off('georoam');
      chartInstance.off('click');
      chartInstance.on('georoam', (params: any) => {
        if (params.zoom) {
          const {scrollDown, scrollUp, map, scaleTabLimit = {min: 0.5, max: 6}} = this.props;
          const {curMap, tooltipStr} = this.state;
          const data: any = (chartInstance.getOption() as any).geo[0];
          const zoom = data.zoom;
          const curAreaStr = (document.getElementById(this.toolTipsId) || {}).innerText || tooltipStr;
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
              if (scrollUp) {
                this.loadMap(parentMap.mapCode, parentMap.mapName);
              } else if (curMap.mapCode !== map.mapCode) {
                this.loadMap(parentMap.mapCode, parentMap.mapName);
              }
            }
          }
        }
      });
      chartInstance.on('click', (params: any) => {
        const {scrollDown} = this.props;
        const {curMap} = this.state;
        const curAreaName = params.data.properties.name;
        const curAreaCode = params.data.properties.adcode + '';
        const hasChildren = params.data.properties.childrenNum;
        if (scrollDown && hasChildren && curAreaCode && curAreaCode !== curMap.mapCode) {
          this.loadMap(curAreaCode, curAreaName);
        }
      });
      window.addEventListener('resize', this.resizeHandler); // 图表大小自适应
    }
  };
  resizeHandler = () => {
    this.chartInstance?.resize();
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.refresh(true);
    }, 300);
  };
  /**加载地图 */
  loadMap = async (mapCode: string, mapName: string) => {
    const {chartInstance} = this;
    const {mapLoading} = this.state;
    if (!chartInstance || mapLoading) return;
    this.setState({mapLoading: true});
    chartInstance.showLoading('default', {
      text: '地图加载中...',
      color: 'rgba(255, 255, 255, 0)',
      textColor: '#53F9FF',
      maskColor: 'rgba(255, 255, 255, 0.1)',
      zlevel: 0,
    });
    const res: any = await ajax
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
          tooltipStr: '',
          vitualData: data,
        },
        () => {
          let center: any = undefined;
          mapCode === '100000' && (center = [108.07598174083593, 33.72929925655643]);
          chartInstance.setOption(this.generateOptions({data, mapName, center}), true);
          chartInstance.resize();
          const {onMapChange} = this.props;
          onMapChange && onMapChange({displaylevel: (parentsMap[mapCode] || []).length + 1, pMapCode: mapCode === '100000' ? '' : mapCode});
        }
      );
    }
  };
  /**获取参数 */
  generateOptions = (params: {mapName?: string; data?: any; zoom?: number; center?: [number, number]; resize?: boolean}, option?: echarts.EChartOption): echarts.EChartOption => {
    const {scaleLimit = {min: 0.4, max: 8}, points} = this.props;
    const {curMap, vitualData} = this.state;
    const tempParams = {
      mapName: params.mapName || curMap.mapName,
      data: params.data || vitualData,
      zoom: params.zoom || 1.5,
      center: params.center,
    };
    if (params.resize) {
      this.toolTipsId = `toolTips-${new Date().getTime()}`;
      this.delDom();
    }

    return {
      ...(option || {}),
      geo: {
        map: tempParams.mapName,
        roam: true,
        scaleLimit,
        zoom: tempParams.zoom,
        center: tempParams.center,
        itemStyle: {
          borderColor: '#53f9ff',
          areaColor: 'rgba(78, 107, 141, 0.5)',
        },
        label: {
          show: true,
          textStyle: {
            color: 'rgba(83, 249, 255, .6)',
          },
        },
        emphasis: {
          label: {
            textStyle: {
              color: 'rgba(83, 249, 255, 1)',
            },
          },
          itemStyle: {
            areaColor: 'rgba(78, 107, 141, 0.8)',
          },
        },
      },
      tooltip: {
        noMerge: false,
        show: true,
        trigger: 'item',
      },
      series: [
        {
          name: tempParams.mapName,
          type: 'map',
          geoIndex: 0,
          tooltip: {
            backgroundColor: 'rgba(50,50,50,0)',
            borderColor: 'rgba(50,50,50,0)',
            padding: 0,
            formatter: (params: any) => {
              let innerHtml = '';
              params.data && (innerHtml = `${params.data.name}:${params.data.value}:${params.data.properties.childrenNum ? 'children' : ''}`);
              innerHtml !== this.state.tooltipStr && this.setState({tooltipStr: innerHtml});
              return `<span style="display: none" id="${this.toolTipsId}">${innerHtml}</span>`;
            },
          },
          data: tempParams.data,
        },
        {
          name: '声纹样本',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbolSize: (val: any) => {
            // return val[2] / 50 || 1;
            return 20;
          },
          tooltip: {
            formatter: (params: any) => {
              const data = params.data;
              return `${data.name}<br />样本数量：${data.value[2]}<br />终端数量：${data.value[3]}`;
            },
          },
          rippleEffect: {
            brushType: 'stroke',
          },
          hoverAnimation: true,
          itemStyle: {
            color: 'rgba(255,218,103, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(255,218,103, 1)',
          },
          label: {
            position: 'bottom',
            show: true,
            formatter: '{@[2]}',
            color: 'rgba(255, 255, 255, 1)',
          },
          zlevel: 1,
          data: points,
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
  refresh = (resize?: boolean) => {
    const {h, w} = this.state;
    const width = this.chartInstance?.getWidth() || 0;
    const height = this.chartInstance?.getHeight() || 0;
    const {zoom, center} = this.getZoom();
    if (resize && (width !== w || height !== h)) {
      resize && this.chartInstance!.clear();
    }
    this.chartInstance!.setOption(this.generateOptions({zoom, center, resize}), true);
    this.chartInstance!.resize();
  };
  getZoom = (): {zoom?: number; center?: [number, number]} => {
    const option = this.chartInstance?.getOption();
    let zoom: number | undefined = undefined;
    let center: [number, number] | undefined = undefined;
    if (option && option.geo && option.geo[0]) {
      zoom = option.geo[0].zoom;
      center = option.geo[0].center;
    }
    return {zoom, center};
  };

  render() {
    return <div styleName="root" ref={dom => (this.chartDom = dom)} />;
  }
}

export default Map;
