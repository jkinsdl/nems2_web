import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class PushinfosService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + "/api/pushinfos" ;

  getPushinfos(filter : SearchFilter){
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

    if(filter.userName != undefined){
      httpParams = httpParams.set("userName", filter.userName)
    }

    if(filter.phoneNumber != undefined){
      httpParams = httpParams.set("phoneNumber", filter.phoneNumber)
    }

    if(filter.eMail != undefined){
      httpParams = httpParams.set("eMail", filter.eMail)
    }

    if(filter.aliTextureId != undefined){
      httpParams = httpParams.set("aliTextureId", filter.aliTextureId)
    }

    if(filter.aliVoiceId != undefined){
      httpParams = httpParams.set("aliVoiceId", filter.aliVoiceId)
    }

    return this.http.get<any>(url, { params : httpParams, observe: "response" })
  }

  postPushinfos(parameter : any){
    var url = `${this.Url}`;
    return this.http.post<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getPushinfosPushinfoId(pushinfoId : string){
    var url = `${this.Url}/${pushinfoId}`;
    return this.http.get<any>(url, {observe: "response" })
  }

  deletePushinfosPushinfoId(pushinfoId : string){
    var url = `${this.Url}/${pushinfoId}`;
    return this.http.delete<any>(url, {observe: "response" })
  }

  putPushinfosPushinfoId(pushinfoId : string, parameter : any){
    var url = `${this.Url}/${pushinfoId}`;
    return this.http.put<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

}
