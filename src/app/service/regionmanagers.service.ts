import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../object/searchFilter';

@Injectable({
  providedIn: 'root'
})
export class RegionmanagersService {
  constructor(
    private http: HttpClient,
  ) { }

  private Url = environment.httpText + environment.apiServer +"/api/regionmanagers" ;

  getRegionmanagers(filter : SearchFilter){
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
      httpParams = httpParams.set("limit",filter.limit)
    }

    if(filter.offset != undefined){
      httpParams = httpParams.set("offset",filter.offset)
    }

    if(filter.province != undefined){
      httpParams = httpParams.set("province",filter.province)
    }

    if(filter.city != undefined){
      httpParams = httpParams.set("city",filter.city)
    }

    if(filter.district != undefined){
      httpParams = httpParams.set("district",filter.district)
    }

    if(filter.keyword != undefined){
      httpParams = httpParams.set("keyword",filter.keyword)
    }

    return this.http.get<any>(url, { params:httpParams, observe: "response" })
  }

  getRegionmanagersPcode(pcode : string){
    var url = `${this.Url}/${pcode}`;

    return this.http.get<any>(url, {observe: "response" })
  }

}
