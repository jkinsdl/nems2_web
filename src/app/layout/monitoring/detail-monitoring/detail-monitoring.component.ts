import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { interval, Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { MapMarkerDetailComponent } from '../../dashboard/map-marker-detail/map-marker-detail.component';
import * as echarts from 'echarts';
import { BatteryDetailComponent } from 'src/app/component/battery-detail/battery-detail.component';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { InfoDetailComponent } from 'src/app/component/info-detail/info-detail.component';
import { UtilService } from 'src/app/service/util.service';
import { StatisticsService } from 'src/app/service/statistics.service';
@Component({
  selector: 'app-detail-monitoring',
  templateUrl: './detail-monitoring.component.html',
  styleUrls: ['./detail-monitoring.component.css']
})

export class DetailMonitoringComponent implements OnInit {

  constructor(private router: Router,
    private activatedRoute : ActivatedRoute,
    private dialog: MatDialog,
    private uiService : UiService,
    private realtimedataService : RealtimedataService,
    private utilService : UtilService,
    private statisticsService : StatisticsService) { }

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 35.8617;
  lng = 97.1954;
  mapPopup : any

  listBtn$ : Subscription

  isPanelOnOff : boolean = false
  vehicleInfo : any [] = []

  realTimeOnOff : boolean = false;

  startRealTime : Date = null
  selectVehicle : any = null
  selectVehicleInfo : any = null

  vinSearchText : string = ""
  interval : any

  vinCountInterval : any

  currentTimeInterval : any
  currentTime : Date = new Date()

  batteryChart : any
  speedChart : any

  mode : string = "map"
  //mode : string = "info"
  //mode : string = "history"

  historyEndDate : Date = new Date()
  historyStartDate : Date = new Date()

  columnDefs: ColDef[] = [
    { field: 'warningLevel',headerName: "warningLevel"},
    { field: 'vin',headerName: "vin"},
    { field: 'warningCode',headerName: "warningCode"},
    { field: 'createTime',headerName: "createTime"},
    { field: 'updateTime',headerName: "updateTime"},
    { field: 'state',headerName: "state"},
    { field: 'maxWarning',headerName: "maxWarning"},
    { field: 'warningFlag',headerName: "warningFlag"},
    { field: 'region',headerName: "region"},
    { field: 'comment',headerName: "comment"},
  ];

  gridApi!: GridApi;
  gridColumnApi : any


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.listBtn$)this.listBtn$.unsubscribe()
    if(this.interval)this.interval.unsubscribe()
    if(this.currentTimeInterval)this.currentTimeInterval.unsubscribe()
    if(this.vinCountInterval)this.vinCountInterval.unsubscribe()
  }

  ngOnInit(): void {

    this.currentTimeInterval = interval(1000).pipe().subscribe(x => this.currentTime = new Date());

    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3.5,
        minZoom : 3.5,
        center: [this.lng, this.lat]
        //center: [120.223329, 33.30857]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    /*for(let i = 0; i< 100; i++){
      let location : mapboxgl.LngLatLike = [(Math.floor(Math.random() * 30000)/1000) + 90, (Math.floor(Math.random() * 15000)/1000) + 25 ]
      let marker = new mapboxgl.Marker().setLngLat(location).addTo(this.map)
      marker.on('click',e=>{
        console.log(e)
      })
    }*/

    console.log('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')

    this.map.on('load', () => {
      let clickedStateId : any = null;
      let clickedADM1_ZH : any = null;
      const popup = new mapboxgl.Popup({closeButton: false});
      this.map.addSource('province', {
        type: 'geojson',
        data: 'assets/data/chn_province_final.json'
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


      this.map.on('click', 'province_click_layer', (e) => {

        if (e.features.length > 0) {
          if (clickedStateId) {
            this.map.setFeatureState(
              { source: 'province', id: clickedStateId },
              { click: false }
            );
          }
          clickedStateId = e.features[0].id;
          clickedADM1_ZH = e.features[0].properties['ADM1_ZH']
          this.map.setFeatureState(
            { source: 'province', id: clickedStateId },
            { click: true }
          );
        }

        if(clickedADM1_ZH){
          this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
            for(let i = 0; i < res.features.length; i++){
              if(res.features[i].properties.ADM1_ZH == clickedADM1_ZH){
                this.map.setFeatureState(
                  { source: 'sub_prefecture', id: res.features[i].id},
                  { click: true }
                );
              }else {
                this.map.setFeatureState(
                  { source: 'sub_prefecture', id:  res.features[i].id },
                  { click: false }
                );
              }
            }
          })
        }
      });

      this.map.on('click', 'province',(e : any) => {
        this.map.flyTo({
          center: e.lngLat,
          duration: 1500,
          zoom: 7
        });
      });



      this.map.addSource('sub_prefecture', {
        type: 'geojson',
        data: 'assets/data/chn_sub_prefecture_v2.json'
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

      this.map.on('click', 'sub_prefecture_click_layer', (e) => {
        clickedADM1_ZH = e.features[0].properties['ADM1_ZH']
        if(clickedADM1_ZH){
          this.utilService.getSubPrefectureeData().toPromise().then((res : any)=>{
            for(let i = 0; i < res.features.length; i++){
              if(res.features[i].properties.ADM1_ZH == clickedADM1_ZH){
                this.map.setFeatureState(
                  { source: 'sub_prefecture', id: res.features[i].id},
                  { click: true }
                );
              }else {
                this.map.setFeatureState(
                  { source: 'sub_prefecture', id:  res.features[i].id },
                  { click: false }
                );
              }
            }
          })
        }
      });

      this.map.on('click', 'sub_prefecture',(e : any) => {
        this.map.flyTo({
          center: e.lngLat,
          duration: 1500,
          zoom: 9
        });
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

      this.map.on('click', 'realtimedata-location-clusters', (e : any) => {
        this.clickVinMarker(e.features[0].properties['vin'])
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

      this.map.addSource('vehiclePaths', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      this.map.addSource('vehiclePathsLast', {
        type: 'geojson',
      });

      this.map.addLayer({
        id: 'vehiclePathsLine',
        type: 'line',
        source: 'vehiclePaths',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00AAFF',
          'line-width': 4
        }
      });

      this.map.addLayer({
        id: 'vehiclePathsLastPoint',
        type: 'circle',
        source: 'vehiclePathsLast',
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff'
        }
      });

      this.map.on('zoomend',e=>{
        console.log(this.map.getZoom())
        if(this.map.getZoom() <= 5){
          this.changeBoundaries('province')
          this.showProvinceLayer()
        }else if(this.map.getZoom() > 5 && this.map.getZoom() < 9){
          this.changeBoundaries('sub_prefecture')
          this.showSubPrefectureLayer()
        }else if(this.map.getZoom() >= 9){
          this.map.setLayoutProperty('province-statistics-registration-count-clusters', 'visibility', 'none');
          this.map.setLayoutProperty("province-statistics-registration-count-text", 'visibility', 'none');
          this.map.setLayoutProperty("statistics-registration-count-clusters", 'visibility', 'none');
          this.map.setLayoutProperty("statistics-registration-count-text", 'visibility', 'none');
          this.map.setLayoutProperty('province', 'visibility', 'none');
          this.map.setLayoutProperty('province_click_layer', 'visibility', 'none');
          this.map.setLayoutProperty('sub_prefecture', 'visibility', 'none');
          this.map.setLayoutProperty('sub_prefecture_click_layer', 'visibility', 'none');
        }

      })

      this.map.on('moveend', e=>{
        if(this.map.getZoom() >= 9 && this.selectVehicle == null){
          this.getRealtimedataLocation()
        }else {
          this.map.setLayoutProperty("realtimedata-location-clusters", 'visibility', 'none');
        }
      })

      if(this.activatedRoute.snapshot.paramMap.get('vin') != null){
        for(let i = 0; i < this.vehicleInfo.length; i++){
          if(this.vehicleInfo[i].vin == this.activatedRoute.snapshot.paramMap.get('vin')){
            this.clickVin(this.vehicleInfo[i])
            break;
          }
        }
      }

      this.changeBoundaries('province')
      this.showProvinceLayer()
      this.getStatisticsRegistrationCount()
      this.getProvinceStatisticsRegistrationCount()

      this.vinCountInterval = interval(10000).pipe().subscribe(x=>{

        if(this.selectVehicle == null){
          this.getStatisticsRegistrationCount()
          this.getProvinceStatisticsRegistrationCount()

          if(this.map.getZoom() >= 9){
            this.getRealtimedataLocation()
          }
        }
      })

    });
    },1)

    this.listBtn$ = this.uiService.listBtn$.subscribe(result=>{
      console.log(result)
    })
    this.setSpeedChart()
    this.setBatteryChart()
    this.getRealtimedataVehiclelist()
  }

  clickVinMarker(vin : string){
    let isVin = false
    for(let i = 0 ; i < this.vehicleInfo.length; i++){
      if(vin == this.vehicleInfo[i].vin){
        this.clickVin(this.vehicleInfo[i])
        isVin = true
        break;
      }
    }

    if(isVin == false){
      console.log('??')
    }
  }

  setRealTimeSwitch(){
    this.realTimeOnOff = !this.realTimeOnOff

    if(this.realTimeOnOff){
      this.startRealTime = new Date()

      this.interval = interval(10000).pipe().subscribe(x =>
        this.getRealtimedataInfoVin()
      );

    }else {
      this.interval.unsubscribe()
      this.startRealTime = null
    }

    console.log(this.realTimeOnOff)
  }

  getRealtimedataVehiclelist(){

    let f = new SearchFilter()
    f.vin = this.vinSearchText
    this.realtimedataService.getRealtimedataVehiclelist(f).subscribe(
      res=>{
        console.log(res)
        this.vehicleInfo = res.body.vehicleBrief
      }, error=>{
        console.log(error)
      })
  }

  clickVin(vehicle : any){
    this.map.setLayoutProperty("realtimedata-location-clusters", 'visibility', 'none')
    this.realTimeOnOff = false
    this.selectVehicle = vehicle
    this.isPanelOnOff = true
    this.getRealtimedataInfoVin()
  }

  getRealtimedataInfoVin(){

    let filter = new SearchFilter()
    filter.vin = this.selectVehicle.vin

    if(this.startRealTime == null){
      filter.time = new Date().toISOString()
    }else {
      filter.time = this.startRealTime.toISOString()
    }

    this.realtimedataService.getRealtimedataInfoVin(filter).subscribe(res=>{
      console.log(res)

      this.selectVehicleInfo = res.body
      this.setSpeedChartOption(this.selectVehicleInfo.car.speed)
      this.setBatteryChartOption(this.selectVehicleInfo.car.soc)

      this.map.flyTo({
        center: [res.body.location.longitude,res.body.location.latitude],
        duration: 1500,
        zoom: 13
      });



      let source = (this.map.getSource("vehiclePathsLast") as GeoJSONSource).setData({
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [res.body.location.longitude,res.body.location.latitude]
        }
      });

      this.map.setLayoutProperty("vehiclePathsLastPoint", 'visibility', 'visible');
    },error=>{
      console.log(error)
    })

    this.getRealtimedataPathVin()

  }

  getRealtimedataPathVin(){

    let filter = new SearchFilter()
    filter.vin = this.selectVehicle.vin
    if(this.startRealTime != null){
      filter.begin = this.startRealTime.toISOString()
    }
    this.realtimedataService.getRealtimedataPathVin(filter).subscribe(res=>{
      console.log(res)
      let coordinates : any[] = []

      for(let i = 0; i < res.body.paths.length; i++){
        coordinates.push([
          res.body.paths[i].longitude,
          res.body.paths[i].latitude
        ])
      }

      let source = (this.map.getSource("vehiclePaths") as GeoJSONSource).setData({
        "type": "Feature",
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      });
      this.map.setLayoutProperty("vehiclePathsLine", 'visibility', 'visible');
    },error=>{
      console.log(error)
    })
  }

  zoomIn(url : string){
    this.router.navigateByUrl('/main/monitoring/detail/zoom/'+url).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  moveListPage(){
    this.router.navigateByUrl('/main/monitoring').then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  panelOnOff(){
    this.isPanelOnOff = !this.isPanelOnOff
  }

  setSpeedChart(){
    console.log("setSpeedChart")
    var dom = document.getElementById('speedChartContiner');
    this.speedChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    this.setSpeedChartOption(0)
  }

  setSpeedChartOption(data : number){
    var option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 240,
          splitNumber: 12,
          itemStyle: {
            color: '#58D9F9',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: true,
            width: 9
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 8,
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 9
            }
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            length: 6,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 8
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: '#fff',
            borderColor: '#999',
            borderWidth: 2,
            lineHeight: 20,
            height: 20,
            borderRadius: 8,
            offsetCenter: [0, '35%'],
            valueAnimation: true,
            formatter: function (value : any) {
              return '{value|' + value.toFixed(0) + '}{unit|km/h}';
            },
            rich: {
              value: {
                fontSize: 20,
                fontWeight: 'bolder',
                color: '#777'
              },
              unit: {
                fontSize: 10,
                color: '#999',
                padding: [0, 0, 0, 10]
              }
            }
          },
          data: [
            {
              value: data
            }
          ]
        }
      ]
    };
    if (option && typeof option === 'object') {
      this.speedChart.setOption(option);
    }
  }

  setBatteryChart(){
    var chartDom = document.getElementById('batteryChartContiner')!;
    this.batteryChart = echarts.init(chartDom);
    this.setBatteryChartOption(0)
  }

  setBatteryChartOption(data :number){
    var option: echarts.EChartsOption;

    const gaugeData = [
      {
        value: data,
        name: 'SOC',
        title: {
          offsetCenter: ['0%', '-20%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '0%']
        }
      }
    ];

    option = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            show: true,
            roundCap: true,
            clip: false,
            width: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                /*{
                  offset: 0,
                  color: 'rgb(0, 255, 0)'
                },
                {
                  offset: 1,
                  color: 'rgb(103, 200, 255)'
                }*/
                {
                  offset: 0,
                  color: 'rgb(15, 246, 3)'
                }])

            }
          },
          axisLine: {
            lineStyle: {
              width: 12,

            }
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 50
          },
          data: gaugeData,
          title: {
            fontSize: 20
          },
          detail: {
            width: 50,
            height: 20,
            fontSize: 20,
            formatter: function (value : any) {
              return '{value|' + value.toFixed(0) + '}{unit|%}';
            },
            rich: {
              value: {
                fontSize: 30,
                fontWeight: 'bolder',
                color: '#000000',
              },
              unit: {
                fontSize: 15,
                color: '#000000',
                padding: [0, 0, 0, 5]
              }
            }
          }
        }
      ]
    };
    option && this.batteryChart.setOption(option);
  }

  openBattery(e : any){
    e.stopPropagation()
    const dialogRef = this.dialog.open( BatteryDetailComponent, {
      data:this.selectVehicleInfo,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  changeHistoryMode(e : any){
    this.mode = 'history'
    this.historyEndDate = new Date()
    this.historyStartDate = new Date()
    this.historyStartDate.setDate(this.historyEndDate.getDate() - 1)
  }

  changeMapMode(e : any){
    this.mode = 'map'
  }

  changeInfoMode(e : any){
    this.mode = 'info'
  }


  setTime(){

    console.log(this.startRealTime)

  }

  historyExport(){

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  openInfoPopup(type : string){
    console.log(type)
    const dialogRef = this.dialog.open( InfoDetailComponent, {
      data: {
        type : type,
        info : this.selectVehicleInfo
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("monitoring history", this.gridApi ,[])
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
          await this.utilService.getSubPrefectureeData().toPromise().then(async(res3 : any)=>{
            console.log(res3)
            for(let j = 0; j < res2.body.entities.length; j++){
              for(let k = 0; k < res3.features.length; k++){
                if(res3.features[k].properties.ADM2_ZH.indexOf(res2.body.entities[j].region.city) > -1){
                  let lnglat = res3.features[k].geometry.center
                  featuresList.push({
                    "type": "Feature",
                    "properties": {
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
    filter.period = 2100000
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


  changeBoundaries(boundaries : string){
    if(boundaries != 'province'){
      this.map.setLayoutProperty('province', 'visibility', 'none');
      this.map.setLayoutProperty('province_click_layer', 'visibility', 'none');
    }

    if(boundaries != 'sub_prefecture'){
      this.map.setLayoutProperty('sub_prefecture', 'visibility', 'none');
      this.map.setLayoutProperty('sub_prefecture_click_layer', 'visibility', 'none');
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

  vinDeSelect(){

    if(this.realTimeOnOff){
      this.setRealTimeSwitch()
    }

    this.selectVehicle = null
    this.selectVehicleInfo = null
    this.setSpeedChartOption(0)
    this.setBatteryChartOption(0)

    this.map.flyTo({
      center: [this.lng,this.lat],
      duration: 1500,
      zoom: 3.5
    });


    this.map.setLayoutProperty("vehiclePathsLastPoint", 'visibility', 'none');
    this.map.setLayoutProperty("vehiclePathsLine", 'visibility', 'none');

  }

}
