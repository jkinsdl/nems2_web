import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { StatisticsService } from 'src/app/service/statistics.service';

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
    const canvas = <HTMLCanvasElement> document.getElementById(chartID);
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx,{
      type:'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
			responsive: false
		}
    })
  }

}
