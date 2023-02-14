import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';
import * as echarts from 'echarts';
import usa from '../../../../assets/data/examples.json';
import { StatisticsService } from 'src/app/service/statistics.service';
import { SearchFilter } from 'src/app/object/searchFilter';

@Component({
  selector: 'app-monthly-vehicle-statistics',
  templateUrl: './monthly-vehicle-statistics.component.html',
  styleUrls: ['./monthly-vehicle-statistics.component.css']
})
export class MonthlyVehicleStatisticsComponent implements OnInit {

  constructor(
    private statisticsServce : StatisticsService
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

  ngOnInit(): void {
    this.setMap()
    this.setChinaMapChart()
    this.getStatisticsRegistrationSummary()
    this.getStatisticsRegistrationCount()
  }

  getStatisticsRegistrationCount(){
    this.statisticsServce.getStatisticsRegistrationCount(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getStatisticsRegistrationSummary(){
    this.statisticsServce.getStatisticsRegistrationSummary(new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.registrationSummary = res.body
    },error=>{
      console.log(error)
    })
  }

  setMap(){
    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3,
        center: [this.lng, this.lat],
        maxBounds : this.bounds
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.map.addSource('test', {
        type: 'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson', // 데이터
        cluster: true,
        clusterMaxZoom: 14, // 클러스터링이 나타날 최대 줌
        clusterRadius: 50 // 클러스터링 할 범위를 의미
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

      });

      this.map.on('mouseenter', 'clusters', (e : any) => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', 'unclustered-point', (e : any) => {
      });

      this.map.on('mouseleave', 'unclustered-point', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
    },1)
  }

  setChinaMapChart(){
    var chartDom = document.getElementById('chinaMapChart')!;
    var myChart = echarts.init(chartDom, 'dark');
    var option: echarts.EChartsOption;

    myChart.showLoading();

      myChart.hideLoading();

      echarts.registerMap('USA', (usa as any), {
        Alaska: {
          left: -131,
          top: 25,
          width: 15
        },
        Hawaii: {
          left: -110,
          top: 28,
          width: 5
        },
        'Puerto Rico': {
          left: -76,
          top: 26,
          width: 2
        }
      });
      option = {
        title: {
          text: 'USA Population Estimates (2012)',
          subtext: 'Data from www.census.gov',
          sublink: 'http://www.census.gov/popest/data/datasets.html',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2
        },
        visualMap: {
          left: 'right',
          min: 500000,
          max: 38000000,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          },
          text: ['High', 'Low'],
          calculable: true
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: 'left',
          top: 'top',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: 'USA PopEstimates',
            type: 'map',
            roam: true,
            map: 'USA',
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { name: 'Alabama', value: 4822023 },
              { name: 'Alaska', value: 731449 },
              { name: 'Arizona', value: 6553255 },
              { name: 'Arkansas', value: 2949131 },
              { name: 'California', value: 38041430 },
              { name: 'Colorado', value: 5187582 },
              { name: 'Connecticut', value: 3590347 },
              { name: 'Delaware', value: 917092 },
              { name: 'District of Columbia', value: 632323 },
              { name: 'Florida', value: 19317568 },
              { name: 'Georgia', value: 9919945 },
              { name: 'Hawaii', value: 1392313 },
              { name: 'Idaho', value: 1595728 },
              { name: 'Illinois', value: 12875255 },
              { name: 'Indiana', value: 6537334 },
              { name: 'Iowa', value: 3074186 },
              { name: 'Kansas', value: 2885905 },
              { name: 'Kentucky', value: 4380415 },
              { name: 'Louisiana', value: 4601893 },
              { name: 'Maine', value: 1329192 },
              { name: 'Maryland', value: 5884563 },
              { name: 'Massachusetts', value: 6646144 },
              { name: 'Michigan', value: 9883360 },
              { name: 'Minnesota', value: 5379139 },
              { name: 'Mississippi', value: 2984926 },
              { name: 'Missouri', value: 6021988 },
              { name: 'Montana', value: 1005141 },
              { name: 'Nebraska', value: 1855525 },
              { name: 'Nevada', value: 2758931 },
              { name: 'New Hampshire', value: 1320718 },
              { name: 'New Jersey', value: 8864590 },
              { name: 'New Mexico', value: 2085538 },
              { name: 'New York', value: 19570261 },
              { name: 'North Carolina', value: 9752073 },
              { name: 'North Dakota', value: 699628 },
              { name: 'Ohio', value: 11544225 },
              { name: 'Oklahoma', value: 3814820 },
              { name: 'Oregon', value: 3899353 },
              { name: 'Pennsylvania', value: 12763536 },
              { name: 'Rhode Island', value: 1050292 },
              { name: 'South Carolina', value: 4723723 },
              { name: 'South Dakota', value: 833354 },
              { name: 'Tennessee', value: 6456243 },
              { name: 'Texas', value: 26059203 },
              { name: 'Utah', value: 2855287 },
              { name: 'Vermont', value: 626011 },
              { name: 'Virginia', value: 8185867 },
              { name: 'Washington', value: 6897012 },
              { name: 'West Virginia', value: 1855413 },
              { name: 'Wisconsin', value: 5726398 },
              { name: 'Wyoming', value: 576412 },
              { name: 'Puerto Rico', value: 3667084 }
            ]
          }
        ]
      };

      myChart.setOption(option);

    option && myChart.setOption(option);
  }

}
