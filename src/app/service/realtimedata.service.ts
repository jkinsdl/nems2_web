import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class RealtimedataService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort +"/api/realtimedata" ;


  getRealtimedata(filter : SearchFilter){
    var url = `${this.Url}`;
    let httpParams = new HttpParams()

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin",filter.vin)
    }

    if(filter.packetTime != undefined){
      httpParams = httpParams.set("packetTime",filter.packetTime)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getRealtimedataVehiclelist(filter : SearchFilter){
    var url = `${this.Url}/vehiclelist`;
    let httpParams = new HttpParams()

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin",filter.vin)
    }

    if(filter.iccid != undefined){
      httpParams = httpParams.set("iccid",filter.iccid)
    }

    if(filter.nemsSn != undefined){
      httpParams = httpParams.set("nemsSn",filter.nemsSn)
    }

    if(filter.registrationPlate != undefined){
      httpParams = httpParams.set("registrationPlate",filter.registrationPlate)
    }

    if(filter.region != undefined){
      httpParams = httpParams.set("region",filter.region)
    }

    if(filter.pcode != undefined){
      httpParams = httpParams.set("pcode",filter.pcode)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit",filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset)
    }

    if(filter.isLogin != undefined){
      httpParams = httpParams.set("isLogin",filter.isLogin)
    }

    if(filter.purpose != undefined){
      httpParams = httpParams.set("purpose",filter.purpose)
    }

    if(filter.model != undefined){
      httpParams = httpParams.set("model",filter.model)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }


  getRealtimedataVehiclesessionVin(vin : string){
    var url = `${this.Url}/vehiclesession/${vin}`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getRealtimedataVehiclesessionlist(){
    var url = `${this.Url}/vehiclesessionlist`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getRealtimedataWarningissueVin(vin : string){
    var url = `${this.Url}/warningissue/${vin}`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getRealtimedataWarningissuelist(){
    var url = `${this.Url}/warningissuelist`;

    return this.http.get<any>(url, { observe: "response" })
  }

  getRealtimedataWarningcount(){
    var url = `${this.Url}/warningcount`;

    return this.http.get<any>(url, { observe: "response" })
  }


}
