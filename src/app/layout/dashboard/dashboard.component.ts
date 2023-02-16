import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private uiService : UiService,
    private statisticsService : StatisticsService,
    private userService : UserService,
    private realtimedataService : RealtimedataService,
    private utilService : UtilService,
    private vehiclewarningService : VehiclewarningService
  ) { }
  menuMode$ : Subscription
  alarmCount$ : Subscription

  map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 37.8617;
  lng = 115.1954;

  mapPopup : any

  currentBoundaries : string = ""
  hoveredStateId : any = null;

  statisticsCurrent : any = {
    totalVehicles: 0,
    totalLoginVehicles: 0,
    totalLogoutVehicles: 0,
    todayRegistVehicles: 0
  }

  arrayTotalVehicles : string[] = []
  statisticsVehiclesSummary : any = {
    totalVehicles: 0,
    newVehicles: 0,
    loginVehicles: 0,
    totalMileage: 0,
    totalEnergyUsage: 0
  }

  alarmStatisticsChart : echarts.ECharts

  alarmListFilter : string = 'NORMAL'
  vehiclewarnings : any[] = []

  lastZoom : number

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.menuMode$)this.menuMode$.unsubscribe()
    if(this.alarmCount$)this.alarmCount$.unsubscribe()
  }

  ngOnInit(): void {
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
        zoom: 3,
        center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {

      this.map.addSource('country_territory', {
        type: 'geojson',
        data: 'assets/data/chn_country_territory.json'
      });

      this.map.addSource('province', {
        type: 'geojson',
        //data: 'assets/data/chn_province.json'
        data: 'assets/data/chn_province_v2.json'
      });

      this.map.addSource('sub_prefecture', {
        type: 'geojson',
        //data: 'assets/data/chn_sub_prefecture.json'
        data: 'assets/data/chn_sub_prefecture_v2.json'
      });

      this.map.addSource('county', {
        type: 'geojson',
        data: 'assets/data/chn_county.json'
      });

      this.map.addSource('statistics_registration_count',{
        type: 'geojson'
      })

      this.map.addSource('province_statistics_registration_count',{
        type: 'geojson'
      })

      this.map.addSource('realtimedataLocation',{
        type: 'geojson'
      })

      this.map.addLayer({
        id: 'realtimedata-location-clusters',
        type: 'circle',
        source: 'realtimedataLocation',
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fff'
        }
      });


      this.map.addLayer({
        id: 'province-statistics-registration-count-clusters',
        type: 'circle',
        source: 'province_statistics_registration_count',
        paint: {
          "circle-radius": 18,
          "circle-color": "#e14a7b"
        }
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


      this.map.addLayer({
        'id': 'country_territory_click_layer',
        'type': 'fill',
        'source': 'country_territory',
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

      let clickedStateId : any = null;
      this.map.on('click', 'country_territory_click_layer', (e) => {
        if (e.features.length > 0) {
          if (clickedStateId) {
            this.map.setFeatureState(
              { source: 'country_territory', id: clickedStateId },
              { click: false } /* 중복 선택하지 않음 true -> 중복선택 */
            );
          }
          clickedStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'country_territory', id: clickedStateId },
            { click: true }
          );
        }
      });

      this.map.addLayer({
        id: 'country_territory',
        type: 'fill',
        source: 'country_territory',
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

      const popup = new mapboxgl.Popup({closeButton: false});

      this.map.on('mousemove', 'country_territory', (e : any) => {
        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'country_territory', id: this.hoveredStateId },
              { hover: false }
            );
          }
          this.hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'country_territory', id: this.hoveredStateId },
            { hover: true }
          );
        }

        popup.setLngLat(e.lngLat)
          .setHTML("ADM0_EN - " + e.features[0].properties.ADM0_EN + "<br>"
          +'ADM0_ZH - ' + e.features[0].properties.ADM0_ZH + "<br>"
          +'ADM0_PCODE - ' + e.features[0].properties.ADM0_PCODE + "<br>")
          .addTo(this.map);
      });

      this.map.on('mouseout', 'country_territory', (e : any) => {
        popup.remove()
      });

      this.map.on('mouseleave', 'country_territory', () => {
        if (this.hoveredStateId != null) {
          this.map.setFeatureState(
            { source: 'country_territory', id: this.hoveredStateId },
            { hover: false }
          );
        }
        this.hoveredStateId = null;
      });

      this.map.on('click', 'country_territory',(e : any) => {
        console.log(e)
        let a = e.features[0].geometry.coordinates[0][0]
        if (a.length > 2) {
          a = e.features[0].geometry.coordinates[0][0][0]
        }
        this.map.flyTo({
          center: a,
          duration: 1500,
          zoom: 7
        });
      });

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
          clickedStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'province', id: clickedStateId },
            { click: true }
          );
        }
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

      this.map.on('mousemove', 'province', (e : any) => {
        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'province', id: this.hoveredStateId },
              { hover: false }
            );
          }
          this.hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'province', id: this.hoveredStateId },
            { hover: true }
          );
        }
        popup.setLngLat(e.lngLat)
          .setHTML('ADM1_EN - ' + e.features[0].properties.ADM1_EN + "<br>"
          +'ADM1_ZH - ' + e.features[0].properties.ADM1_ZH + "<br>"
          +'ADM1_PCODE - ' + e.features[0].properties.ADM1_PCODE + "<br>"
          +'ADM0_EN - ' + e.features[0].properties.ADM0_EN + "<br>"
          +'ADM0_ZH - ' + e.features[0].properties.ADM0_ZH + "<br>"
          +'ADM0_PCODE - ' + e.features[0].properties.ADM0_PCODE + "<br>")
          .addTo(this.map);
      });

      this.map.on('mouseout', 'country_territory', (e : any) => {
        popup.remove()
      });


      this.map.on('mouseleave', 'province', () => {
        if (this.hoveredStateId != null) {
          this.map.setFeatureState(
            { source: 'province', id: this.hoveredStateId },
            { hover: false }
          );
        }
        this.hoveredStateId = null;
      });

      this.map.on('click', 'province',(e : any) => {

        console.log(e)

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

      this.map.on('click', 'sub_prefecture_click_layer', (e) => {
        if (e.features.length > 0) {
          if (clickedStateId) {
            this.map.setFeatureState(
              { source: 'sub_prefecture', id: clickedStateId },
              { click: false }
            );
          }
          clickedStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'sub_prefecture', id: clickedStateId },
            { click: true }
          );
        }
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

      this.map.on('mousemove', 'sub_prefecture', (e : any) => {
        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'sub_prefecture', id: this.hoveredStateId },
              { hover: false }
            );
          }
          this.hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'sub_prefecture', id: this.hoveredStateId },
            { hover: true }
          );
        }
        popup.setLngLat(e.lngLat)
          .setHTML('Admin_type - ' + e.features[0].properties.Admin_type + "<br>"
          +'Adm2_CAP - ' + e.features[0].properties.Adm2_CAP + "<br>"
          +'ADM2_EN - ' + e.features[0].properties.ADM2_EN + "<br>"
          +'ADM2_ZH - ' + e.features[0].properties.ADM2_ZH + "<br>"
          +'ADM2_PCODE - ' + e.features[0].properties.ADM2_PCODE + "<br>"
          +'ADM1_EN - ' + e.features[0].properties.ADM1_EN + "<br>"
          +'ADM1_ZH - ' + e.features[0].properties.ADM1_ZH + "<br>"
          +'ADM1_PCODE - ' + e.features[0].properties.ADM1_PCODE + "<br>"
          +'ADM0_EN - ' + e.features[0].properties.ADM0_EN + "<br>"
          +'ADM0_ZH - ' + e.features[0].properties.ADM0_ZH + "<br>"
          +'ADM0_PCODE - ' + e.features[0].properties.ADM0_PCODE + "<br>")
          .addTo(this.map);
      });

      this.map.on('mouseout', 'country_territory', (e : any) => {
        popup.remove()
      });

      this.map.on('mouseleave', 'sub_prefecture', () => {
        if (this.hoveredStateId != null) {
          this.map.setFeatureState(
            { source: 'sub_prefecture', id: this.hoveredStateId },
            { hover: false }
          );
        }
        this.hoveredStateId = null;
      });

      this.map.on('click', 'sub_prefecture',(e : any) => {
        console.log(e)
        this.map.flyTo({
          center: e.lngLat,
          duration: 1500,
          zoom: 7
        });
      });

      this.map.addLayer({
        'id': 'county_click_layer',
        'type': 'fill',
        'source': 'county',
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

      this.map.on('click', 'county_click_layer', (e) => {
        console.log(e)
        if (e.features.length > 0) {
          if (clickedStateId) {
            this.map.setFeatureState(
              { source: 'county', id: clickedStateId },
              { click: false }
            );
          }
          clickedStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'county', id: clickedStateId },
            { click: true }
          );
        }
      });

      this.map.addLayer({
        id: 'county',
        type: 'fill',
        source: 'county',
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

      this.map.on('mousemove', 'county', (e : any) => {
        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'county', id: this.hoveredStateId },
              { hover: false }
            );
          }
          this.hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'county', id: this.hoveredStateId },
            { hover: true }
          );
        }
        popup.setLngLat(e.lngLat)
          .setHTML('ISO - ' + e.features[0].properties.ISO + "<br>"
          +'NAME_0 - ' + e.features[0].properties.NAME_0 + "<br>"
          +'ID_1 - ' + e.features[0].properties.ID_1 + "<br>"
          +'NAME_1 - ' + e.features[0].properties.NAME_1 + "<br>"
          +'ID_2 - ' + e.features[0].properties.ID_2 + "<br>"
          +'NAME_2 - ' + e.features[0].properties.NAME_2 + "<br>"
          +'ID_3 - ' + e.features[0].properties.ID_3 + "<br>"
          +'NAME_3 - ' + e.features[0].properties.NAME_3 + "<br>"
          +'TYPE_3 - ' + e.features[0].properties.TYPE_3 + "<br>"
          +'ENGTYPE_3 - ' + e.features[0].properties.ENGTYPE_3 + "<br>"
          +'NL_NAME_3 - ' + e.features[0].properties.NL_NAME_3 + "<br>"
          +'VARNAME_3 - ' + e.features[0].properties.VARNAME_3)
          .addTo(this.map);
      });

      this.map.on('mouseout', 'country_territory', (e : any) => {
        popup.remove()
      });

      this.map.on('mouseleave', 'county', () => {
        if (this.hoveredStateId != null) {
          this.map.setFeatureState(
            { source: 'county', id: this.hoveredStateId },
            { hover: false }
          );
        }
        this.hoveredStateId = null;
      });

      this.map.on('click', 'county',(e : any) => {
        console.log(e)
        let a = e.features[0].geometry.coordinates[0][0]
        if (a.length > 2) {
          a = e.features[0].geometry.coordinates[0][0][0]
        }
        this.map.flyTo({
          center: a,
          duration: 1500,
          zoom: 7
        });
      });


      this.map.on('zoomend',e=>{
        console.log(this.map.getZoom())
        if(this.currentBoundaries == 'province'){
          if(this.map.getZoom() > 5){
            this.changeBoundaries('sub_prefecture')
            this.showSubPrefectureLayer()
          }
        }else if(this.currentBoundaries == 'sub_prefecture'){
          if(this.map.getZoom() <= 5){
            this.changeBoundaries('province')
            this.showProvinceLayer()
          }
        }
      })

      this.map.on('moveend', e=>{
        if(this.map.getZoom() >= 13){
          this.getRealtimedataLocation()
        }else {
          this.map.setLayoutProperty("realtimedata-location-clusters", 'visibility', 'none');
        }
      })
      this.refresh()
      this.changeBoundaries('province')
      this.showProvinceLayer()
      this.getStatisticsRegistrationCount()
      this.getProvinceStatisticsRegistrationCount()
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

  refresh(){
    this.getStatisticsCurrent()
    //this.getStatisticsMileages()
    //this.getStatisticsRegistrationSummary()
    this.getStatisticsVehiclesSummary()
    //this.getStatisticsWarningsSummary()
    this.getVehiclewarning()

    this.map.setZoom(3)
    this.map.setCenter([this.lng, this.lat])
  }

  getVehiclewarning(){
    let filter = new SearchFilter()
    filter.level = this.alarmListFilter
    filter.state = 'OPEN'
    this.vehiclewarningService.getVehiclewarning(filter).subscribe(res=>{
      console.log(res)
      this.vehiclewarnings = res.body.warnings
    },error=>{
      console.log(error)
    })
  }

  getRealtimedataLocation(){
    this.map.setLayoutProperty('realtimedata-location-clusters', 'visibility', 'visible');
    let mapDiv = document.getElementById('map');
    const northwest = new mapboxgl.Point(0, 0); // 북서 쪽
    const southeast = new mapboxgl.Point(mapDiv.getBoundingClientRect().width, mapDiv.getBoundingClientRect().height); // 남동 쪽
    let filter = new SearchFilter()
    filter.latitudeBegin = this.map.unproject(southeast).lat
    filter.latitudeEnd = this.map.unproject(northwest).lat
    filter.longitudeBegin = this.map.unproject(northwest).lng
    filter.longitudeEnd = this.map.unproject(southeast).lng

    this.realtimedataService.getRealtimedataLocation(filter).subscribe(res=>{
      console.log(res)

      /*res.body.locations = [{
        vin : 123,
        latitude : this.lat,
        longitude : this.lng
      }]*/

      let featuresList : any[] = []
      for(let i = 0; i < res.body.locations.length; i++){
        featuresList.push({
          "type": "Feature",
          "properties": {
            "vin" : res.body.locations[i].vin
          },
          "geometry": {
            "type": "Point",
              "coordinates": [res.body.locations[i].longitude, res.body.locations[i].latitude]
            },
        })
      }

      (this.map.getSource("realtimedataLocation") as GeoJSONSource).setData({
        "type": "FeatureCollection",
        "features": featuresList
      });



    },error=>{
      console.log(error)
    })
  }

  getStatisticsCurrent(){
    this.statisticsService.getStatisticsCurrent().subscribe(res=>{
      console.log(res)
      this.statisticsCurrent = res.body
      this.arrayTotalVehicles = Array.from(String(this.statisticsCurrent.totalVehicles)).reverse()
    },error=>{
      console.log(error)
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
      this.utilService.getProvinceData().subscribe((res2:any)=>{
        console.log(res2)
        let featuresList : any[] = []
        for(let i = 0; i < res.body.entities.length; i++){
          for(let j = 0; j < res2.features.length; j++){
            if(res2.features[j].properties.ADM1_ZH.indexOf(res.body.entities[i].region.province) > -1){
              let lnglat = res2.features[j].geometry.center
              featuresList.push({
                "type": "Feature",
                "properties": {
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
        console.log(res)
      },error=>{
        console.log(error)
      })
    },error=>{
      console.log(error)
    })
  }

  getProvinceStatisticsRegistrationCount(){
    this.utilService.getProvinceData().subscribe(async (res:any)=>{
      console.log(res)

      let featuresList : any[] = []

      for(let i = 0; i < res.features.length; i++){
        let filter = new SearchFilter()
        filter.province = res.features[i].properties.ADM1_ZH
        await this.statisticsService.getStatisticsRegistrationCount(filter).toPromise().then(async (res2 : any)=>{
          console.log(res2)
          if( res2.body.entities.length > 0){
            console.log("!")
          }
          await this.utilService.getSubPrefectureeData().toPromise().then(async(res3 : any)=>{
            console.log(res3)
            for(let j = 0; j < res2.body.entities.length; j++){
              for(let k = 0; k < res3.features.length; k++){
                if(res3.features[k].properties.ADM1_ZH.indexOf(res2.body.entities[j].region.province) > -1){
                  let lnglat = res3.features[k].geometry.center
                  featuresList.push({
                    "type": "Feature",
                    "properties": {
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
          })
        })

      }

      /*if(true){
        featuresList.push({
          "type": "Feature",
          "properties": {
            "statistics_count" : 123
          },
          "geometry": {
            "type": "Point",
              "coordinates": [this.lng,this.lat]
            },
        })
      }*/


      (this.map.getSource("province_statistics_registration_count") as GeoJSONSource).setData({
        "type": "FeatureCollection",
        "features": featuresList
      });

    },error=>{
      console.log(error)
    })
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
    this.router.navigateByUrl(`/main/alarm)`);
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
    console.log(this.map)
    if(boundaries != 'country_territory'){
      this.map.setLayoutProperty('country_territory', 'visibility', 'none');
      this.map.setLayoutProperty('country_territory_click_layer', 'visibility', 'none');
    }

    if(boundaries != 'province'){
      this.map.setLayoutProperty('province', 'visibility', 'none');
      this.map.setLayoutProperty('province_click_layer', 'visibility', 'none');
    }

    if(boundaries != 'sub_prefecture'){
      this.map.setLayoutProperty('sub_prefecture', 'visibility', 'none');
      this.map.setLayoutProperty('sub_prefecture_click_layer', 'visibility', 'none');
    }

    if(boundaries != 'county'){
      this.map.setLayoutProperty('county', 'visibility', 'none');
      this.map.setLayoutProperty('county_click_layer', 'visibility', 'none');
    }

    this.map.setLayoutProperty(boundaries, 'visibility', 'visible');
    this.map.setLayoutProperty(boundaries+"_click_layer", 'visibility', 'visible');


    console.log(this.map)
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
