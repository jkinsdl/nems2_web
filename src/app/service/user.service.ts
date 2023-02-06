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
      for(let i = 0; i < filter.asc.length; i++){
        httpParams = httpParams.append('asc', filter.asc[i]);
      }
    }

    if(filter.desc != undefined){
      for(let i = 0; i < filter.desc.length; i++){
        httpParams = httpParams.append('desc', filter.desc[i]);
      }
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })

  }

  getUsersProfile(){
    var url = `${this.Url}/profile`;

    return this.http.get<any>(url, {observe: "response" })
  }

}
