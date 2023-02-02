import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { OtaService } from 'src/app/service/ota.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOTAManagementComponent } from 'src/app/component/add-otamanagement/add-otamanagement.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { UploadOTAManagementComponent } from 'src/app/component/upload-otamanagement/upload-otamanagement.component';

@Component({
  selector: 'app-otamanagement',
  templateUrl: './otamanagement.component.html',
  styleUrls: ['./otamanagement.component.css']
})
export class OTAManagementComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private otaService : OtaService,
    private dialog: MatDialog,
  ) { }

  selectRow : boolean = false;

  gridApi!: GridApi;
  selectNodeID : string = null;
  rowSelection = 'multiple';

  startDate : any
  endDate :any


  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'need_ota', headerName: 'need OTA'},
    { field: 'state', headerName : 'State'},
    { field: 'last_ota_start_time', headerName : 'last OTA start time'},
    { field: 'last_response_time', headerName : 'last response time'},
    { field: 'firmware', headerName : 'firmware(MD5)'},
    { field: 'reserve_time', headerName : 'reserve time'},
    { field: 'firmware_name', headerName : 'Firmware Name'},
    { field: 'force_ota', headerName : 'Force Ota'},
  ];

  rowData : any[]= [];

  ngOnInit(): void {
    this.getOtaFirmware()
  }

  getOtaFirmware(){
    this.otaService.getOtaFirmware().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getOtaFirmwareFirmwareNo(firmwareNo : string){
    this.otaService.getOtaFirmwareFirmwareNo(firmwareNo).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  leftListAddModal(){
    const dialogRef = this.dialog.open( AddOTAManagementComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  leftListRemove(){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Firmware",
        alertContents :  "Are you sure to delete this Firmware?",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  leftListUpload(){
    const dialogRef = this.dialog.open( UploadOTAManagementComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  rowOpen(){
    this.selectRow = !this.selectRow
    if(this.selectRow){
      this.rowData =[
        {
          vin: 'vin',
          need_ota: 'need_ota',
          state: 'state',
          last_ota_start_time: 'last_ota_start_time',
          last_response_time: 'last_response_time',
          firmware: 'firmware',
          reserve_time : 'reserve_time',
          firmware_name : 'firmware_name',
          force_ota : 'force_ota'
        },
        {
          vin: 'vin',
          need_ota: 'need_ota',
          state: 'state',
          last_ota_start_time: 'last_ota_start_time',
          last_response_time: 'last_response_time',
          firmware: 'firmware',
          reserve_time : 'reserve_time',
          firmware_name : 'firmware_name',
          force_ota : 'force_ota'
        },
        {
          vin: 'vin',
          need_ota: 'need_ota',
          state: 'state',
          last_ota_start_time: 'last_ota_start_time',
          last_response_time: 'last_response_time',
          firmware: 'firmware',
          reserve_time : 'reserve_time',
          firmware_name : 'firmware_name',
          force_ota : 'force_ota'
        }]
    }else {
      this.rowData = []
    }
  }
}
