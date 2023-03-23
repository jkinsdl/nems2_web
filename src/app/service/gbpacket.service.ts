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


  private Url = environment.httpText + environment.apiServer + "/api/gbpacket" ;
  //private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/gbpacket" ;

  getGbpacket(filter : SearchFilter){ // Packet 검색
    var url = `${this.Url}`;
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
      httpParams = httpParams.set("limit", filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset", filter.offset)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin", filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end", filter.end)
    }

    for(let i = 0; i < filter.request.length; i++){
      httpParams = httpParams.append('request', filter.request[i]);
    }


    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }


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

  getGbpacketInvalid(filter : SearchFilter){
    var url = `${this.Url}/invalid`;
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
      httpParams = httpParams.set("limit", filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset", filter.offset)
    }


    if(filter.begin != undefined){
      httpParams = httpParams.set("begin", filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end", filter.end)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    if(filter.state != undefined){
      for(let i = 0; i < filter.state.length; i++){
        httpParams = httpParams.append('state', filter.state[i]);
      }
    }

    if(filter.excludeState != undefined){
      for(let i = 0; i < filter.excludeState.length; i++){
        httpParams = httpParams.append('excludeState', filter.excludeState[i]);
      }
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

  getGbpacketExport(filter : SearchFilter){
    var url = `${this.Url}/export`;
    let httpParams = new HttpParams()


    if(filter.begin != undefined){
      httpParams = httpParams.set("begin", filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end", filter.end)
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin", filter.vin)
    }

    for(let i = 0; i < filter.request.length; i++){
      httpParams = httpParams.append('request', filter.request[i]);
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

}
