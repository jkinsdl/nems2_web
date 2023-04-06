import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ValueFormatterParams } from 'ag-grid-community';
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

  getProvinceCopyData(){
    return this.http.get('assets/data/chn_province_final_copy.json')
  }

  getProvinceData(){
    return this.http.get('assets/data/chn_province_final.json')
  }

  getSubPrefectureeCopyData(){
    return this.http.get('assets/data/chn_sub_prefecture_v2_copy.json')
  }

  getSubPrefectureeData(){
    return this.http.get('assets/data/chn_sub_prefecture_v2.json')
  }

  gridDataToExcelData(fileName : string, gridApi : GridApi, data : any[]){
    let titleLabel : string[] = []
    let titlaFiedId : string[] = []
    let dataList : string[][] = []
    console.log(gridApi.getColumnDefs())

    for(let i = 0; i < gridApi.getColumnDefs().length; i++){
      if(gridApi.getColumnDefs()[i].headerName != undefined){
        titleLabel.push(gridApi.getColumnDefs()[i].headerName)
        titlaFiedId.push((gridApi.getColumnDefs()[i] as any).field)
      }
    }

    for(let i = 0; i < data.length; i++){
      let rowData : string[] = []
      for(let j = 0; j < titlaFiedId.length; j++){
        if(data[i][titlaFiedId[j]] != undefined){
          rowData.push(data[i][titlaFiedId[j]])
        }else{
          rowData.push('')
        }
      }
      dataList.push(rowData)
    }
    console.log(dataList)
    this.dataFileExportCSV(fileName, titleLabel, dataList)
  }

  dataFileExportCSV( fileName : string, titleLabel : string[], data : string[][]){
    console.log(fileName);
    console.log(titleLabel);
    console.log(data);
    let csv : string = '';
    let raw : string = '';

    for( let i = 0; i < titleLabel.length; i++ ){
      raw += titleLabel[i] + ',';
    }

    raw = raw.slice(0, raw.length - 1);
    csv += raw + '\r\n';

    for ( let i = 0; i < data.length; i++) {
      raw = "";
      for( let j = 0; j < data[i].length; j++ ){
        raw += '"' + data[i][j] + '",';
      }
      raw = raw.slice(0, raw.length - 1);
      csv += raw + '\r\n';
    }

    let uri = 'data:text/csv;charset=UTF-8,\uFEFF' + encodeURI(csv);
    let link = document.createElement("a");
    link.href = uri;

    link.style.visibility = "hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  purposeValueToString(parameter : any){
    let result = ["PERSONAL", "PUBLIC", "COMMERCIAL", "Reserved"]
    return result[parameter.value]
  }

  exportDownload(filename : string, data : string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;base64,' + data);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  stringDecoding(params : any){
    return atob(params.value)
  }

  stringEncoding(params : any){
    return btoa(params.value)
  }

  decodingStringByteArray(str : string){
    const arr = str.split('\\');
    console.log(arr)
  }

  base64ToHex(params : any) {
    let raw = atob(params.value)
    let result = '';
    for(let i = 0; i<raw.length; i++){
      let hex = raw.charCodeAt(i).toString(16);
      result += (hex.length == 2 ? hex : '0'+hex) + ' ' ;
    }
    return result.toUpperCase();
  }
}
