import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as echarts from 'echarts';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-marker-detail',
  templateUrl: './map-marker-detail.component.html',
  styleUrls: ['./map-marker-detail.component.css']
})
export class MapMarkerDetailComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private dialogRef: MatDialogRef<MapMarkerDetailComponent>,) { }

  menu : string = "menu1"
  informationMenu : string = "menu1"

  months : number[] = [1,2,3,4,5,6,7,8,9,10,11,12]
  days : number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
  map: mapboxgl.Map;
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //this.setSpeedChart()
    //this.setBatteryChart()

    setTimeout(()=>{
      this.setMap()
    },10)

  }



  setSpeedChart(){
    var dom = document.getElementById('speedChart');
    var myChart = echarts.init(dom);
    var option: echarts.EChartsOption;
    option = {
      series: [
        {
          type: 'gauge',
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [0.2, '#ffd400'],
                [0.4, '#e5d34d'],
                [0.6, '#ff8000'],
                [0.8, '#f05650'],
                [1, '#ff0000']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 40,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} km/h',
            color: 'auto',
            fontSize: 12
          },
          data: [
            {
              value: 70
            }
          ]
        }
      ]
    };
    /*setInterval(function () {
      myChart.setOption<echarts.EChartsOption>({
        series: [
          {
            data: [
              {
                value: +(Math.random() * 100).toFixed(1)
              }
            ]
          }
        ]
      });
    }, 2000);*/
    option && myChart.setOption(option);
  }

  setBatteryChart(){
    var chartDom = document.getElementById('batteryChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    const gaugeData = [
      {
        value: 100,
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
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 0, 0)'
                },
                {
                  offset: 1,
                  color: 'rgb(0, 103, 163)'
                }])
            }
          },
          axisLine: {
            lineStyle: {
              width: 20
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
            height: 14,
            fontSize: 14,
            color: 'auto',
            borderColor: 'auto',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}%'
          }
        }
      ]
    };

    /*setInterval(function () {
      gaugeData[0].value = +(Math.random() * 100).toFixed(1);
      myChart.setOption<echarts.EChartsOption>({
        series: [
          {
            data: gaugeData,
            pointer: {
              show: false
            }
          }
        ]
      });
    }, 2000);*/

    option && myChart.setOption(option);
  }

  setBatteryInformationChart(){
    let maxData = 2000;

    var chartDom = document.getElementById('batteryInformationChart')!;
    var myChart = echarts.init(chartDom);

    let option = {
      tooltip: {},
      xAxis: {
        show : false,
        max: maxData,
        splitLine: { show: false },
        offset: 10,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          margin: 10
        }
      },
      yAxis: {
        data: ['Chart1', 'Chart2', 'Chart3', 'Chart4'],
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          margin: 10,
          color: '#999',
          fontSize: 16
        }
      },
      grid: {
        top: 'center',
        height: 400,
        left: 70,
        right: 100
      },
      series: [
        {
          // current data
          type: 'pictorialBar',
          symbol: 'assets/icon/battery_icon.png',
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: 30,
          symbolBoundingData: maxData,
          data: [891, 1220, 660, 1670],
          markLine: {
            symbol: 'none',
            label: {
              formatter: 'max: {c}',
              position: 'start'
            },
            lineStyle: {
              color: 'green',
              type: 'dotted',
              opacity: 0.2,
              width: 2
            },
            data: [
              {
                type: 'max'
              }
            ]
          },
          z: 10
        },
        {
          // full data
          type: 'pictorialBar',
          itemStyle: {
            opacity: 0.2
          },
          label: {
            show: true,
            position: 'right',
            offset: [10, 0],
            color: 'green',
            fontSize: 18
          },
          animationDuration: 0,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbol: 'assets/icon/battery_icon.png',
          symbolSize: 30,
          symbolBoundingData: maxData,
          data: [891, 1220, 660, 1670],
          z: 5
        }
      ]
    };

    option && myChart.setOption(option);
  }

  setMap(){
    mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
    this.map = new mapboxgl.Map({
      container: 'map1',
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 15,
      center: [ 105.011833, 32.399333]
  });


  this.map.addControl(new mapboxgl.NavigationControl(),'top-left');
  //this.map.addControl(new MapboxDirections({accessToken: mapboxgl.accessToken}), 'top-left');

  this.map.on('load', () => {
    this.map.addSource('test', {
      type: 'geojson',
      data : 'assets/data/test.json'
    });

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [105.011833, 32.399333],
            [105.011833, 32.400333],
            [105.013833, 32.401333],
            [105.012833, 32.402333],
            [105.012133, 32.401133],
            [105.012333, 32.404333],
            [105.012733, 32.403433],
            [105.012333, 32.407633],
            [105.012563, 32.403833],
            [105.012233, 32.406733],
          ]
        }
      }
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
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
    });
  }

  changeMenu(menu : string){
    this.menu = menu
    if(this.menu == 'menu1'){
      setTimeout(()=>{
        this.setSpeedChart()
        this.setBatteryChart()
      },10)
    }else if(this.menu == 'menu2'){
      setTimeout(()=>{
        this.setBatteryInformationChart()
      },10)
    }else if(this.menu == 'menu3'){

    }else if(this.menu == 'menu4'){

    }
  }

  changeInformationMenu(menu : string){
    this.informationMenu = menu
  }

  closePopup(){
    this.dialogRef.close()
  }
}
