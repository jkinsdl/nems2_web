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

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort +"/api" ;


  getRealtimedata(filter : SearchFilter){
    var url = `${this.Url}/realtimedata`;
    let httpParams = new HttpParams()

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin",filter.vin)
    }

    if(filter.packetTime != undefined){
      httpParams = httpParams.set("packetTime",filter.packetTime)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getVehicledataVehiclelist(filter : SearchFilter){
    var url = `${this.Url}/vehicledata/vehiclelist`;
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

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }


  getVehicledataVehiclesessionVin(vin : string){
    var url = `${this.Url}/vehicledata/vehiclesession/${vin}`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getVehicledataVehiclesessionlist(){
    var url = `${this.Url}/vehicledata/vehiclesessionlist`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getVehicledataWarningissueVin(vin : string){
    var url = `${this.Url}/vehicledata/warningissue/${vin}`;

    return this.http.get<any>(url, { observe: "response" })
  }



  getVehicledataWarningissuelist(){
    var url = `${this.Url}/vehicledata/warningissuelist`;

    return this.http.get<any>(url, { observe: "response" })
  }


}
