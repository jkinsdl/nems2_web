import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { StatisticsService } from 'src/app/service/statistics.service';
import * as echarts from 'echarts';
import { UiService } from 'src/app/service/ui.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  stateOptions: { label: string; value: string; }[];
  language: string;

  constructor(
    private statisticsService : StatisticsService,
    private uiService : UiService,

    private translate: TranslateService,
    private http: HttpClient
  ) { }

  chart! : Chart;

  statisticsVehiclesSummary : any = {
    totalVehicles: 0,
    newVehicles: 0,
    loginVehicles: 0,
    totalMileage: 0,
    totalEnergyUsage: 0
  }

  vehicleFailure : any[] = []

  distributionChart : any
  failureRankChart : any
  failureOccupancyChart : any

  statisticsCurrent : any = {
    totalVehicles: 0,
    totalLoginVehicles: 0,
    totalLogoutVehicles: 0,
    todayRegistVehicles: 0
  }

  onResize(event : any){
    this.distributionChart.resize();
    this.failureRankChart.resize();
    this.failureOccupancyChart.resize();
  }

  ngOnInit(): void {
    console.log('status.component.ts initialized!');
    this.selectedLanguage = 'en'; // Set the default language
    this.translate.setDefaultLang('en'); // Set the default language
  
    // Load the translation file for the selected language
    const languageToLoad = this.selectedLanguage;
    const translationFile = `../assets/i18n/dashboard/${languageToLoad}.json`;
    
     // Request to load the translation file
     this.translate.use(languageToLoad).subscribe(() => {
      this.http.get<any>(translationFile).subscribe((data) => {
        this.translate.setTranslation(languageToLoad, data);
        console.log('Translation file loaded successfully');
      });
    });
    //this.getStatisticsVehiclesSummary()
    this.getStatisticsCurrent()
    this.getStatisticsWarnings()
  }

  getStatisticsCurrent(){
    this.statisticsService.getStatisticsCurrent().subscribe(res=>{
      console.log(res)
      this.statisticsCurrent = res.body
    },error=>{
      console.log(error)
    })
  }


   //MINE//
   isDropdownOpen = false;

   toggleDropdown():void{
     this.isDropdownOpen = !this.isDropdownOpen;
   }
 
  //  changeLanguage(language:string): void{
  //    this.language = language;
  //  } 
 
  onLanguageChange(event: any) {
   const language = event.target.value;
   this.uiService.setCurrentLanguage(language)
   this.translate.use(language).subscribe(() => {
     // Translation changed successfully
   });
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
      this.vehicleFailure = res.body.vehicleFailure
    },error=>{
      console.log(error)
    })
  }

  setPieChart(chartID : string, data : any[]){
    var chartDom = document.getElementById(chartID)!;
    if(chartID == 'distributionChart'){
      this.distributionChart = echarts.init(chartDom);
    }else if(chartID == 'failureRankChart'){
      this.failureRankChart = echarts.init(chartDom);
    }else if(chartID == 'failureOccupancyChart'){
      this.failureOccupancyChart = echarts.init(chartDom);
    }


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
        type:'scroll',
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
    if(chartID == 'distributionChart'){
      option && this.distributionChart.setOption(option);
    }else if(chartID == 'failureRankChart'){
      option && this.failureRankChart.setOption(option);
    }else if(chartID == 'failureOccupancyChart'){
      option && this.failureOccupancyChart.setOption(option);
    }


  }

}
