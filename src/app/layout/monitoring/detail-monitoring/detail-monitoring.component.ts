import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { MapMarkerDetailComponent } from '../../dashboard/map-marker-detail/map-marker-detail.component';

@Component({
  selector: 'app-detail-monitoring',
  templateUrl: './detail-monitoring.component.html',
  styleUrls: ['./detail-monitoring.component.css']
})

export class DetailMonitoringComponent implements OnInit {

  constructor(private router: Router,
    private dialog: MatDialog,) { }

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10'
  lat = 35.8617;
  lng = 104.1954;
  mapPopup : any

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
        `lng : ${lng}<br>
         lat : ${lagt}`
        )
        .addTo(this.map);
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

}
