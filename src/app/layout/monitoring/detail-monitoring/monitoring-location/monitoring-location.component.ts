import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from 'src/app/service/marker.service'

@Component({
  selector: 'app-monitoring-location',
  templateUrl: './monitoring-location.component.html',
  styleUrls: ['./monitoring-location.component.css']
})
export class MonitoringLocationComponent implements OnInit {

  constructor(private markerService : MarkerService,
    private http: HttpClient) { }

  map : any;

  coord : any=[];
  options : any
  layersControl : any
  layers : any
  markerClusterGroup : L.MarkerClusterGroup;
  markerClusterData : L.Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  ngOnInit(): void {
    this.get_all_latlog()
  }

  ngAfterViewInit(): void {

  }

  onMapReady(map : any) {
    console.log(this.map)
    this.map = map;
  }

  markerClusterReady(group: L.MarkerClusterGroup){
    this.markerClusterGroup = group;
  }

  get_all_latlog(){
    this.muestra_mapa();
    this.http.get('/assets/data/map-test-data.geojson').subscribe((res: any) => {
      this.coord = res;
      console.log(this.coord)
      this.refreshData();
    });
  }

  muestra_mapa(){
    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 5,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      ],
      center: [ 39.172424, -94.191083 ],
      zoom: 5
    };

    this.map=this.options;
}

  get_coord(map: any){
    let latlog=map.latlng.toString().split(", ");
    let latitud=latlog[0].substring(latlog[0].indexOf("(")+1,latlog[0].length);
    let longitud=latlog[1].substring(0,latlog[1].length-1);
    let popup = L.popup();
    this.layers = [
      popup.setLatLng(map.latlng).setContent('latitud: '+latitud+'<br>Longitud: '+longitud, )
    ];
  }

  refreshData(): void {
    this.markerClusterData = this.generateData(this.coord);
  }

  generateData(coord:any): L.Marker[] {
    console.log("generateData")
    const data: L.Marker[] = [];
    let greenicon = L.icon({
      iconUrl: 'assets/icon/marker_icon.png',
      iconSize:     [25, 25],
      iconAnchor:   [25, 25],
      popupAnchor:  [-12, -20]
    });
    for (let i = 0; i < coord.features.length; i++) {

      const lon = this.coord.features[i].geometry.coordinates[0]
      const lat = this.coord.features[i].geometry.coordinates[1]
      const marker = L.marker([lat, lon],{icon: greenicon}).bindPopup('TestPopup', {
        closeButton: false
      });
      data.push(marker);
    }
    console.log(data)
    return data;
  }
}
