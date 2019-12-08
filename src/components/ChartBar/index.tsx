import React from 'react';
import echarts from 'echarts';

interface ChartBarProps { };
interface ChartBarState { };
class ChartBar extends React.PureComponent<ChartBarProps, ChartBarState> {
  chartInstance: echarts.ECharts | undefined;
  chartId = `chart-${new Date().getTime()}`;

  componentDidMount() {
    this.init();
  }

  /**初始化 */
  init = () => {
    this.chartInstance = echarts.init(document.getElementById(this.chartId) as any);
    this.loadChart();
    this.eventBinding();
  }
  /**事件绑定 */
  eventBinding = () => {

  }
  /**加载图表 */
  loadChart = () => {
    this.chartInstance!.setOption(this.generateOptions(), true);
  }
  /**获取参数 */
  generateOptions = (): echarts.EChartOption => {
    const dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    const yMax = 500;
    const dataShadow = data.map(() => yMax);
    return {
      title: {
        text: '特性示例：渐变色 阴影 点击缩放',
        subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#fff',
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        { // For shadow
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          barWidth: 14,
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              barBorderRadius: [7, 7, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              barBorderRadius: [7, 7, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: data
        }
      ]
    };
  }
  render() {
    return <div id={this.chartId} style={{ width: '100%', height: '100%' }} />;
  }
}

export default ChartBar;