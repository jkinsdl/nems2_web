import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { StatisticsService } from 'src/app/service/statistics.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UserService } from 'src/app/service/user.service';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';
import { CommonConstant } from 'src/app/util/common-constant';

import { Subject } from 'rxjs';
//import { forkJoin } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  selectedLanguage: string; // Property to track the selected language(MINE)
  stateOptions: { label: string; value: string; }[];

  @ViewChild('dashBorderAlarmGrid', { read: ElementRef }) alarmGrid : ElementRef;
  // language: string;

  private dataLoadedSubject: Subject<boolean> = new Subject<boolean>();


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private uiService : UiService,
    private statisticsService : StatisticsService,
    private userService : UserService,
    private realtimedataService : RealtimedataService,
    private utilService : UtilService,
    private vehiclewarningService : VehiclewarningService,

    private translate: TranslateService,
    private http: HttpClient,

    
  ) { }
  menuMode$ : Subscription
  alarmCount$ : Subscription

  map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 37.8617;
  lng = 100.1954;

  mapPopup : any

  currentBoundaries : string = ""
  hoveredStateId : any = null;

  statisticsCurrent : any = {
    totalVehicles: 0,
    totalLoginVehicles: 0,
    totalLogoutVehicles: 0,
    todayRegistVehicles: 0
  }

  //arrayTotalVehicles : string[] = []
  statisticsVehiclesSummary : any = {
    totalVehicles: 0,
    newVehicles: 0,
    loginVehicles: 0,
    totalMileage: 0,
    totalEnergyUsage: 0
  }

  alarmStatisticsChart : echarts.ECharts

  criticalVehiclewarnings : any = {
    count : 0,
    entities : [],
    link : {}
  }

  majorVehiclewarnings : any = {
    count : 0,
    entities : [],
    link : {}
  }

  minorVehiclewarnings : any = {
    count : 0,
    entities : [],
    link : {}
  }

  lastZoom : number

  provinceData : any = null
  subPrefectureData : any = null

  province_statistics_registration_count_data : any[] = []
  gridHeight : number


  dashboardInterval : any = null
  dataLoaded: boolean = false;
  

  isProvinceData: boolean = false;
  isSubPrefectureData: boolean =  false;
  isDataDownload: boolean = false;


  onResize(event : any){
    console.log("onResize")
    if(this.gridHeight != this.alarmGrid.nativeElement.offsetHeight){
      this.gridHeight = this.alarmGrid.nativeElement.offsetHeight
      this.getVehiclewarnings()
    }

    this.alarmStatisticsChart.resize();
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.menuMode$)this.menuMode$.unsubscribe()
    if(this.alarmCount$)this.alarmCount$.unsubscribe()
    if(this.dashboardInterval)clearInterval(this.dashboardInterval)
  }

  ngOnInit(): void {
 // Retrieve the selected language from storage or set a default value
 this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

 // Set the default language
 this.translate.setDefaultLang('en');

 // Load the translation file for the selected language
 const languageToLoad = this.selectedLanguage;
 const translationFile = `../assets/i18n/dashboard/${languageToLoad}.json`;
 //const dataLoaded = localStorage.getItem('dataLoaded');

 this.translate.use(languageToLoad).subscribe(() => {
   this.http.get<any>(translationFile).subscribe((data) => {
     this.translate.setTranslation(languageToLoad, data);
     console.log('Translation file loaded successfully');
     
   });
 });
    //this.utilService.getProvinceData().subscribe((res:any)=>{
      //if (!this.provinceData) {
    //if (!this.provinceData) {
      this.utilService.getProvinceData().subscribe((res:any)=>{ 
        //if (!this.isDataDownload) {
        this.provinceData = res
        console.log("Final", res);
        this.isProvinceData = true;
      });
   // }
      
    //}
  
    //this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
      //if (!this.subPrefectureData){
    // if (!this.subPrefectureData) {
      this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
        //if (!this.isDataDownload) {
        this.subPrefectureData = res
        console.log("subPrefecture", res)
        this.isSubPrefectureData = true;
        });
   // }
   // }

    this.menuMode$ = this.uiService.menuMode$.subscribe(mode =>{
      if(mode == 2) {
        setTimeout(()=>{
          this.map.resize()
        },600)
      }
    })

    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3.5,
        minZoom : 3.5,
        maxZoom : 9,
        center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {

    //   if (!this.provinceData) {
    //     this.utilService.getProvinceData().subscribe((res:any)=>{ 
    //       //if (!this.provinceData) {
    //       this.provinceData = res
    //       console.log("Final", res);
    //       this.provinceData = true;
    //     //}
    //    });
    //  }
        
    //   //}
    
    //   //this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
    //     //if (!this.subPrefectureData){
    //   if (!this.subPrefectureData) {
    //     this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
    //      // if (!this.subPrefectureData) {
    //       this.subPrefectureData = res
    //       console.log("subPrefecture", res)
    //       this.subPrefectureData = true;
    //     //}
    //   });
    //   }
  
    //   this.menuMode$ = this.uiService.menuMode$.subscribe(mode =>{
    //     if(mode == 2) {
    //       setTimeout(()=>{
    //         this.map.resize()
    //       },600)
    //     }
    //   })
       
      this.map.addSource('province', {
        type: 'geojson',
        data: 'assets/data/chn_province_final.json'
      });

      this.map.addSource('sub_prefecture', {
        type: 'geojson',
        data: 'assets/data/chn_sub_prefecture_v2.json'
      });

      this.map.addSource('sub_prefecture2', {
        type: 'geojson',
        data: 'assets/data/chn_sub_prefecture_v2.json'
      });

      this.map.addSource('statistics_registration_count',{
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": []
        }
      })

      this.map.addSource('province_statistics_registration_count',{
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": []
        }
      })
   
      this.map.addLayer({
        id: 'province-statistics-registration-count-clusters',
        type: 'circle',
        source: 'province_statistics_registration_count',
        paint: {
          "circle-radius": 18,
          "circle-color": "#e14a7b",
        },

      });

      this.map.on('mousemove', 'province-statistics-registration-count-clusters', (e : any) => {
        popup.setLngLat(e.lngLat)
          .setHTML('province - ' + e.features[0].properties.province + "<br>"
          +'city - '+ e.features[0].properties.city + "<br>"
          +'registered car - '+ e.features[0].properties.statistics_count + "<br>")
          .addTo(this.map);
      });

      this.map.on('mouseout', 'province-statistics-registration-count-clusters', (e : any) => {
        popup.remove()
      });

      this.map.addLayer({
        id: 'province-statistics-registration-count-text',
        type: 'symbol',
        source: 'province_statistics_registration_count',
        layout: {
        'text-field': '{statistics_count}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        }
      });

      this.map.addLayer({
        id: 'statistics-registration-count-clusters',
        type: 'circle',
        source: 'statistics_registration_count',
        paint: {
          "circle-radius": 18,
          "circle-color": "#3887be"
        }
      });

      this.map.on('mousemove', 'statistics-registration-count-clusters', (e : any) => {
        popup.setLngLat(e.lngLat)
          .setHTML('province - ' + e.features[0].properties.province + "<br>"
          +'registered car - '+ e.features[0].properties.statistics_count + "<br>")
          .addTo(this.map);
      });

      this.map.on('mouseout', 'statistics-registration-count-clusters', (e : any) => {
        popup.remove()
      });


      this.map.addLayer({
        id: 'statistics-registration-count-text',
        type: 'symbol',
        source: 'statistics_registration_count',
        layout: {
        'text-field': '{statistics_count}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        }
      });


      let clickedStateId : any = null;
      let clickedADM1_ZH : any = null;
      let clickedCityId : any = null

      const popup = new mapboxgl.Popup({closeButton: false});

      this.map.addLayer({
        'id': 'province_click_layer',
        'type': 'fill',
        'source': 'province',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            0.5,
            0.1
          ]
        }
      });

      this.map.on('click', 'province_click_layer', (e) => {
        if (e.features.length > 0) {
          if (clickedStateId) {
            this.map.setFeatureState(
              { source: 'province', id: clickedStateId },
              { click: false }
            );
          }

          if (clickedCityId) {
            this.map.setFeatureState(
              { source: 'sub_prefecture2', id: clickedCityId },
              { click: false }
            );
          }

          clickedCityId = null
          clickedStateId = e.features[0].id;
          clickedADM1_ZH = e.features[0].properties['ADM1_ZH']
          this.map.setFeatureState(
            { source: 'province', id: clickedStateId },
            { click: true }
          );
        }

        if(clickedADM1_ZH){
          if (!this.isSubPrefectureData) {

          }
          
          for(let i = 0; i < this.subPrefectureData.features.length; i++){
            if(this.subPrefectureData.features[i].properties.ADM1_ZH == clickedADM1_ZH){
              this.map.setFeatureState(
                { source: 'sub_prefecture', id: this.subPrefectureData.features[i].id},
                { click: true }
              );
            }else {
              this.map.setFeatureState(
                { source: 'sub_prefecture', id:  this.subPrefectureData.features[i].id },
                { click: false }
              );
            }
          }
        }

        this.map.moveLayer('statistics-registration-count-clusters')
        this.map.moveLayer('statistics-registration-count-text')
        this.map.moveLayer('province-statistics-registration-count-clusters')
        this.map.moveLayer('province-statistics-registration-count-text')

      });

      this.map.addLayer({
        id: 'province',
        type: 'fill',
        source: 'province',
        layout: {},
        paint: {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.3
          ]
        }
      });

      this.map.on('click', 'province',(e : any) => {
        this.map.flyTo({
          center: e.lngLat,
          duration: 1500,
          zoom: 7
        });
      });

      this.map.addLayer({
        'id': 'sub_prefecture_click_layer',
        'type': 'fill',
        'source': 'sub_prefecture',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            0.5,
            0.1
          ]
        }
      });

      this.map.addLayer({
        'id': 'sub_prefecture_click_layer2',
        'type': 'fill',
        'source': 'sub_prefecture2',
        'layout': {},
        'paint': {
          'fill-color': '#c16285',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            0.5,
            0
          ]
        }
      });
//
      this.map.on('click', 'sub_prefecture_click_layer', (e) => {
        clickedADM1_ZH = e.features[0].properties['ADM1_ZH']

        if (e.features.length > 0) {
          if (clickedCityId) {
            this.map.setFeatureState(
              { source: 'sub_prefecture2', id: clickedCityId },
              { click: false }
            );
          }
          clickedCityId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'sub_prefecture2', id: clickedCityId },
            { click: true }
          );
        }

        if (clickedStateId) {
          this.map.setFeatureState(
            { source: 'province', id: clickedStateId },
            { click: false }
          );
        }

        // if (!this.isSubPrefectureData) {

        // }
        for(let i = 0; i < this.provinceData.features.length; i++){
          if(this.provinceData.features[i].properties.ADM1_ZH == clickedADM1_ZH){
            clickedStateId = this.provinceData.features[i].id;
            break;
          }
        }

        this.map.setFeatureState(
          { source: 'province', id: clickedStateId },
          { click: true }
        );

        if(clickedADM1_ZH){
          if (!this.isSubPrefectureData) {

          }
          for(let i = 0; i < this.subPrefectureData.features.length; i++){
            if(this.subPrefectureData.features[i].properties.ADM1_ZH == clickedADM1_ZH){
              this.map.setFeatureState(
                { source: 'sub_prefecture', id: this.subPrefectureData.features[i].id},
                { click: true }
              );
            }else {
              this.map.setFeatureState(
                { source: 'sub_prefecture', id:  this.subPrefectureData.features[i].id },
                { click: false }
              );
            }
          }
        }

        this.map.moveLayer('statistics-registration-count-clusters')
        this.map.moveLayer('statistics-registration-count-text')
        this.map.moveLayer('province-statistics-registration-count-clusters')
        this.map.moveLayer('province-statistics-registration-count-text')

      });

      this.map.addLayer({
        id: 'sub_prefecture',
        type: 'fill',
        source: 'sub_prefecture',
        layout: {},
        paint: {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.3
          ]
        }
      });

      this.map.on('click', 'sub_prefecture',(e : any) => {
        console.log(e)
        this.map.flyTo({
          center: e.lngLat,
          duration: 1500,
          zoom: 7
        });
      });

      this.map.on('zoomend',e=>{
        console.log(this.map.getZoom())
        if(this.map.getZoom() <= 5){
          this.changeBoundaries('province')
          this.showProvinceLayer()
        }else if(this.map.getZoom() > 5 && this.map.getZoom() < 13){
          this.changeBoundaries('sub_prefecture')
          this.showSubPrefectureLayer()
        }else if(this.map.getZoom() >= 13){
          this.map.setLayoutProperty('province-statistics-registration-count-clusters', 'visibility', 'none');
          this.map.setLayoutProperty("province-statistics-registration-count-text", 'visibility', 'none');
          this.map.setLayoutProperty("statistics-registration-count-clusters", 'visibility', 'none');
          this.map.setLayoutProperty("statistics-registration-count-text", 'visibility', 'none');
        }
      })

      this.map.on('moveend', e=>{
        if(this.map.getZoom() > 5){
          this.getProvinceStatisticsRegistrationCount()
        }
      })

      this.refresh()
      this.changeBoundaries('province')
      this.showProvinceLayer()
      this.getStatisticsRegistrationCount()
      //this.getProvinceStatisticsRegistrationCount()

      this.dashboardInterval = setInterval(()=>{
        this.getStatisticsCurrent()
        //this.getStatisticsMileages()
        //this.getStatisticsRegistrationSummary()
        this.getStatisticsVehiclesSummary()
        //this.getStatisticsWarningsSummary()
        this.gridHeight = this.alarmGrid.nativeElement.offsetHeight
        this.getVehiclewarnings()
      },10000)

    });
  },1)

    this.setPieChart()

    this.alarmCount$ = this.realtimedataService.alarmCount$.subscribe((result:any)=>{
      let alamr = [
        { value: result.critical, name: 'critical' },
        { value: result.major, name: 'major' },
        { value: result.minor, name: 'minor' },
      ]
      this.setAlarmStatisticsChartData(alamr)
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
   this.translate.use(language).subscribe(() => {
     // Translation changed successfully
   });
 }

  refresh(){
    this.getStatisticsCurrent()
    //this.getStatisticsMileages()
    //this.getStatisticsRegistrationSummary()
    this.getStatisticsVehiclesSummary()
    //this.getStatisticsWarningsSummary()
    this.gridHeight = this.alarmGrid.nativeElement.offsetHeight
    this.getVehiclewarnings()

    this.map.setZoom(3.5)
    this.map.setCenter([this.lng, this.lat])

    this.province_statistics_registration_count_data = []
  }

  getVehiclewarnings(){
    let filter = new SearchFilter()
    filter.warningLevel = []
    filter.warningLevel.push('CRITICAL')
    filter.state = []
    filter.state.push('OPEN')
    filter.state.push('PROGRESS')
    filter.state.push('ERROR')
    filter.desc = []
    filter.desc.push('CREATE_TIME')
    filter.limit = Math.floor((this.gridHeight - 50 - 48 - 50) / 30)

    this.vehiclewarningService.getVehiclewarnings(filter).subscribe(res=>{
      console.log("Warning",res)
      this.criticalVehiclewarnings = res.body
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    });

    filter.warningLevel = []
    filter.warningLevel.push('MAJOR')

    this.vehiclewarningService.getVehiclewarnings(filter).subscribe(res=>{
      console.log(res)
      this.majorVehiclewarnings = res.body
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })

    filter.warningLevel = []
    filter.warningLevel.push('MINOR')

    this.vehiclewarningService.getVehiclewarnings(filter).subscribe(res=>{
      console.log(res)
      this.minorVehiclewarnings = res.body
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getStatisticsCurrent(){
    this.statisticsService.getStatisticsCurrent().subscribe(res=>{
      console.log(res)
      this.statisticsCurrent = res.body
      //this.arrayTotalVehicles = Array.from(String(this.statisticsCurrent.totalVehicles)).reverse()
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getStatisticsMileages(){
    this.statisticsService.getStatisticsMileages(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getStatisticsRegistrationCount(){
    this.statisticsService.getStatisticsRegistrationCount(new SearchFilter()).subscribe(res=>{
      console.log(res)

      if (!this.isProvinceData) {

      }

      let featuresList : any[] = []

      for(let i = 0; i < res.body.entities.length; i++){
        for(let j = 0; j < this.provinceData.features.length; j++){
          if(this.provinceData.features[j].properties.ADM1_ZH.indexOf(res.body.entities[i].region.province) > -1){
            let lnglat = this.provinceData.features[j].geometry.center
            featuresList.push({
              "type": "Feature",
              "properties": {
                "pcode" : res.body.entities[i].region.pcode,
                "zipCode" : res.body.entities[i].region.zipCode,
                "placeCode" : res.body.entities[i].region.placeCode,
                "districtCode" : res.body.entities[i].region.districtCode,
                "province" : res.body.entities[i].region.province,
                "city" : res.body.entities[i].region.city,
                "district" : res.body.entities[i].region.district,
                "street" : res.body.entities[i].street,
                "statistics_count" : res.body.entities[i].count
              },
              "geometry": {
                "type": "Point",
                "coordinates": lnglat
              },
            })
            break;
          }
        }
      }
      (this.map.getSource("statistics_registration_count") as GeoJSONSource).setData({
        "type": "FeatureCollection",
        "features": featuresList
      });
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  async getProvinceStatisticsRegistrationCount(){
    let mapDiv = document.getElementById('map');
    const northwest = new mapboxgl.Point(0, 0); // 북서 쪽
    const southeast = new mapboxgl.Point(mapDiv.getBoundingClientRect().width, mapDiv.getBoundingClientRect().height); // 남동 쪽
    if (!this.isProvinceData) {

    }
    for(let i = 0; i < this.provinceData.features.length; i++){
      if(this.province_statistics_registration_count_data.map(e=>e.properties.ADM1_ZH).indexOf(this.provinceData.features[i].properties.ADM1_ZH) < 0 &&
        this.map.unproject(northwest).lng <= this.provinceData.features[i].geometry.center[0] &&
        this.map.unproject(southeast).lng >= this.provinceData.features[i].geometry.center[0] &&
        this.map.unproject(northwest).lat >= this.provinceData.features[i].geometry.center[1] &&
        this.map.unproject(southeast).lat <= this.provinceData.features[i].geometry.center[1] ){
        let filter = new SearchFilter()
        filter.province = this.provinceData.features[i].properties.ADM1_ZH
        await this.statisticsService.getStatisticsRegistrationCount(filter).toPromise().then(async (res2 : any)=>{
          console.log("staticService", res2)
          for(let j = 0; j < res2.body.entities.length; j++){
            for(let k = 0; k < this.subPrefectureData.features.length; k++){
              if(this.subPrefectureData.features[k].properties.ADM2_ZH.indexOf(res2.body.entities[j].region.city) > -1){
                let lnglat = this.subPrefectureData.features[k].geometry.center
                this.province_statistics_registration_count_data.push({
                  "type": "Feature",
                  "properties": {
                    'ADM1_ZH' : this.provinceData.features[i].properties.ADM1_ZH,
                    "pcode" : res2.body.entities[j].region.pcode,
                    "zipCode" : res2.body.entities[j].region.zipCode,
                    "placeCode" : res2.body.entities[j].region.placeCode,
                    "districtCode" : res2.body.entities[j].region.districtCode,
                    "province" : res2.body.entities[j].region.province,
                    "city" : res2.body.entities[j].region.city,
                    "district" : res2.body.entities[j].region.district,
                    "street" : res2.body.entities[j].street,
                    "statistics_count" : res2.body.entities[j].count
                  },
                  "geometry": {
                    "type": "Point",
                      "coordinates": lnglat
                    },
                })
                break;
              }
            }
          }
        })
      }
    }

    (this.map.getSource("province_statistics_registration_count") as GeoJSONSource).setData({
      "type": "FeatureCollection",
      "features": this.province_statistics_registration_count_data
    });
  }

  getStatisticsRegistrationSummary(){
    this.statisticsService.getStatisticsRegistrationSummary(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getStatisticsVehiclesSummary(){
    this.statisticsService.getStatisticsVehiclesSummary().subscribe(res=>{
      console.log(res)
      this.statisticsVehiclesSummary = res.body
    },error=>{
      console.log(error)
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getStatisticsWarnings(){
    this.statisticsService.getStatisticsWarnings().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getStatisticsWarningsSummary(){
    this.statisticsService.getStatisticsWarnings().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  pageMoveAlarm(alarm : any){
    console.log(alarm)
    this.router.navigateByUrl(`/main/alarm/${alarm.issueId}/${alarm.warningLevel})`);
  }

  setPieChart(){
    var chartDom = document.getElementById('pieChart')!;
    this.alarmStatisticsChart = echarts.init(chartDom);
    this.setAlarmStatisticsChartData([
      { value: 0, name: 'critical' },
      { value: 0, name: 'major' },
      { value: 0, name: 'minor' },
    ])
  }

  setAlarmStatisticsChartData(data : any[]){
    var option: echarts.EChartsOption;
    //'#FFFF00' yellow
    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: 0,
        left: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          color:['#ff0000','#FF3399','#FFA500'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
    option && this.alarmStatisticsChart.setOption(option);
  }


  changeBoundaries(boundaries : string){
    this.currentBoundaries = boundaries
    this.hoveredStateId = null

    if(boundaries != 'province'){
      this.map.setLayoutProperty('province', 'visibility', 'none');
      this.map.setLayoutProperty('province_click_layer', 'visibility', 'none');
    }

    if(boundaries != 'sub_prefecture'){
      this.map.setLayoutProperty('sub_prefecture', 'visibility', 'none');
      this.map.setLayoutProperty('sub_prefecture_click_layer', 'visibility', 'none');
      this.map.setLayoutProperty('sub_prefecture_click_layer2', 'visibility', 'none');
    }else{
      this.map.setLayoutProperty(boundaries+"_click_layer2", 'visibility', 'visible');
    }

    this.map.setLayoutProperty(boundaries, 'visibility', 'visible');
    this.map.setLayoutProperty(boundaries+"_click_layer", 'visibility', 'visible');

  }


  showProvinceLayer(){
    this.map.setLayoutProperty('province-statistics-registration-count-clusters', 'visibility', 'none');
    this.map.setLayoutProperty("province-statistics-registration-count-text", 'visibility', 'none');


    this.map.setLayoutProperty("statistics-registration-count-clusters", 'visibility', 'visible');
    this.map.setLayoutProperty("statistics-registration-count-text", 'visibility', 'visible');
  }

  showSubPrefectureLayer(){
    this.map.setLayoutProperty("statistics-registration-count-clusters", 'visibility', 'none');
    this.map.setLayoutProperty("statistics-registration-count-text", 'visibility', 'none');

    this.map.setLayoutProperty('province-statistics-registration-count-clusters', 'visibility', 'visible');
    this.map.setLayoutProperty("province-statistics-registration-count-text", 'visibility', 'visible');
  }

}
