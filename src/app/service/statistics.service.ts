import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/statistics" ;

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

    if(filter.level != undefined){
      httpParams = httpParams.set("level",filter.level)
    }

    if(filter.zipCode != undefined){
      httpParams = httpParams.set("zipCode",filter.zipCode)
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
