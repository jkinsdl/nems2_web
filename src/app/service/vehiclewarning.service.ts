import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class VehiclewarningService {

  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer + "/api/vehiclewarnings";
  //private Url2 = environment.httpText + environment.apiServer + "/api/vehiclewarning";


  getVehiclewarnings(filter : SearchFilter){
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
      httpParams = httpParams.set("limit",filter.limit )
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset )
    }

    if(filter.vin != undefined){
      httpParams = httpParams.set("vin",filter.vin)
    }

    if(filter.begin != undefined){
      httpParams = httpParams.set("begin", filter.begin)
    }

    if(filter.end != undefined){
      httpParams = httpParams.set("end", filter.end)
    }

    if(filter.warningType != undefined){
      for(let i = 0; i < filter.warningType.length; i++){
        httpParams = httpParams.append('warningType', filter.warningType[i]);
      }
    }

    if(filter.warningLevel != undefined){
      for(let i = 0; i < filter.warningLevel.length; i++){
        httpParams = httpParams.append('warningLevel', filter.warningLevel[i]);
      }
    }

    if(filter.state != undefined){
      for(let i = 0; i < filter.state.length; i++){
        httpParams = httpParams.append('state', filter.state[i]);
      }
    }




    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }

  getVehiclewarningsIssueId(issueId : string){
    var url = `${this.Url}/${issueId}`;

    return this.http.get<any>(url, { observe: "response" })
  }

  putVehiclewarningsIssueId(issueId : string, parameter : any){
    var url = `${this.Url}/${issueId}`;

    return this.http.put<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  deleteVehiclewarningsIssueId(issueId : string){
    var url = `${this.Url}/${issueId}`;
    return this.http.delete<any>(url, { observe: "response" })
  }

  postVehiclewarningsIssueIdComment(issueId : string, parameter : any){
    var url = `${this.Url}/${issueId}/comment`;
    return this.http.post<any>(url, JSON.stringify(parameter), { observe: "response" })
  }

  deleteVehiclewarningsIssueIdCommentMessageId(issueId : string, messageId : string){
    var url = `${this.Url}/${issueId}/comment/${messageId}`;
    return this.http.delete<any>(url, { observe: "response" })
  }

}
