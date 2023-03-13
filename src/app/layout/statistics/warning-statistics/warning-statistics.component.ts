import { Component, OnInit } from '@angular/core';
import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { SearchFilter } from 'src/app/object/searchFilter';
import { StatisticsService } from 'src/app/service/statistics.service';
import { UtilService } from 'src/app/service/util.service';


@Component({
  selector: 'app-warning-statistics',
  templateUrl: './warning-statistics.component.html',
  styleUrls: ['./warning-statistics.component.css']
})
export class WarningStatisticsComponent implements OnInit {

  constructor(
    private statisticsServce : StatisticsService,
    private utilService : UtilService
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

  warningsSummary : any = {
    warningByModel : [],
    warningByRegion : [],
    warningVehicles : 0,
    warnings : 0
  }

  statisticsDate$ : Subscription

  date : any

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.statisticsDate$)this.statisticsDate$.unsubscribe()
  }

  ngOnInit(): void {
    this.date = this.statisticsServce.statisticsDate
    this.setMap()

    this.statisticsDate$ = this.statisticsServce.statisticsDate$.subscribe(date=>{
      console.log(date)
      this.date = date
      this.getStatisticsWarningsSummary()
    })
  }

  getStatisticsWarningsSummary(){
    let f = new SearchFilter()
    if(this.date){
      let selectDate = new Date(this.date._i.year+'')
      selectDate.setMonth(this.date._i.month)
      selectDate.setDate(this.date._i.date)
      f.begin = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
      selectDate.setMonth(selectDate.getMonth()+1)
      f.end = new Date(selectDate.getTime()-selectDate.getTimezoneOffset()).toISOString()
    }
    this.statisticsServce.getStatisticsWarningsSummary(f).subscribe(res=>{
      console.log(res)
      this.warningsSummary = res.body
      console.log(this.warningsSummary)
      this.utilService.getSubPrefectureeData().subscribe((subPrefecture:any)=>{

        console.log(subPrefecture)
        let featuresList : any[] = []

        for(let i = 0 ; i < res.body.warningByRegion.length; i++){

          for(let j = 0; j < subPrefecture.features.length; j++){
            if(res.body.warningByRegion[i].key == subPrefecture.features[j].properties.ADM2_ZH){
              let lnglat = subPrefecture.features[j].geometry.center
              featuresList.push({
                "type": "Feature",
                      "properties": {
                      "key" : res.body.warningByRegion[i].key,
                      "count" : res.body.warningByRegion[i].value,
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

        (this.map.getSource("warningByRegion") as GeoJSONSource).setData({
          "type": "FeatureCollection",
          "features": featuresList
        });

      })


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
      this.map.addSource('warningByRegion', {
        type: 'geojson',
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'warningByRegion',
        paint: {
          "circle-radius": 18,
          "circle-color": "#3887be"
        }
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'warningByRegion',
        layout: {
          'text-field': '{count}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        }
      })

      this.getStatisticsWarningsSummary()

    });
    },1)
  }
}
