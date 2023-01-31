import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

    //API 가 2개 ?

  private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort  +"/api/users" ;

  getUsers(filter : SearchFilter){
    var url = `${this.Url}`;
    let httpParams = new HttpParams()
    if(filter.asc != undefined){
      httpParams = httpParams.set("asc",filter.asc.join(", "))
    }

    if(filter.desc != undefined){
      httpParams = httpParams.set("desc",filter.desc.join(", "))
    }

    if(filter.desc != undefined){
      httpParams = httpParams.set("desc",filter.desc.join(", "))
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })

  }

}
