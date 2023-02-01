import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import mapboxgl from 'mapbox-gl';
import { MapMarkerDetailComponent } from './map-marker-detail/map-marker-detail.component';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { StatisticsService } from 'src/app/service/statistics.service';
import { SearchFilter } from 'src/app/object/searchFilter';


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
    private statisticsService : StatisticsService
  ) { }


  menuMode$ : Subscription


  map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 35.8617;
  lng = 104.1954;

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
        zoom: 4,
        center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.map.addSource('test', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson', // 데이터
        cluster: true,
        clusterMaxZoom: 14, // 클러스터링이 나타날 최대 줌
        clusterRadius: 50 // 클러스터링 할 범위를 의미
      });

      this.map.addSource('country_territory', {
        type: 'geojson',
        data: 'assets/data/chn_country_territory.json'
        //data: 'assets/data/CHN_adm3_1.json'
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });

      this.map.addSource('province', {
        type: 'geojson',
        data: 'assets/data/chn_province.json'
        //data: 'assets/data/CHN_adm3_1.json'
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });

      this.map.addSource('sub_prefecture', {
        type: 'geojson',
        data: 'assets/data/chn_sub_prefecture.json'
        //data: 'assets/data/CHN_adm3_1.json'
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });

      this.map.addSource('county', {
        type: 'geojson',
        data: 'assets/data/chn_county.json'
        //data: 'assets/data/CHN_adm3_1.json'
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        /*const dialogRef = this.dialog.open( MapMarkerDetailComponent, {
          data:{},
          panelClass : 'bakcgroundColorGray'
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){

          }
        });*/
      });

      this.map.on('mouseenter', 'clusters', (e : any) => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', 'unclustered-point', (e : any) => {
        /*
        this.map.getCanvas().style.cursor = 'pointer';
        console.log(e)
        const coordinates = e.features[0].geometry.coordinates.slice();
        const mag = e.features[0].properties.mag;
        const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
        const lng = e.lngLat.lng
        const lagt = e.lngLat.lat


        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        this.mapPopup = new mapboxgl.Popup({closeButton: false})
        .setLngLat(coordinates)
        .setHTML(
        `lng : ${lng}<br>
         lat : ${lagt}`
        )
        .addTo(this.map);*/
      });

      this.map.on('mouseleave', 'unclustered-point', () => {
        /*this.map.getCanvas().style.cursor = '';
        this.mapPopup.remove()*/
      });

      this.changeBoundaries('country_territory')

    });

    /*let popup = new mapboxgl.Popup()
    .setLngLat(feature.geometry.coordinates)
    .setHTML("test")
    .addTo(this.map);*/
    },1)

    this.setPieChart()
    this.getStatisticsCurrent()
    //this.getStatisticsMileages()
    //this.getStatisticsRegistrationCount()
    //this.getStatisticsRegistrationSummary()
    this.getStatisticsVehiclesSummary()
    //this.getStatisticsWarningsSummary()
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



  pageMoveAlarm(){
    this.router.navigateByUrl(`/main/alarm)`);
  }

  setPieChart(){
    var chartDom = document.getElementById('pieChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
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
          data: [
            { value: 1048, name: 'Level 3' },
            { value: 735, name: 'Level 2' },
            { value: 580, name: 'Level 1' },
          ]
        }
      ]
    };
    option && myChart.setOption(option);
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

}
