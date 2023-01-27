import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class GbpacketService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + "/gbpacket" ;

  getGbpacketInvalidpacket(filter : SearchFilter){ // description
    var url = `${this.Url}/invalidpacket`;
    let httpParams = new HttpParams()
    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.errorState != undefined){
      httpParams = httpParams.set("errorState", filter.errorState)
    }

    if(filter.startDate != undefined){
      httpParams = httpParams.set("startDate", filter.startDate)
    }

    if(filter.endDate != undefined){
      httpParams = httpParams.set("endDate", filter.endDate)
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

  getGbpacketPacket(filter : SearchFilter){ // Packet List 반환
    var url = `${this.Url}/packet`;
    let httpParams = new HttpParams()
    if(filter.offset != undefined){
      httpParams = httpParams.set("offset", filter.offset)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit", filter.limit)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.beginTime != undefined){
      httpParams = httpParams.set("beginTime", filter.beginTime)
    }

    if(filter.endTime != undefined){
      httpParams = httpParams.set("endTime", filter.endTime)
    }


    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

  getForwardingId(filter : SearchFilter){ // 지정된 Packet 조회
    var url = `${this.Url}/packet/${filter.vin}`;
    let httpParams = new HttpParams()
    if(filter.serverTime != undefined){
      httpParams = httpParams.set("serverTime", filter.serverTime)
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

}
