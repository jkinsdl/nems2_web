import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { MapMarkerDetailComponent } from '../../dashboard/map-marker-detail/map-marker-detail.component';
import * as echarts from 'echarts';
import { BatteryDetailComponent } from 'src/app/component/battery-detail/battery-detail.component';
@Component({
  selector: 'app-detail-monitoring',
  templateUrl: './detail-monitoring.component.html',
  styleUrls: ['./detail-monitoring.component.css']
})

export class DetailMonitoringComponent implements OnInit {

  constructor(private router: Router,
    private dialog: MatDialog,
    private uiService : UiService) { }

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 35.8617;
  lng = 104.1954;
  mapPopup : any

  listBtn$ : Subscription

  isBatteryPanelOnOff : boolean = false
  isSpeedPanelOnOff : boolean = false

  ngOnInit(): void {
    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 4,
        center: [this.lng, this.lat]
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
      this.map.addSource('test', {
        type: 'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson', // 데이터
        data : 'assets/data/test.json'
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'test',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [ 'step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1' ],
          'circle-radius': ['step',['get', 'point_count'], 20,100,30,750,40]
        }
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'test',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
      })

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'test',
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff'
        }
      });

      this.map.on('click', 'clusters', (e) => {
        const features : any = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        let source = this.map.getSource('test') as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom( clusterId, (err : any, zoom : any) => {
          if (err) {
            return;
          }
          this.map.easeTo({
            center: features[0].geometry.coordinates,
          zoom: zoom
          });
        });
      });

      this.map.on('click', 'unclustered-point', (e : any) => {
        const dialogRef = this.dialog.open( MapMarkerDetailComponent, {
          data:{},
          panelClass : 'bakcgroundColorGray'
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){

          }
        });
      });

      this.map.on('mouseenter', 'clusters', (e : any) => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', 'unclustered-point', (e : any) => {
        this.map.getCanvas().style.cursor = 'pointer';
        console.log(e)
        const coordinates = e.features[0].geometry.coordinates.slice();
        const lng = e.lngLat.lng
        const lagt = e.lngLat.lat

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        this.mapPopup = new mapboxgl.Popup({closeButton: false})
        .setLngLat(coordinates)
        .setHTML(
        /*lng : ${lng}<br>
         lat : ${lagt}<br>*/
         `<div class="informationContents">
            <div style="display:flex">
              <img src="assets/icon/car_icon.png" style="width: 25px; height: 25px; margin-right: 5px;">
              Vehicle Information
            </div>


            <div class="informationFild">
              <div class="informationLable">
                EV Ready
              </div>
              <div class="informationValue">
                Starting
              </div>
              <div class="informationLable">
                DC-DC Status
              </div>
              <div class="informationValue">
                Start
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                Chargy Status
              </div>
              <div class="informationValue">
                No Charge
              </div>
              <div class="informationLable">
                Accel
              </div>
              <div class="informationValue">
                On
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                Run Mode
              </div>
              <div class="informationValue">
                Electric
              </div>
              <div class="informationLable">
                Brake
              </div>
              <div class="informationValue">
                Off
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                Vehicle Speed(km/h)
              </div>
              <div class="informationValue">
                102.3
              </div>
              <div class="informationLable">
                Gear Steate
              </div>
              <div class="informationValue">
                D
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                Accumulated Mile(km)
              </div>
              <div class="informationValue">
                26,182.4
              </div>
              <div class="informationLable">
                Insulation Resistance(kΩ)
              </div>
              <div class="informationValue">
                5305
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                PTB Out Volt(V)
              </div>
              <div class="informationValue">
                326.7
              </div>
              <div class="informationLable">
                Accelerator Pedal Status
              </div>
              <div class="informationValue">
                11
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                PTB Out Arm(A)
              </div>
              <div class="informationValue">
                14.6
              </div>
              <div class="informationLable">
                Brake Pedal Status
              </div>
              <div class="informationValue">
                0
              </div>
            </div>

            <div class="informationFild">
              <div class="informationLable">
                SOC(%)
              </div>
              <div class="informationValue" style="width:75%">
                73
              </div>
            </div>
          </div>`
        ).setMaxWidth(null).addTo(this.map);
      });

      this.map.on('mouseleave', 'unclustered-point', () => {
        this.map.getCanvas().style.cursor = '';
        this.mapPopup.remove()
      });
    });

    /*let popup = new mapboxgl.Popup()
    .setLngLat(feature.geometry.coordinates)
    .setHTML("test")
    .addTo(this.map);*/
    },1)

    this.listBtn$ = this.uiService.listBtn$.subscribe(result=>{
      console.log(result)
      this.router.navigateByUrl('/main/monitoring').then(
        nav => {
          console.log(nav);
        },
        err => {
          console.log(err);
        });
    })

    this.setSpeedChart()
    this.setBatteryChart()
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

  batteryPanelOnOff(){
    this.isBatteryPanelOnOff = !this.isBatteryPanelOnOff
  }

  setSpeedPanelOnOff(){
    this.isSpeedPanelOnOff = !this.isSpeedPanelOnOff
  }

  setSpeedChart(){
    console.log("setSpeedChart")
    var dom = document.getElementById('speedChartContiner');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var option;

    option = {
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
              value: 100
            }
          ]
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

  }


  setBatteryChart(){
    var chartDom = document.getElementById('batteryChartContiner')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    const gaugeData = [
      {
        value: 30,
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
                color: '#ffffff',
              },
              unit: {
                fontSize: 15,
                color: '#ffffff',
                padding: [0, 0, 0, 5]
              }
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  openBattery(e : any){
    console.log('openBattery')
    e.stopPropagation()
    const dialogRef = this.dialog.open( BatteryDetailComponent, {
      data:{},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.listBtn$)this.listBtn$.unsubscribe()
  }
}
