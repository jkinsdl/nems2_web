import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { SearchFilter } from 'src/app/object/searchFilter';
import { StatisticsService } from 'src/app/service/statistics.service';

@Component({
  selector: 'app-travel-distance-statistics',
  templateUrl: './travel-distance-statistics.component.html',
  styleUrls: ['./travel-distance-statistics.component.css']
})
export class TravelDistanceStatisticsComponent implements OnInit {

  constructor(
    private statisticsService : StatisticsService
  ) { }

  totalMileage : number = 0;
  periodMileage : number = 0;
  ngOnInit(): void {
    this.setDonutChart()
    this.getStatisticsMileages()
  }

  getStatisticsMileages(){
    this.statisticsService.getStatisticsMileages(new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.setBarChart(res.body.mileageVehicles)
      this.totalMileage = res.body.totalMileage
      this.periodMileage = res.body.periodMileage
    },error=>{
      console.log(error)
    })
  }

  setBarChart(data : any[]){
    var chartDom = document.getElementById('barChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    let xAxisData : string[] = []
    let seriesData : any[] = []

    for(let i = 0; i < data.length; i ++){
      xAxisData.push(data[i].key)
      seriesData.push(data[i].value)
    }


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
          data: xAxisData,
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
          data: seriesData
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
        right : 10,
        orient: 'vertical',
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '80%'],
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
