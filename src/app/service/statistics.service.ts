import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + "/api/statistics" ;
 // private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/statistics" ;
  statisticsDate : any
  statisticsDateSubject = new Subject()
  statisticsDate$ = this.statisticsDateSubject.asObservable()

  setStatisticsDate(date : any){
    this.statisticsDate = date
    this.statisticsDateSubject.next(this.statisticsDate)
  }


  getStatisticsCurrent(){
    var url = `${this.Url}/current`;
    return this.http.get<any>(url, { observe: "response" })
  }

  getStatisticsMileages(filter : SearchFilter){
    var url = `${this.Url}/mileages`;
    let httpParams = new HttpParams()

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin",filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end",filter.end)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getStatisticsRegistrationCount(filter : SearchFilter){
    var url = `${this.Url}/registration/count`;
    let httpParams = new HttpParams()

    if(filter.province != undefined){
      httpParams = httpParams.set("province",filter.province)
    }

    if(filter.city != undefined){
      httpParams = httpParams.set("city",filter.city)
    }

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin",filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end",filter.end)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getStatisticsRegistrationSummary(filter : SearchFilter){
    var url = `${this.Url}/registration/summary`;
    let httpParams = new HttpParams()

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin",filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end",filter.end)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getStatisticsVehiclesSummary(){
    var url = `${this.Url}/vehicles/summary`;
    return this.http.get<any>(url, {observe: "response" })
  }

  getStatisticsWarnings(){
    var url = `${this.Url}/warnings`;

    return this.http.get<any>(url, { observe: "response" })
  }

  getStatisticsWarningsSummary(filter : SearchFilter){
    var url = `${this.Url}/warnings/summary`;
    let httpParams = new HttpParams()

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin",filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end",filter.end)
    }
    return this.http.get<any>(url, {params:httpParams, observe: "response" })
  }

}
