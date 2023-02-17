import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ValueFormatterParams } from 'ag-grid-community';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from '../util/common-constant';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

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

  gridDateFormat(params : any){
    let date = new Date(params.value)
    let result : string = "";

    if(params.value){
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
    }

    return result
  }

  alertPopup(title : string, contents : string, alertType : number ){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : title,
        alertContents : contents,
        alertType : alertType,
        popupType : this.constant.POPUP_CONFIRM,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }


  getBase64(file : any) {
    return new Promise<string | ArrayBuffer> ( (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let result = reader.result

        if(typeof result == "string"){
          result = result.substr((result.indexOf("base64,")+7))
        }
        resolve(result);
      }
      reader.onerror = error => reject(error);
    });
  }

  getProvinceData(){
    return this.http.get('assets/data/chn_province_final.json')
  }

  getSubPrefectureeData(){
    return this.http.get('assets/data/chn_sub_prefecture_v2.json')
  }

}
