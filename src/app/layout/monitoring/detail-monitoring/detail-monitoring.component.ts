import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { interval, Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import * as echarts from 'echarts';
import { BatteryDetailComponent } from 'src/app/component/battery-detail/battery-detail.component';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { InfoDetailComponent } from 'src/app/component/info-detail/info-detail.component';
import { UtilService } from 'src/app/service/util.service';
import { StatisticsService } from 'src/app/service/statistics.service';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { DetailMonitoringHistoryComponent } from 'src/app/component/detail-monitoring-history/detail-monitoring-history.component';
import { CommonConstant } from 'src/app/util/common-constant';


@Component({
  selector: 'app-detail-monitoring',
  templateUrl: './detail-monitoring.component.html',
  styleUrls: ['./detail-monitoring.component.css']
})

export class DetailMonitoringComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  @ViewChild('vinHistoryGrid', { read: ElementRef }) vinHistoryGrid : ElementRef;
  

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
  historySubject : string = 'CAR'

  historyDataList : any[] = []

  columnDefs: ColDef[] = [
    { field: 'time',headerName: "time", width:180},
    { field: 'state',headerName: "state"},
    { field: 'chargeState',headerName: "chargeState"},
    { field: 'driveMode',headerName: "driveMode"},
    { field: 'speed',headerName: "speed"},
    { field: 'drivenDistance',headerName: "drivenDistance"},
    { field: 'totalVolt',headerName: "totalVolt"},
    { field: 'totalAmpere',headerName: "totalAmpere"},
    { field: 'soc',headerName: "soc"},
    { field: 'dcdcState',headerName: "dcdcState"},
    { field: 'accel',headerName: "accel"},
    { field: 'breaking',headerName: "breaking"},
    { field: 'gearState',headerName: "gearState"},
    { field: 'resistance',headerName: "resistance"},
    { field: 'acceleratorVal',headerName: "acceleratorVal"},
    { field: 'breakState',headerName: "breakState"},
  ];

  defaultColDef: ColDef = {
    editable: false,
    resizable: true,
  };

  gridApi!: GridApi;
  gridColumnApi : any

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  provinceJSONData : any = {}
  subPrefectureeJSONData : any = {}

  soc : number = 0;



  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.listBtn$)this.listBtn$.unsubscribe()
    if(this.interval)this.interval.unsubscribe()
    if(this.currentTimeInterval)this.currentTimeInterval.unsubscribe()
    if(this.vinCountInterval)this.vinCountInterval.unsubscribe()
    if(this.page$)this.page$.unsubscribe()
  }

  ngOnInit(): void {

    this.getProvinceData()
    this.getSubPrefectureeData()
    this.currentTimeInterval = interval(1000).pipe().subscribe(x => this.currentTime = new Date());

    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3.5,
        minZoom : 3.5,
        center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

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
          'circle-color': [
            'case',
            ['==', ['get', 'vehicle.isLogin'], true],
            '#11b4da', // Blue color for logged-in vehicles
            '#FF0000' // Red color for logged-out vehicles
          ],
          'circle-radius': 4,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fff'
        }
      });
      
      
      

//       const vehicleBrief = [{isLogin: true, vin: "60622400004718376", regNumber: "临BF00001", nemsSn: "NEMSDYKBDE70553"}, {isLogin: false, vin: "KNAC581E1P5137594", regNumber: "1", nemsSn: "NEMSDYKBDP00092"}];

// // Check if isLogin property exists and its type is boolean
//      if (vehicleBrief && vehicleBrief.length > 0) {
//       const firstVehicle = vehicleBrief[0];
//      if ('isLogin' in firstVehicle && typeof firstVehicle.isLogin === 'boolean') {
//       console.log('isLogin property exists and is of boolean type.');
//     } else {
//       console.log('isLogin property does not exist or is not a boolean.');
//     }
//    } else {
//      console.log('No data available in vehicleBrief.');
//   }

      
      

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
        if(this.map.getZoom() > 5 && this.map.getZoom() < 9){
          this.getProvinceStatisticsRegistrationCount()
        }else if(this.map.getZoom() >= 9 && this.selectVehicle == null){
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

      this.vinCountInterval = interval(60000).pipe().subscribe(x=>{

        if(this.selectVehicle == null){
          this.getStatisticsRegistrationCount()
          if(this.map.getZoom() > 5 && this.map.getZoom() < 9){
            this.getProvinceStatisticsRegistrationCount()
          }else if(this.map.getZoom() >= 9){
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
    //this.setBatteryChart()
    this.getRealtimedataVehiclelist()

    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page

      this.getRealtimedataInfoVinSubject()

    })
  }

  getPageSize(){
    this.gridHeight = this.vinHistoryGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize && this.selectVehicle){
      this.getRealtimedataInfoVinSubject()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.vinHistoryGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if((this.vinHistoryGrid.nativeElement.offsetWidth > 1830 && this.searchFilter.subject == 'CAR') ||
    this.searchFilter.subject == 'MOTOR' ||
    (this.vinHistoryGrid.nativeElement.offsetWidth > 2340 && this.searchFilter.subject == 'FUELBATTERY')||
    this.searchFilter.subject == 'ENGINE' ||
    this.searchFilter.subject == 'LOCATION' ||
    (this.vinHistoryGrid.nativeElement.offsetWidth > 2600 && this.searchFilter.subject == 'EXTREMEVALUE')||
    (this.vinHistoryGrid.nativeElement.offsetWidth > 2150 && this.searchFilter.subject == 'WARNING')||
    this.searchFilter.subject == 'POWERBATTERYINFO' ||
    this.searchFilter.subject == 'POWERBATTERYTEMPERATURE' ||
    this.searchFilter.subject == 'USERDEFINE'){
      this.gridApi.sizeColumnsToFit()
    }
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

      this.interval = interval(7000).pipe().subscribe(x =>{
        this.getRealtimedataInfoVin()
        this.getRealtimedataPathVin()
        //this.getRealtimedataInfoVinSubject()
      }
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
        if (error.status === 401 && error.error === "Unauthorized") {
          this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
          // Redirect to the login page
          this.router.navigate(['/component/login']);
        }
      })
  }

  clickVin(vehicle : any){
    this.map.setLayoutProperty("realtimedata-location-clusters", 'visibility', 'none')
    this.realTimeOnOff = false
    this.selectVehicle = vehicle
    this.isPanelOnOff = true
    this.getRealtimedataInfoVin()
    this.getRealtimedataPathVin()
    this.getRealtimedataInfoVinSubject()
  }

  getRealtimedataInfoVin(){

    let filter = new SearchFilter()
    filter.vin = this.selectVehicle.vin
    filter.time = new Date().toISOString()

    /*if(this.startRealTime == null){

    }else {
      filter.time = this.startRealTime.toISOString()
    }*/

    this.realtimedataService.getRealtimedataInfoVin(filter).subscribe(res=>{
      console.log(res)

      this.selectVehicleInfo = res.body
      this.setSpeedChartOption(this.selectVehicleInfo.car.speed)
      this.soc = this.selectVehicleInfo.car.soc
      //this.setBatteryChartOption(this.selectVehicleInfo.car.soc)

      if(this.realTimeOnOff){
        this.map.flyTo({
          center: [res.body.location.longitude,res.body.location.latitude],
          duration: 1500,
        });
      }else{
        this.map.flyTo({
          center: [res.body.location.longitude,res.body.location.latitude],
          duration: 1500,
          zoom: 13
        });
      }


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

  getRealtimedataInfoVinSubject(){

    if(!this.selectVehicle){
      return
    }

    this.searchFilter.vin = this.selectVehicle.vin
    this.searchFilter.subject = this.historySubject

    if(this.historyStartDate){
      this.searchFilter.begin = this.historyStartDate.toISOString()
    }else{
      this.searchFilter.begin = undefined
    }

    if(this.historyEndDate){
      this.searchFilter.end = this.historyEndDate.toISOString()
    }else{
      this.searchFilter.end = undefined
    }

    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize


    this.realtimedataService.getRealtimedataInfoVinSubject(this.searchFilter).subscribe(res=>{
      console.log(res)

      let pagination = {
        count : 0,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      if(this.historySubject == 'CAR'){

        if(res.body.car){
          this.historyDataList = res.body.car.carHistory
          pagination.count = res.body.car.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time' },
          { field: 'state',headerName: "state", width:80, tooltipField: 'state'},
          { field: 'chargeState',headerName: "chargeState", width:120, tooltipField: 'chargeState'},
          { field: 'driveMode',headerName: "driveMode", width:120, tooltipField: 'driveMode'},
          { field: 'speed',headerName: "speed", width:80, tooltipField: 'speed'},
          { field: 'drivenDistance',headerName: "drivenDistance", width:150, tooltipField: 'drivenDistance'},
          { field: 'totalVolt',headerName: "totalVolt", width:100, tooltipField: 'totalVolt'},
          { field: 'totalAmpere',headerName: "totalAmpere", width:130, tooltipField: 'totalAmpere'},
          { field: 'soc',headerName: "soc", width:80, tooltipField: 'soc'},
          { field: 'dcdcState',headerName: "dcdcState", width:130, tooltipField: 'dcdcState'},
          { field: 'accel',headerName: "accel", width:80, tooltipField: 'accel'},
          { field: 'braking',headerName: "braking", width:100, tooltipField: 'braking'},
          { field: 'gearState',headerName: "gearState", width:100, tooltipField: 'gearState'},
          { field: 'resistance',headerName: "resistance", width:120, tooltipField: 'resistance'},
          { field: 'acceleratorVal',headerName: "acceleratorVal", width:140, tooltipField: 'acceleratorVal'},
          { field: 'brakeState',headerName: "brakeState", width:120, tooltipField: 'brakeState'},
        ];

        if((this.vinHistoryGrid.nativeElement.offsetWidth > 1830 )){
          setTimeout(()=>{
            this.gridApi.sizeColumnsToFit()
          })
        }

      }else if(this.historySubject == 'MOTOR'){
        if(res.body.motor){
          this.historyDataList = res.body.motor.motorHistory
          pagination.count = res.body.motor.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time'},
          { field: 'serialNo',headerName: "serialNo", width:120, tooltipField: 'serialNo'},
          { field: 'state',headerName: "state", width:80, tooltipField: 'state'},
          { field: 'controllerTemp',headerName: "controllerTemp", width:150, tooltipField: 'controllerTemp'},
          { field: 'rpm',headerName: "rpm", width:80, tooltipField: 'rpm'},
          { field: 'torq',headerName: "torq", width:80, tooltipField: 'torq'},
          { field: 'temp',headerName: "temp", width:80, tooltipField: 'temp'},
          { field: 'inputVolt',headerName: "inputVolt", width:100, tooltipField: 'inputVolt'},
          { field: 'controllerDcBusAmpere',headerName: "controllerDcBusAmpere", tooltipField: 'controllerDcBusAmpere'},
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)

      }else if(this.historySubject == 'FUELBATTERY'){

        if(res.body.fuelBattery){
          this.historyDataList = res.body.fuelBattery.fuelBatteryHistory
          pagination.count = res.body.fuelBattery.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time'},
          { field: 'volt',headerName: "volt", width:70, tooltipField: 'volt'},
          { field: 'ampere',headerName: "ampere", width:90, tooltipField: 'ampere'},
          { field: 'attritionRate',headerName: "attritionRate", width:130, tooltipField: 'attritionRate'},
          { field: 'tempProbeCnt',headerName: "tempProbeCnt", width:150, tooltipField: 'tempProbeCnt'},
          { field: 'probeTemps',headerName: "probeTemps", width:120, tooltipField: 'probeTemps'},
          { field: 'hydrogenMaxTemp',headerName: "hydrogenMaxTemp", width:180, tooltipField: 'hydrogenMaxTemp'},
          { field: 'hydrogenMaxProbeCode',headerName: "hydrogenMaxProbeCode", width:210, tooltipField: 'hydrogenMaxProbeCode'},
          { field: 'hydrogenMaxConcentration',headerName: "hydrogenMaxConcentration", width:230, tooltipField: 'hydrogenMaxConcentration'},
          { field: 'hydrogenMaxConcentrationSensorCode',headerName: "hydrogenMaxConcentrationSensorCode", width:320, tooltipField: 'hydrogenMaxConcentrationSensorCode'},
          { field: 'hydrogenMaxPressure',headerName: "hydrogenMaxPressure", width:190, tooltipField: 'hydrogenMaxPressure'},
          { field: 'hydrogenMaxPressureSensorCode',headerName: "hydrogenMaxPressureSensorCode", width:270, tooltipField: 'hydrogenMaxPressureSensorCode'},
          { field: 'maxPressureDcdcState',headerName: "maxPressureDcdcState", tooltipField: 'maxPressureDcdcState'},
        ];

        if(this.vinHistoryGrid.nativeElement.offsetWidth > 2340){
          setTimeout(()=>{
            this.gridApi.sizeColumnsToFit()
          })
        }

      }else if(this.historySubject == 'ENGINE'){

        if(res.body.engine){
          this.historyDataList = res.body.engine.engineHistory
          pagination.count = res.body.engine.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'time'},
          { field: 'state',headerName: "state", tooltipField: 'state'},
          { field: 'crankshaftRotationVelocity',headerName: "crankshaftRotationVelocity", tooltipField: 'crankshaftRotationVelocity'},
          { field: 'fuelConsumption',headerName: "fuelConsumption", tooltipField: 'fuelConsumption'}
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)


      }else if(this.historySubject == 'LOCATION'){

        if(res.body.location){
          this.historyDataList = res.body.location.locationHistory
          pagination.count = res.body.location.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'time'},
          { field: 'state',headerName: "state", tooltipField: 'state'},
          { field: 'ewFlag',headerName: "ewFlag", tooltipField: 'ewFlag'},
          { field: 'longitude',headerName: "longitude", tooltipField: 'longitude'},
          { field: 'nsFlag',headerName: "nsFlag", tooltipField: 'nsFlag'},
          { field: 'latitude',headerName: "latitude", tooltipField: 'latitude'}
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)

      }else if(this.historySubject == 'EXTREMEVALUE'){

        if(res.body.extremeValue){
          this.historyDataList = res.body.extremeValue.extremeValueHistory
          pagination.count = res.body.extremeValue.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time'},
          { field: 'batteryMaxVoltSubsystemNo',headerName: "batteryMaxVoltSubsystemNo", width:230, tooltipField: 'batteryMaxVoltSubsystemNo'},
          { field: 'batteryMaxVoltCellCode',headerName: "batteryMaxVoltCellCode", tooltipField: 'batteryMaxVoltCellCode'},
          { field: 'batteryMaxVolt',headerName: "batteryMaxVolt", width:140, tooltipField: 'batteryMaxVolt'},
          { field: 'batteryMinVoltSubsystemNo',headerName: "batteryMinVoltSubsystemNo", width:230, tooltipField: 'batteryMinVoltSubsystemNo'},
          { field: 'batteryMinVoltCellCode',headerName: "batteryMinVoltCellCode", tooltipField: 'batteryMinVoltCellCode'},
          { field: 'batteryMinVolt',headerName: "batteryMinVolt", width:150, tooltipField: 'batteryMinVolt'},
          { field: 'batteryMaxTempSubsystemNo',headerName: "batteryMaxTempSubsystemNo", width:240, tooltipField: 'batteryMaxTempSubsystemNo'},
          { field: 'batteryMaxTempSensorCode',headerName: "batteryMaxTempSensorCode", width:230, tooltipField: 'batteryMaxTempSensorCode'},
          { field: 'batteryMaxTemp',headerName: "batteryMaxTemp", width:150, tooltipField: 'batteryMaxTemp'},
          { field: 'batteryMinTempSubsystemNo',headerName: "batteryMinTempSubsystemNo", width:240, tooltipField: 'batteryMinTempSubsystemNo'},
          { field: 'batteryMinTempSensorCode',headerName: "batteryMinTempSensorCode", width:230, tooltipField: 'batteryMinTempSensorCode'},
          { field: 'batteryMinTemp',headerName: "batteryMinTemp", width:180, tooltipField: 'batteryMinTemp'}
        ];
        if(this.vinHistoryGrid.nativeElement.offsetWidth > 2600 ){
          setTimeout(()=>{
            this.gridApi.sizeColumnsToFit()
          })
        }
      }else if(this.historySubject == 'WARNING'){

        if(res.body.warning){
          this.historyDataList = res.body.warning.warningHistory
          pagination.count = res.body.warning.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time'},
          { field: 'maxWarning',headerName: "maxWarning", width:180, tooltipField: 'maxWarning'},
          { field: 'flag',headerName: "flag", width:100, tooltipField: 'flag'},
          { field: 'powerBatteryTroubleCnt',headerName: "powerBatteryTroubleCnt", width:220, tooltipField: 'powerBatteryTroubleCnt'},
          { field: 'powerBatteryTroubleCodes',headerName: "powerBatteryTroubleCodes", width:250, tooltipField: 'powerBatteryTroubleCodes'},
          { field: 'motorTroubleCnt',headerName: "motorTroubleCnt", width:180, tooltipField: 'motorTroubleCnt'},
          { field: 'motorTroubleCodes',headerName: "motorTroubleCodes", width:180, tooltipField: 'motorTroubleCodes'},
          { field: 'engineTroubleCnt',headerName: "engineTroubleCnt", width:180, tooltipField: 'engineTroubleCnt'},
          { field: 'engineTroubleCodes',headerName: "engineTroubleCodes", tooltipField: 'engineTroubleCodes'},
          { field: 'etcTroubleCnt',headerName: "etcTroubleCnt", width:150, tooltipField: 'etcTroubleCnt'},
          { field: 'etcTroubleCodes',headerName: "etcTroubleCodes", width:180, tooltipField: 'etcTroubleCodes'},
          { field: 'warningName',headerName: "warningName", width:150, tooltipField: 'warningName'}
        ];

        if(this.vinHistoryGrid.nativeElement.offsetWidth > 2150){
          setTimeout(()=>{
            this.gridApi.sizeColumnsToFit()
          })
        }

      }else if(this.historySubject == 'POWERBATTERYINFO'){
        if(res.body.powerBatteryInfo){
          this.historyDataList = res.body.powerBatteryInfo.powerBatteryInfoHistory
          pagination.count = res.body.powerBatteryInfo.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:180, tooltipField: 'time'},
          { field: 'subsystemNo',headerName: "subsystemNo", width:150, tooltipField: 'subsystemNo'},
          { field: 'volt',headerName: "volt", width:70, tooltipField: 'volt'},
          { field: 'ampere',headerName: "ampere", width:90, tooltipField: 'ampere'},
          { field: 'cellCnt',headerName: "cellCnt", width:100, tooltipField: 'cellCnt'},
          { field: 'frameSequenceNo',headerName: "frameSequenceNo", width:150, tooltipField: 'frameSequenceNo'},
          { field: 'frameSequenceCnt',headerName: "frameSequenceCnt", width:180, tooltipField: 'frameSequenceCnt'},
          { field: 'cellAmperes',headerName: "cellAmperes", width:420, tooltipField: 'cellAmperes' , tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'cellAmperes', type:'cellAmperes' }}
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)

      }else if(this.historySubject == 'POWERBATTERYTEMPERATURE'){
        if(res.body.powerBatteryTemperature){
          this.historyDataList = res.body.powerBatteryTemperature.powerBatteryTemperatureHistory
          pagination.count = res.body.powerBatteryTemperature.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, width:150, tooltipField: 'time'},
          { field: 'subsystemNo',headerName: "subsystemNo", width:150, tooltipField: 'subsystemNo'},
          { field: 'tempProbeCnt',headerName: "tempProbeCnt", width:180, tooltipField: 'tempProbeCnt'},
          { field: 'sensorTemps',headerName: "sensorTemps", width:700, tooltipField: 'sensorTemps'}
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)

      } else if(this.historySubject == 'USERDEFINE'){

        if(res.body.userDefine){
          this.historyDataList = res.body.userDefine.userdefineHistory
          pagination.count = res.body.userDefine.count
        }else{
          this.historyDataList = []
          pagination.count = 0
        }

        this.columnDefs = [
          { field: 'time',headerName: "time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'time'},
          { field: 'len',headerName: "len", tooltipField: 'len'},
          { field: 'userDefineData',headerName: "userDefineData", tooltipField: 'userDefineData'}
        ];

        setTimeout(()=>{
          this.gridApi.sizeColumnsToFit()
        },1)
      }

      this.uiService.setPagination(pagination)


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

    let img : string = "path://M1993 5096 c-28 -24 -28 -24 -31 -169 l-3 -145 -212 -4 c-208 -3 -213 -4 -272 -31 -101 -47 -162 -122 -184 -227 -9 -41 -11 -578 -9 -2165 l3 -2110 22 -47 c30 -66 96 -133 162 -165 l56 -28 1035 0 1035 0 47 22 c66 30 133 96 165 162 l28 56 3 2110 c2 1587 0 2124 -9 2165 -22 105 -83 180 -184 227 -59 27 -64 28 -272 31 l-212 4 -3 145 c-3 145 -3 145 -31 169 l-28 24 -539 0 -539 0 -28 -24z m1130 -1360 c46 -35 46 -35 -121 -663 -88 -326 -156 -595 -154 -598 3 -3 101 -5 219 -5 199 0 214 -1 233 -20 28 -28 34 -63 16 -96 -12 -24 -1019 -1252 -1173 -1432 -25 -29 -56 -57 -69 -62 -34 -13 -82 7 -100 42 -17 34 -30 -20 174 743 l128 480 -210 5 c-138 3 -218 9 -232 17 -32 18 -50 68 -35 99 10 23 1137 1400 1204 1472 24 25 39 32 66 32 20 0 44 -7 54 -14z"

    //"M2467 2801 l-408 -496 185 -3 185 -2 20 -27 c12 -14 21 -39 21 -55 0-16 -52 -223 -115 -460 -64 -237 -114 -435 -113 -439 3 -6 799 953 806 972 2 4 -76 9 -173 11 l-177 3 -24 28 c-13 16 -24 41 -24 57 0 15 52 223 115 460 64 238 115 436 113 440 -2 4 -187 -216 -411 -489z"

    const labelSetting: echarts.PictorialBarSeriesOption['label'] = {
      show: true,
      position: 'inside',
      offset: [0, -20],
      formatter: function (param: any) {
        return param.value + '%';
      },
      fontSize: 18,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#000000'
    };

    option = {
      tooltip: {},
      legend: {
        show:false
      },
      xAxis: {
        data: ['battery'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        max: 100,
        offset: 20,
        splitLine: { show: false }
      },

      grid: {
        top: 'center',
        height: 200
      },
      series: [
        {
          name: '',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: 100,
          label: labelSetting,
          itemStyle: {
            color: '#81c147'
          },
          data: [
            {
              value: data,
              symbol: img

            }
          ],
          z: 10
        },
        {
          name: '',
          type: 'pictorialBar',
          symbolBoundingData: 100,
          animationDuration: 0,
          itemStyle: {
            color: '#ccc'
          },
          tooltip :{
            show:false
          },
          data: [
            {
              value: 0,
              symbol: img
            }
          ]
        }
      ]
    };


    option && this.batteryChart.setOption(option);

  }

  openBattery(e : any){
    e.stopPropagation()
    if(this.selectVehicleInfo){
      const dialogRef = this.dialog.open( BatteryDetailComponent, {
        data:this.selectVehicleInfo,
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){

        }
      });
    }
  }

  changeHistoryMode(e : any){
    this.mode = 'history'
    this.historyEndDate = undefined
    this.historyStartDate = undefined
    this.historySubject = 'CAR'
    setTimeout(()=>{
      this.getPageSize()
    },1)
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
    this.utilService.gridDataToExcelData("monitoring history", this.gridApi ,[])
  }

  getStatisticsRegistrationCount(){
    this.statisticsService.getStatisticsRegistrationCount(new SearchFilter()).subscribe(res=>{
      console.log(res)
      let featuresList : any[] = []
      for(let i = 0; i < res.body.entities.length; i++){
        for(let j = 0; j < this.provinceJSONData.features.length; j++){
          if(this.provinceJSONData.features[j].properties.ADM1_ZH.indexOf(res.body.entities[i].region.province) > -1){
            let lnglat = this.provinceJSONData.features[j].geometry.center
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
      if (error.status === 401 && error.error === "Unauthorized") {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getProvinceData(){
    this.utilService.getProvinceData().subscribe((res2:any)=>{
      this.provinceJSONData = res2
    },error=>{
      console.log(error)
      if (error.status === 401 && error.error === "Unauthorized") {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  async getProvinceStatisticsRegistrationCount(){
    let featuresList : any[] = []

    let mapDiv = document.getElementById('map');
    const northwest = new mapboxgl.Point(0, 0); // 북서 쪽
    const southeast = new mapboxgl.Point(mapDiv.getBoundingClientRect().width, mapDiv.getBoundingClientRect().height); // 남동 쪽

    for(let i = 0; i < this.provinceJSONData.features.length; i++){
      if(this.map.unproject(northwest).lng <= this.provinceJSONData.features[i].geometry.center[0] &&
        this.map.unproject(southeast).lng >= this.provinceJSONData.features[i].geometry.center[0] &&
        this.map.unproject(northwest).lat >= this.provinceJSONData.features[i].geometry.center[1] &&
        this.map.unproject(southeast).lat <= this.provinceJSONData.features[i].geometry.center[1] ){
          let filter = new SearchFilter()
          filter.province = this.provinceJSONData.features[i].properties.ADM1_ZH
          await this.statisticsService.getStatisticsRegistrationCount(filter).toPromise().then(async (res2 : any)=>{
            console.log(res2)

            for(let j = 0; j < res2.body.entities.length; j++){
              for(let k = 0; k < this.subPrefectureeJSONData.features.length; k++){
                if(this.subPrefectureeJSONData.features[k].properties.ADM2_ZH.indexOf(res2.body.entities[j].region.city) > -1){
                  let lnglat = this.subPrefectureeJSONData.features[k].geometry.center
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
        }
    }

    let source = (this.map.getSource("province_statistics_registration_count") as GeoJSONSource).setData({
      "type": "FeatureCollection",
      "features": featuresList
    });
  }

  getSubPrefectureeData(){
    this.utilService.getSubPrefectureeData().toPromise().then(async(res : any)=>{
      this.subPrefectureeJSONData = res
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
      if (error.status === 401 && error.error === "Unauthorized") {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
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
    //this.setBatteryChartOption(0)

    this.map.flyTo({
      center: [this.lng,this.lat],
      duration: 1500,
      zoom: 3.5
    });


    this.map.setLayoutProperty("vehiclePathsLastPoint", 'visibility', 'none');
    this.map.setLayoutProperty("vehiclePathsLine", 'visibility', 'none');

  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

  setAdditional(event:any){
    this.searchFilter.additional = event.checked
  }

  onGridRowDoubleClicked(e : any){
    console.log(e)

    const dialogRef = this.dialog.open( DetailMonitoringHistoryComponent, {
      data:{
        data : e.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });
  }

}
