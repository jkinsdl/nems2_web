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
import { UiService } from 'src/app/service/ui.service';

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
    private uiService : UiService
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

  selectFirmware : any = null;

  inputVinText : string = ""

  ngOnInit(): void {
    //this.getOtaFirmware()
    this.getDevicemanagersFirmware()
    //this.getDevicemanagersVehicles()

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
        let body : any[] =[]
        body=[
          {
              meta: result.meta
          },
          {
              contents: result.contents
          }
        ]
        this.devicemanageService.postDevicemanagersFirmware(body).subscribe(res=>{
          console.log(res)
          this.getDevicemanagersFirmware()
        },error=>{
          console.log(error)
        })

      }
    });
  }

  leftListRemove(){
    if(this.selectFirmware.firmwareName == undefined){
      return
    }

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
        this.deleteDevicemanagersFirmwareFirmwareName()
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
    this.getDevicemanagersFirmwareFirmwareNameVehicles()
  }

  getDevicemanagersFirmwareFirmwareNameVehicles(){
    this.devicemanageService.getDevicemanagersFirmwareFirmwareNameVehicles(this.selectFirmware.firmwareName).subscribe(res=>{
      console.log(res)
      this.firmwareVehiclesList = res.body
    },error=>{
      console.log(error)
      this.firmwareVehiclesList = []
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

      this.uiService.setAlertMessage("does not exist : " + this.inputVinText)

    })
  }

  deleteDevicemanagersFirmwareFirmwareName(){
    this.devicemanageService.deleteDevicemanagersFirmwareFirmwareName(this.selectFirmware.firmwareName).subscribe(res=>{
      console.log(res)
      this.getDevicemanagersFirmware()
      this.selectFirmware = {}
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
            if(i == checkRowList.length-1){
              this.getDevicemanagersFirmwareFirmwareNameVehicles()
            }
          },error=>{
            console.log(error)
          })
        }
      }
    });
  }
}
