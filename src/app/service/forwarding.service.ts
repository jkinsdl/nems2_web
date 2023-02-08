import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class ForwardingService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/forwarding" ;


  getForwarding(filter : SearchFilter){
    var url = `${this.Url}`;

    let httpParams = new HttpParams()

    if(filter.asc != undefined){
      for(let i = 0; i <filter.asc.length; i++){
        httpParams = httpParams.append("asc", filter.asc[i])
      }
    }

    if(filter.desc != undefined){
      for(let i = 0; i < filter.desc.length; i++){
        httpParams = httpParams.set("desc", filter.desc[i])
      }
    }


    if(filter.offset != undefined){
      httpParams = httpParams.set("offset", filter.offset)
    }

    if(filter.limit != undefined){
      httpParams = httpParams.set("limit", filter.limit)
    }

    if(filter.serverName != undefined){
      httpParams = httpParams.set("serverName", filter.serverName)
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  postForwarding(parameter : any){
    var url = `${this.Url}`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  getForwardingId(id : string){
    var url = `${this.Url}/${id}`;

    return this.http.get<any>(url, { observe: "response" })
  }

  deleteForwardingId(id : string){
    var url = `${this.Url}/${id}`;

    return this.http.delete<any>(url, { observe: "response" })
  }

  putForwardingId(id : string, parameter : any){
    var url = `${this.Url}/${id}`;

    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }
}
