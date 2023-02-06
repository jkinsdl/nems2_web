import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class VehiclewarningService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort +"/api";

  putVehicleWarningVin(vin : string, parameter : any){
    var url = `${this.Url}/vehicle_warning/${vin}`;

    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclewarning(filter : SearchFilter){
    var url = `${this.Url}/vehiclewarning`;
    let httpParams = new HttpParams()
    if(filter.asc != undefined){
      for(let i = 0; i < filter.asc.length; i++){
        httpParams = httpParams.append('asc', filter.asc[i]);
      }
    }

    if(filter.desc != undefined){
      for(let i = 0; i < filter.desc.length; i++){
        httpParams = httpParams.append('desc', filter.desc[i]);
      }
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit ",filter.limit )
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset ",filter.offset )
    }
    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

}
