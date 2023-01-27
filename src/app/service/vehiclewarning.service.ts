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

  private Url = environment.httpText + environment.apiServer ;

  getVehicleWarning(filter : SearchFilter){
    var url = `${this.Url}/vehicle_warning`;
    let httpParams = new HttpParams()

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit",filter.limit)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin ",filter.vin )
    }

    if(filter.level != undefined){
      httpParams = httpParams.set("level ",filter.level )
    }

    if(filter.state  != undefined){
      httpParams = httpParams.set("state  ",filter.state )
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }


  putVehicleWarningVin(vin : string, parameter : any){
    var url = `${this.Url}/vehicle_warning/${vin}`;

    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclewarnging(filter : SearchFilter){
    var url = `${this.Url}/vehiclewarning`;
    let httpParams = new HttpParams()

    if(filter.asc != undefined){
      httpParams = httpParams.set("asc",filter.asc.join(", "))
    }

    if(filter.desc != undefined){
      httpParams = httpParams.set("desc",filter.desc.join(", "))
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
