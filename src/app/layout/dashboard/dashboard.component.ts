import { Component, OnInit } from '@angular/core';
import { Chart, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor() { }

  trendData : any[] = [{
    label: 'label 1',
    data: [65, 59, 80, 81, 56, 55, 40],
  },
  {
    label: 'label 2',
    data: [60, 61, 62, 63, 64, 65, 66],
  }]
  trendLables : string[] = [

    new Date(new Date().setDate(new Date().getDate() - 6)).getDate() + "",
    new Date(new Date().setDate(new Date().getDate() - 5)).getDate() + "",
    new Date(new Date().setDate(new Date().getDate() - 4)).getDate() + "",
    new Date(new Date().setDate(new Date().getDate() - 3)).getDate() + "",
    new Date(new Date().setDate(new Date().getDate() - 2)).getDate() + "",
    new Date(new Date().setDate(new Date().getDate() - 1)).getDate() + "",
    new Date().getDate() + "",
  ];
  trendLegend = false;
  trendOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  ngOnInit(): void {

  }
}
