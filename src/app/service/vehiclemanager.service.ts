import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class VehiclemanagerService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/vehiclemanager";

  getVehiclemanagerModel(filter : SearchFilter){
    var url = `${this.Url}/model`;
    let httpParams = new HttpParams()

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit",filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  postVehiclemanagerModel(parameter : any){
    var url = `${this.Url}/model`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclemanagerModelModelName(modelName : string){
    var url = `${this.Url}/model/${modelName}`;
    return this.http.get<any>(url, { observe: "response" })
  }

  deleteVehiclemanagerModelModelName(modelName : string){
    var url = `${this.Url}/model/${modelName}`;
    return this.http.delete<any>(url, { observe: "response" })
  }

  putVehiclemanagerModelModelName(modelName : string, parameter : any){
    var url = `${this.Url}/model/${modelName}`;
    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclemanagerStaticinfo(filter : SearchFilter){
    var url = `${this.Url}/staticinfo`;
    let httpParams = new HttpParams()
    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.iccid != undefined){
      httpParams = httpParams.set("iccid", filter.iccid)
    }

    if(filter.nemsSn != undefined){
      httpParams = httpParams.set("nemsSn", filter.nemsSn)
    }

    if(filter.registrationPlate != undefined){
      httpParams = httpParams.set("registrationPlate", filter.registrationPlate)
    }

    if(filter.region != undefined){
      httpParams = httpParams.set("region", filter.region)
    }

    if(filter.zipCode != undefined){
      httpParams = httpParams.set("zipCode", filter.zipCode)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit", filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset", filter.offset)
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  postVehiclemanagerStaticinfo(parameter : any){
    var url = `${this.Url}/staticinfo`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclemanagerStaticinfoVin(vin : string){
    var url = `${this.Url}/staticinfo/${vin}`;
    return this.http.get<any>(url, { observe: "response" })
  }

  deleteVehiclemanagerStaticinfoVin(vin : string){
    var url = `${this.Url}/staticinfo/${vin}`;
    return this.http.delete<any>(url, { observe: "response" })
  }

  putVehiclemanagerStaticinfoVin(vin : string, parameter : any){
    var url = `${this.Url}/staticinfo/${vin}`;
    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getVehiclemanagerExport(filter : SearchFilter){
    var url = `${this.Url}/export`;
    let httpParams = new HttpParams()

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.iccid != undefined){
      httpParams = httpParams.set("iccid", filter.iccid)
    }

    if(filter.nemsSn != undefined){
      httpParams = httpParams.set("nemsSn", filter.nemsSn)
    }

    if(filter.registrationPlate != undefined){
      httpParams = httpParams.set("registrationPlate", filter.registrationPlate)
    }

    if(filter.region != undefined){
      httpParams = httpParams.set("region", filter.region)
    }

    if(filter.zipCode != undefined){
      httpParams = httpParams.set("zipCode", filter.zipCode)
    }
    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  postVehiclemanagerImport(parameter : any){
    var url = `${this.Url}/export`;

    return this.http.post<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

}
