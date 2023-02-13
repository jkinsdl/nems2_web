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

  vehicleFailure : any[] = [{
    key : "LJDUAA2J4J0006507",
    value : "28"
  },{
    key : "LJDUAA2J4J0006507",
    value : "28"
  }]

  ngOnInit(): void {
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
      this.setPieChart("distributionChart", res.body.distribution)
      this.setPieChart("failureRankChart", res.body.failureRank)
      this.setPieChart("failureOccupancyChart", res.body.failureOccupancy)
    },error=>{
      console.log(error)
    })
  }

  setPieChart(chartID : string, data : any[]){
    var chartDom = document.getElementById(chartID)!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    let seriesData : any[] = []

    for(let i = 0; i < data.length; i++){
      seriesData.push({
        value : data[i].value,
        name : data[i].key
      })
    }

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
          data: seriesData,

        }
      ]
    };
    option && myChart.setOption(option);
  }

}
