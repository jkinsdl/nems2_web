import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-travel-distance-statistics',
  templateUrl: './travel-distance-statistics.component.html',
  styleUrls: ['./travel-distance-statistics.component.css']
})
export class TravelDistanceStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.setBarChart()
    this.setDonutChart()
  }

  setBarChart(){
    var chartDom = document.getElementById('barChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['0-10 KM', '10-20 KM', '20-50 KM', '50-100 KM', '100-150 KM', '150-200 KM', '200- KM'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };
    option && myChart.setOption(option);
  }

  setDonutChart(){
    var chartDom = document.getElementById('donutChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 1048, name: 'A' },
            { value: 735, name: 'B' },
            { value: 580, name: 'C' },
            { value: 484, name: 'D' },
            { value: 300, name: 'E' }
          ],

        }
      ]
    };
    option && myChart.setOption(option);
  }
}
