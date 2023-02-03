import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { OtaService } from 'src/app/service/ota.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOTAManagementComponent } from 'src/app/component/add-otamanagement/add-otamanagement.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { UploadOTAManagementComponent } from 'src/app/component/upload-otamanagement/upload-otamanagement.component';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';

@Component({
  selector: 'app-otamanagement',
  templateUrl: './otamanagement.component.html',
  styleUrls: ['./otamanagement.component.css']
})
export class OTAManagementComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private otaService : OtaService,
    private devicemanageService : DevicemanagerService,
    private dialog: MatDialog,
  ) { }

  gridApi!: GridApi;
  selectNodeID : string = null;
  rowSelection = 'multiple';

  startDate : any
  endDate :any

  firmwareVehiclesColumn: ColDef[] = [
    { field: 'vin', headerName: 'VIN',
    headerCheckboxSelection: true,
    checkboxSelection: true, },
    { field: 'currentState', headerName: 'currentState'},
    { field: 'updatedAt', headerName : 'updatedAt'}
  ];

  rowData : any[]= [];

  firmwareList : any = {
    count : 0,
    entities : [],
    link : {}
  }

  firmwareVehiclesList : any = {
    count : 0,
    entities : [],
    link : {}
  }

  selectFirmware : any = {};

  inputVinText : string = ""

  ngOnInit(): void {
    //this.getOtaFirmware()
    this.getDevicemanagersFirmware()
    this.getDevicemanagersVehicles()

  }

  getDevicemanagersVehicles() {
    this.devicemanageService.getDevicemanagersVehicles(new SearchFilter).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getDevicemanagersFirmware(){
    this.devicemanageService.getDevicemanagersFirmware(new SearchFilter).subscribe(res=>{
      console.log(res)
      this.firmwareList = res.body
    },error=>{
      console.log(error)
    })
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
        console.log(result)

        this.devicemanageService.postDevicemanagersFirmware(result).subscribe(res=>{
          console.log(res)
        },error=>{
          console.log(error)
        })

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

  rowOpen(item : any){
    this.selectFirmware = item
    this.devicemanageService.getDevicemanagersFirmwareFirmwareNameVehicles(item.firmwareName).subscribe(res=>{
      console.log(res)
      this.firmwareVehiclesList = res.body
    },error=>{
      console.log(error)
    })
  }

  inputVinTextClose(){
    this.inputVinText = ""
  }

  postDevicemanagersFirmwareFirmwareNo(){

    let parameter = {
      vin : this.inputVinText
    }
    this.devicemanageService.postDevicemanagersFirmwareFirmwareNo(this.selectFirmware.firmwareName,parameter).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  deleteDevicemanagersFirmwareFirmwareNameVehiclesVin(){
    console.log(this.gridApi.getSelectedRows())

    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete OTA info",
        alertContents : "Do you want to delete the data?  (Number of info : " + this.gridApi.getSelectedRows().length+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let checkRowList : any[] = this.gridApi.getSelectedRows()

        for(let i = 0; i < checkRowList.length; i++){
          let vin = checkRowList[i].vin
          this.devicemanageService.deleteDevicemanagersFirmwareFirmwareNameVehiclesVin(this.selectFirmware.firmwareName,vin).subscribe(res=>{
            console.log(res)
          },error=>{
            console.log(error)
          })
        }
      }
    });
  }
}
