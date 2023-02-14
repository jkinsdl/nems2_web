import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtaService {

  constructor(
    private http: HttpClient,
  ) { }


  private Url = environment.httpText + environment.apiServer + "/api/ota" ;
  //private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/ota" ;


  postOta(){
    var url = `${this.Url}`;
    return this.http.post<any>(url, {observe: "response" })
  }

  getOtaFirmware(){
    var url = `${this.Url}/firmware`;
    return this.http.get<any>(url, {observe: "response" })
  }

  getOtaFirmwareFirmwareNo(firmwareNo : string){
    var url = `${this.Url}/firmware/${firmwareNo}`;
    return this.http.get<any>(url, {observe: "response" })
  }

  postOtaFirmwareFirmwareNo(firmwareNo : string){
    var url = `${this.Url}/firmware/${firmwareNo}`;
    return this.http.post<any>(url, {observe: "response" })
  }

  getOtaFirmwareFirmwareNoVin(firmwareNo : string, vin : string){
    var url = `${this.Url}/firmware/${firmwareNo}/${vin}`;
    return this.http.get<any>(url, {observe: "response" })
  }

  deleteOtaFirmwareFirmwareNoVin(firmwareNo : string, vin : string){
    var url = `${this.Url}/firmware/${firmwareNo}/${vin}`;
    return this.http.delete<any>(url, {observe: "response" })
  }

  deleteOtaFirmwareFirmwareNo(firmwareNo : string){
    var url = `${this.Url}/firmware/${firmwareNo}`;
    return this.http.delete<any>(url, {observe: "response" })
  }
}
