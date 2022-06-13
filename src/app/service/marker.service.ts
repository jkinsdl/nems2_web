import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsoleEventLogger } from '@generic-ui/hermes/core/infrastructure/logger/event/console.event.logger';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  capitals: string = '/assets/data/map-test-data.geojson';

  constructor(private http: HttpClient) { }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(map: L.Map): void {
    console.log("makeCapitalMarkers")
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      }
    });
  }

  makeCapitalCircleMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {

      const maxPop = Math.max(...res.features.map((x : any )=> x.properties.population), 0);

      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const circle = L.circleMarker([lat, lon], {
          radius: MarkerService.scaledRadius(c.properties.population, maxPop)
        });

        circle.addTo(map);
      }
    });
  }
}
