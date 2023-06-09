import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
import { StatisticsService } from 'src/app/service/statistics.service';
import { CommonConstant } from 'src/app/util/common-constant';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-travel-distance-statistics',
  templateUrl: './travel-distance-statistics.component.html',
  styleUrls: ['./travel-distance-statistics.component.css']
})
export class TravelDistanceStatisticsComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  selectedLanguage: string; // Property to track the selected language(MINE)
  stateOptions: { label: string; value: string; }[];

  constructor(
    private statisticsService : StatisticsService,
    private utilService : UtilService,
    private translate : TranslateService,
    private http : HttpClient,
    private router: Router,
  ) { }

  totalMileage : number = 0;
  periodMileage : number = 0;

  statisticsDate$ : Subscription

  date : any

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.statisticsDate$)this.statisticsDate$.unsubscribe()
  }

  ngOnInit(): void {
 // Retrieve the selected language from storage or set a default value
  this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

  // Set the default language
  this.translate.setDefaultLang('en');

  // Load the translation file for the selected language
  const languageToLoad = this.selectedLanguage;
  const translationFile = `../assets/i18n/dashboard/${languageToLoad}.json`;

  this.translate.use(languageToLoad).subscribe(() => {
    this.http.get<any>(translationFile).subscribe((data) => {
      this.translate.setTranslation(languageToLoad, data);
      console.log('Translation file loaded successfully');
    });
  });
    this.date = this.statisticsService.statisticsDate
    this.getStatisticsMileages()

    this.statisticsDate$ = this.statisticsService.statisticsDate$.subscribe(date=>{
      console.log(date)
      this.date = date
      this.getStatisticsMileages()
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
     localStorage.setItem('selectedLanguage', language);
     this.translate.use(language).subscribe(() => {
       // Translation changed successfully
     });
   }

  getStatisticsMileages(){
    let f = new SearchFilter()
    if(this.date){
      let selectDate = new Date(this.date._i.year+'')
      selectDate.setMonth(this.date._i.month)
      selectDate.setDate(this.date._i.date)
      f.begin = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
      selectDate.setMonth(selectDate.getMonth()+1)
      f.end = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
    }
    this.statisticsService.getStatisticsMileages(f).subscribe(res=>{
      console.log("Period Mileage:",res)
      this.setBarChart(res.body.mileageVehicles)
      this.setDonutChart(res.body.mileageVehicles)
      this.totalMileage = res.body.totalMileage
      this.periodMileage =  Number(res.body.periodMileage.toFixed(1));  //rounding to 1 decimal place
    },error=>{
      console.log(error)
      if (error.status === 401 && error.error === "Unauthorized") {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
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

  setDonutChart(data : any[]){

    let donutData : any[] = []

    for(let i = 0; i < data.length; i++){
      donutData.push({
        name: data[i].key,
        value : data[i].value
      })
    }

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
          data: donutData,

        }
      ]
    };
    option && myChart.setOption(option);
  }
}
