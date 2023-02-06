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

    if(filter.limit != undefined){
      httpParams = httpParams.set('limit', filter.limit);
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set('offset', filter.offset);
    }

    if(filter.search != undefined){
      httpParams = httpParams.set('search', filter.search);
    }

    if(filter.email != undefined){
      httpParams = httpParams.set('email', filter.email);
    }

    if(filter.name != undefined){
      httpParams = httpParams.set('name', filter.name);
    }

    if(filter.authority != undefined){
      httpParams = httpParams.set('authority', filter.authority);
    }

    if(filter.attributeName != undefined){
      httpParams = httpParams.set('attributeName', filter.attributeName);
    }

    if(filter.attributeValue != undefined){
      httpParams = httpParams.set('attributeValue', filter.attributeValue);
    }

    if(filter.status != undefined){
      for(let i = 0; i < filter.status.length; i++){
        httpParams = httpParams.append('status', filter.status[i]);
      }
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })

  }

  postUsers(parameter : any){
    var url = `${this.Url}`;
    return this.http.post<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getUsersAuthorities(filter : SearchFilter){
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
      httpParams = httpParams.set('limit', filter.limit);
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set('offset', filter.offset);
    }

    if(filter.status != undefined){
      for(let i = 0; i < filter.status.length; i++){
        httpParams = httpParams.append('status', filter.status[i]);
      }
    }

    return this.http.get<any>(url, {params : httpParams, observe: "response" })
  }


  getUsersUserId(userId : string){
    var url = `${this.Url}/${userId}`;

    return this.http.get<any>(url, {observe: "response" })
  }

  putUsersUserId(parameter : any){
    var url = `${this.Url}/${parameter.userId}`;

    return this.http.put<any>(url, JSON.stringify(parameter), {observe: "response" })
  }

  getUsersProfile(){
    var url = `${this.Url}/profile`;

    return this.http.get<any>(url, {observe: "response" })
  }

}
