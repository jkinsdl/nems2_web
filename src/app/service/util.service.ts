import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  setDateFormat(date : Date) : string{
    let result : string = "";

    result = date.getFullYear() + "-"
    if(date.getMonth() + 1 > 9){
      result += (date.getMonth() + 1) + "-"
    }else{
      result += "0" + (date.getMonth() + 1) + "-"
    }
    if(date.getDate() > 9){
      result += date.getDate() + " "
    }else {
      result += "0" + date.getDate() + " "
    }

    if(date.getHours() > 9){
      result += date.getHours() + ":"
    }else {
      result += "0" + date.getHours() + ":"
    }

    if(date.getMinutes() > 9){
      result += date.getMinutes() + ":"
    }else {
      result += "0" + date.getMinutes() + ":"
    }

    if(date.getSeconds() > 9){
      result += date.getSeconds()
    }else {
      result += "0" + date.getSeconds()
    }

    return result;
  }
}
