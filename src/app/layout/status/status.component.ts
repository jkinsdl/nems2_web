import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { StatisticsService } from 'src/app/service/statistics.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {

  constructor(
    private statisticsService : StatisticsService
  ) { }

  chart! : Chart;

  statisticsVehiclesSummary : any = {
    totalVehicles: 0,
    newVehicles: 0,
    loginVehicles: 0,
    totalMileage: 0,
    totalEnergyUsage: 0
  }

  ngOnInit(): void {
    this.setPieChart('chart');
    this.setPieChart('chart1');
    this.setPieChart('chart2');
    this.setPieChart('chart3');
    this.getStatisticsVehiclesSummary()
    this.getStatisticsWarnings()
  }

  getStatisticsVehiclesSummary(){
    this.statisticsService.getStatisticsVehiclesSummary().subscribe(res=>{
      console.log(res)
      this.statisticsVehiclesSummary = res.body
    },error=>{
      console.log(error)
    })
  }

  getStatisticsWarnings(){
    this.statisticsService.getStatisticsWarnings().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  setPieChart(chartID : string){
    var chartDom = document.getElementById(chartID)!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
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
