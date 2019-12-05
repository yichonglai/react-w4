import { CITY_MAP } from './constant/china-main-city-map';
import React from 'react';
import axios from 'axios';
import echarts from 'echarts';

interface DashboardProps { };
interface DashboardState { };
class Dashboard extends React.PureComponent<DashboardProps, DashboardState> {
  myChart: echarts.ECharts | undefined;
  curMap: { mapCode: string; mapName: string } | undefined;
  curAreaName: string | undefined;
  preAreaName: string | undefined;
  mapStack: any[] = [];

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('my-chart') as any);
    this.loadMap("100000", "china");
    this.eventBinding();
  }
  componentWillUnmount() {
    this.myChart && this.myChart.dispose();
  }
  /**事件绑定 */
  eventBinding = () => {
    const { myChart } = this;
    myChart!.on('georoam', (params: any) => {
      // console.log(this.myChart.convertFromPixel({seriesIndex: 0}, [params.originX, params.originY]));
      if ("zoom" in params) {
        const data: any = (myChart!.getOption() as any).series[0];
        const zoom = data.zoom;
        if (zoom > 1.5 && this.curAreaName && this.curAreaName !== this.preAreaName) {
          const mapCode = CITY_MAP[this.curAreaName];
          if (mapCode && this.mapStack.length < 2) {
            this.mapStack.push({
              mapCode: this.curMap!.mapCode,
              mapName: this.curMap!.mapName
            });
            this.loadMap(mapCode, this.curAreaName);
            this.preAreaName = this.curAreaName;
          }
        } else if (zoom < 0.5) {
          if (this.mapStack.length > 0) {
            const map = this.mapStack.pop();
            if (map) {
              this.loadMap(map.mapCode, map.mapName);
            }
          }
        }
      } else {
        //   console.log("平移", params);
      }
    });
    myChart!.on('mouseover', (params: any) => {
      if (!params.name) return;
      this.curAreaName = params.name;
    });
  }
  /**加载地图 */
  loadMap = (mapCode: string, mapName: string) => {
    this.myChart!.showLoading();
    axios.get(`/static/json/china-main-city/${mapCode}.json`).then(res => {
      this.myChart!.hideLoading();
      if (res.status === 200 && res.data) {
        /**颜色映射数据 */
        const data = res.data.features.map((item: any) => {
          return {
            name: item.properties.name,
            value: item.properties.childNum,
          };
        });
        /**描点 */
        const points: any = [];
        res.data.features.forEach((item: any) => {
          if (item.properties.cp) {
            points.push({
              name: item.properties.name,
              coord: item.properties.cp
            })
          }
        });
        const markPoint = {
          symbol: 'pin',
          symbolSize: 20,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              borderColor: '#fff',
            }
          },
          data: points,
        }
        echarts.registerMap(mapName, res.data);
        const option: echarts.EChartOption = {
          tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{b}：{c}'
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
          toolbox: {
            show: true,
            x: 'center',
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true },
            }
          },
          series: [
            {
              name: mapName,
              type: 'map',
              map: mapName,
              roam: true,
              zoom: 1,
              scaleLimit: {
                min: 0.3,
                max: 4
              },
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
              markPoint,
              data
            }
          ]
        };
        this.myChart!.setOption(option, true)
        this.curMap = {
          mapCode: mapCode,
          mapName: mapName
        };
      }
    }, () => { this.myChart!.hideLoading(); })
  }
  render() {
    return <div id="my-chart" style={{ position: 'absolute', left: 0, right: 0, top: 80, bottom: 0 }} />;
  }
}

export default Dashboard;