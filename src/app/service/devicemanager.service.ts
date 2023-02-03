import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class DevicemanagerService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/devicemanagers" ;

  getDevicemanagersFirmware(filter : SearchFilter){ // 펌웨어 리스트 조회
    var url = `${this.Url}/firmware`;
    let httpParams = new HttpParams()
    if(filter.offset != undefined){
      httpParams = httpParams.set('offset', filter.offset)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set('limit', filter.limit)
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

  postDevicemanagersFirmware(parameter : any){ // 펌웨어 업로드
    var url = `${this.Url}/firmware`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getDevicemanagersFirmwareFirmwareNo(firmwareName : string){ // Firmware에 대한 상세 정보 조회
    var url = `${this.Url}/firmware/${firmwareName}`;

    return this.http.get<any>(url, {observe: "response" })
  }

  postDevicemanagersFirmwareFirmwareNo(firmwareName : number, body : any){ // 펌웨어를 적용받는 차량 추가
    var url = `${this.Url}/firmware/${firmwareName}/vehicles`;
    return this.http.post<any>(url, JSON.stringify(body), { observe: "response" })
  }

  getDevicemanagersFirmwareFirmwareNameVehicles(firmwareName : string){ // 해당 펌웨어를 적용받는 차량 리스트
    var url = `${this.Url}/firmware/${firmwareName}/vehicles`;

    return this.http.get<any>(url, { observe: "response" })
  }


  deleteDevicemanagersFirmwareFirmwareNameVehiclesVin(firmwareName : string, vin : string){ // 펌웨어를 적용받는 차량 제거
    var url = `${this.Url}/firmware/${firmwareName}/vehicles/${vin}`;

    return this.http.delete<any>(url, { observe: "response" })
  }

  getDevicemanagersParameter(filter : SearchFilter,){ // Parameter Configuration 목록 조회
    var url = `${this.Url}/parameter`;
    let httpParams = new HttpParams()
    if(filter.offset != undefined){
      httpParams = httpParams.set('offset', filter.offset)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set('limit', filter.limit)
    }

    return this.http.get<any>(url, {params : httpParams,  observe: "response" })
  }

  getDevicemanagersParameterVehicle(){ // TODO: 필요 여부 확인 후 삭제 차량 - 설정 관계 정보 조회
    var url = `${this.Url}/parameter/vehicle`;

    return this.http.get<any>(url, { observe: "response" })
  }

  putDevicemanagersParameterVehicle(parameter : any){ // 차량에 적용된 설정을 다른 설정으로 변경
    var url = `${this.Url}/parameter/vehicle`;
    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  deleteDevicemanagersParameterVehicleID(filter : SearchFilter){// 차량 - 설정 관계 삭제
    var url = `${this.Url}/parameter/vehicle/id`;

    let httpParams = new HttpParams()
    if(filter.vin != undefined){
      httpParams = httpParams.set('vin', filter.vin)
    }

    if(filter.configureName != undefined){
      httpParams = httpParams.set('configureName', filter.configureName)
    }

    return this.http.delete<any>(url, { params:httpParams, observe: "response" })
  }


  getDevicemanagersParameterConfigureName(configureName : string){ // Parameter Configuration 상세 정보 조회
    var url = `${this.Url}/parameter/${configureName}`;

    return this.http.get<any>(url, { observe: "response" })
  }

  deleteDevicemanagersParameterConfigureName(configureName : string){ // Parameter Configuration 삭제
    var url = `${this.Url}/parameter/${configureName}`;

    return this.http.delete<any>(url, { observe: "response" })
  }

  postDevicemanagersParameterConfigureName(parameter : any ,configureName : string){ // Parameter Configuration 수정
    var url = `${this.Url}/parameter/${configureName}`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  deleteDevicemanagersFirmwareNo(firmwareNo : number){ // 펌웨어 삭제 TODO: 삭제 시, 연관된 데이터 처리 방안 결정 필요
    var url = `${this.Url}/parameter/${firmwareNo}`;

    return this.http.delete<any>(url, { observe: "response" })
  }

  postTerminal(parameter : any){
    var url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/terminal";
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getDevicemanagersVehicles(filter : SearchFilter){
    var url = `${this.Url}/vehicles`;

    let httpParams = new HttpParams()
    if(filter.asc != undefined){
      httpParams = httpParams.set('asc', filter.asc.join(", "))
    }

    if(filter.desc != undefined){
      httpParams = httpParams.set('desc', filter.desc.join(", "))
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set('limit', filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set('offset', filter.offset)
    }

    if(filter.search != undefined){
      httpParams = httpParams.set('search', filter.search)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set('vin', filter.vin)
    }

    if(filter.firmware != undefined){
      httpParams = httpParams.set('firmware', filter.firmware)
    }

    if(filter.configure != undefined){
      httpParams = httpParams.set('configure', filter.configure)
    }

    return this.http.get<any>(url, { observe: "response" })
  }

}
