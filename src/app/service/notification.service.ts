import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
  ) { }


  private Url = environment.httpText + environment.apiServer + "/api/notifications" ;
  //private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api/notifications" ;

  getNotifications(filter : SearchFilter){
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
      httpParams.set("limit", filter.limit)
    }

    if(filter.begin != undefined){
      httpParams.set("begin", filter.begin)
    }

    if(filter.end != undefined){
      httpParams.set("end", filter.end)
    }

    if(filter.templateId != undefined){
      httpParams.set("templateId", filter.templateId)
    }

    if(filter.status != undefined){
      httpParams.set("status", filter.status)
    }

    if(filter.event != undefined){
      httpParams.set("event", filter.event)
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  postNotifications(parameter : any){
    var url = `${this.Url}`;

    return this.http.post<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  putNotifications(parameter : any){
    var url = `${this.Url}`;

    return this.http.put<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getNotificationsRejections(){
    var url = `${this.Url}/rejections`;

    return this.http.get<any>(url, {observe: "response" })
  }

  getNotificationsTemplates(){
    var url = `${this.Url}/templates`;

    return this.http.get<any>(url, {observe: "response" })
  }

  postNotificationsTemplates(parameter : any){
    var url = `${this.Url}/templates`;

    return this.http.post<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getNotificationsTemplatesTemplateId(templateId : string){
    var url = `${this.Url}/templates/${templateId}`;

    return this.http.get<any>(url, {observe: "response" })
  }

  deleteNotificationsTemplatesTemplateId(templateId : string){
    var url = `${this.Url}/templates/${templateId}`;
    return this.http.delete<any>(url, {observe: "response" })
  }

  putNotificationsTemplatesTemplateId(templateId : string, parameter : any){
    var url = `${this.Url}/templates/${templateId}`;
    return this.http.put<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  patchNotificationsTemplatesTemplateId(templateId : string, parameter : any){
    var url = `${this.Url}/templates/${templateId}`;
    return this.http.patch<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getNotificationsMessageId(messageId : string){
    var url = `${this.Url}/${messageId}`;
    return this.http.get<any>(url, {observe: "response" })
  }

}
