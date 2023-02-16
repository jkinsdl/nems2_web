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
    private realtimedataService : RealtimedataService) { }

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 35.8617;
  lng = 104.1954;
  mapPopup : any

  listBtn$ : Subscription

  isBatteryPanelOnOff : boolean = false
  isSpeedPanelOnOff : boolean = false
  vehicleInfo : any [] = []

  realTimeOnOff : boolean = false;

  startRealTime : Date = null
  selectVehicle : any = null
  selectVehicleInfo : any = null

  vinSearchText : string = ""
  interval : any

  currentTimeInterval : any
  currentTime : Date = new Date()

  batteryChart : any
  speedChart : any
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.listBtn$)this.listBtn$.unsubscribe()
    if(this.interval)this.interval.unsubscribe()
    if(this.currentTimeInterval)this.currentTimeInterval.unsubscribe()
  }

  ngOnInit(): void {

    this.currentTimeInterval = interval(1000).pipe().subscribe(x => this.currentTime = new Date());

    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3,
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
      this.map.addSource('ve', {
        type: 'geojson',
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
        id: 'route',
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
        id: 'point',
        type: 'circle',
        source: 'vehiclePathsLast',
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff'
        }
      });

      this.map.on('click', 'point', (e : any) => {
        const dialogRef = this.dialog.open( MapMarkerDetailComponent, {
          data:{},
          panelClass : 'bakcgroundColorGray'
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){

          }
        });
      });

      if(this.activatedRoute.snapshot.paramMap.get('vin') != null){
        for(let i = 0; i < this.vehicleInfo.length; i++){
          if(this.vehicleInfo[i].vin == this.activatedRoute.snapshot.paramMap.get('vin')){
            this.clickVin(this.vehicleInfo[i])
            break;
          }
        }
      }


    });
    },1)

    this.listBtn$ = this.uiService.listBtn$.subscribe(result=>{
      console.log(result)
    })
    this.setSpeedChart()
    this.setBatteryChart()
    this.getRealtimedataVehiclelist()
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
    this.realTimeOnOff = false
    this.selectVehicle = vehicle
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

      (this.map.getSource("vehiclePaths") as GeoJSONSource).setData({
        "type": "Feature",
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      });
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

  batteryPanelOnOff(){
    this.isBatteryPanelOnOff = !this.isBatteryPanelOnOff
  }

  setSpeedPanelOnOff(){
    this.isSpeedPanelOnOff = !this.isSpeedPanelOnOff
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
            width: 5,
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
              width: 5,
              color: [[1, '#100c2a']]
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

}
