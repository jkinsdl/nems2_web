import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';
import * as echarts from 'echarts';
import usa from '../../../../assets/data/examples.json';
import { StatisticsService } from 'src/app/service/statistics.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monthly-vehicle-statistics',
  templateUrl: './monthly-vehicle-statistics.component.html',
  styleUrls: ['./monthly-vehicle-statistics.component.css']
})
export class MonthlyVehicleStatisticsComponent implements OnInit {

  constructor(
    private statisticsServce : StatisticsService,
    private utilService : UtilService
  ) { }


  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v10'
  lat = 35.8617;
  lng = 104.1954;
  mapPopup : any

  bounds : LngLatBoundsLike = [
    [70, 15], // Southwest coordinates
    [135, 55] // Northeast coordinates
  ];

  registrationSummary : any = {
    newVehicles : 0,
    totalVehicles : 0,
    useVehicles : 0
  }

  statisticsDate$ : Subscription

  date : any


  chinaChart : any
  cityChart : any

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.statisticsDate$)this.statisticsDate$.unsubscribe()
  }

  ngOnInit(): void {
    this.date = this.statisticsServce.statisticsDate
    this.setChinaMapChart()
    this.getStatisticsRegistrationSummary()

    this.statisticsDate$ = this.statisticsServce.statisticsDate$.subscribe(date=>{
      console.log(date)
      this.date = date
      this.getStatisticsRegistrationSummary()
    })
  }

  getStatisticsRegistrationSummary(){
    let f = new SearchFilter()
    if(this.date){
      let selectDate = new Date(this.date._i.year+'')
      selectDate.setMonth(this.date._i.month)
      selectDate.setDate(this.date._i.date)
      f.begin = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
      selectDate.setMonth(selectDate.getMonth()+1)
      f.end = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
    }
    this.statisticsServce.getStatisticsRegistrationSummary(f).subscribe(res=>{
      console.log(res)
      this.registrationSummary = res.body
    },error=>{
      console.log(error)
    })
  }

  setChinaMapChart(){
    var chartDom = document.getElementById('chinaMapChart')!;
    this.chinaChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    this.utilService.getProvinceCopyData().subscribe((res : any)=>{
      console.log(res)
      echarts.registerMap('CHINA', res);

      this.statisticsServce.getStatisticsRegistrationCount( new SearchFilter()).subscribe(count=>{
        console.log(count)

        let data : any[] = []

        for(let i = 0; i < count.body.entities.length; i++){
          data.push({
            name : count.body.entities[i].region.province,
            value : count.body.entities[i].count
          })
        }

        option = {
          tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2
          },
          visualMap: {
            left: 'right',
            min: 0,
            max: 1000,
            inRange: {
              color: [
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            },
            calculable: true
          },
          series: [
            {
              name: 'CHINA',
              type: 'map',
              roam: false,
              map: 'CHINA',
              emphasis: {
                label: {
                  show: true
                }
              },
              data: data
            }
          ]
        };

        this.chinaChart.setOption(option,true);

      },error=>{
        console.log(error)
      })
      this.chinaChart.on('click',(params:any)=>{
        this.setCityMapChart(params.name)
      })


    },error=>{
      console.log(error)
    })
  }

  setCityMapChart(name : any){
    var chartDom = document.getElementById('cityMapChart')!;
    this.cityChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    this.utilService.getSubPrefectureeCopyData().subscribe((res : any)=>{
      console.log(res)

      for(let i = 0; i < res.features.length; i++){
        if(name != res.features[i].properties.ADM1_ZH){
          res.features.splice(i,1)
          i--;
        }
      }

      echarts.registerMap('city', res);

      let f = new SearchFilter()
      f.province = name

      this.statisticsServce.getStatisticsRegistrationCount(f).subscribe(count=>{
        let data : any[] = []

        for(let i = 0; i < count.body.entities.length; i++){
          data.push({
            name : count.body.entities[i].region.city,
            value : count.body.entities[i].count
          })
        }


        option = {
          tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2
          },
          visualMap: {
            left: 'right',
            min: 0,
            max: 1000,
            inRange: {
              color: [
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            },
            calculable: true
          },
          series: [
            {
              name: 'City',
              type: 'map',
              roam: false,
              map: 'city',
              emphasis: {
                label: {
                  show: true
                }
              },
              data: data
            }
          ]
        };
        this.cityChart.setOption(option,true);
      })
    })
  }
}
