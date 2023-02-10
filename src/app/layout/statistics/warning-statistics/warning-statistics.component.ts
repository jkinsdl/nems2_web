import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';


@Component({
  selector: 'app-warning-statistics',
  templateUrl: './warning-statistics.component.html',
  styleUrls: ['./warning-statistics.component.css']
})
export class WarningStatisticsComponent implements OnInit {

  constructor() { }

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v10'
  lat = 35.8617;
  lng = 104.1954;
  mapPopup : any

  bounds : LngLatBoundsLike = [
    [70, 15], // Southwest coordinates
    [135, 55] // Northeast coordinates
  ];

  ngOnInit(): void {
    this.setMap()
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
        data : 'assets/data/test.json',
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
}
