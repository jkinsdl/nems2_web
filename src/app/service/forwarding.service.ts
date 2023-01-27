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

  private Url = environment.httpText + environment.apiServer + "/forwarding" ;


  getForwarding(filter : SearchFilter){
    var url = `${this.Url}`;

    let httpParams = new HttpParams()
    if(filter.displayName != undefined){
      httpParams = httpParams.set("displayName", filter.displayName)
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
