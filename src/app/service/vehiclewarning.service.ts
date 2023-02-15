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

  private Url = environment.httpText + environment.apiServer + "/api/vehiclewarning";

  getVehiclewarning(filter : SearchFilter){
    var url = `${this.Url}`;
    let httpParams = new HttpParams()

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin",filter.vin)
    }

    if(filter.level != undefined){
      httpParams = httpParams.set("level",filter.level )
    }

    if(filter.state != undefined){
      httpParams = httpParams.set("state",filter.state )
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit",filter.limit )
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset )
    }
    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  putVehicleWarningVin(vin : string, parameter : any){
    var url = `${this.Url}/${vin}`;

    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  deleteVehiclewarningVin(vin : string){
    var url = `${this.Url}/${vin}`;
    return this.http.delete<any>(url, { observe: "response" })
  }

}
