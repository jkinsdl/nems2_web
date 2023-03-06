import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, ITooltipParams } from 'ag-grid-community';
import { OtaService } from 'src/app/service/ota.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOTAManagementComponent } from 'src/app/component/add-otamanagement/add-otamanagement.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { UploadOTAManagementComponent } from 'src/app/component/upload-otamanagement/upload-otamanagement.component';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-otamanagement',
  templateUrl: './otamanagement.component.html',
  styleUrls: ['./otamanagement.component.css']
})
export class OTAManagementComponent implements OnInit {

  @ViewChild('otaManagementGrid', { read: ElementRef }) otaManagementGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private otaService : OtaService,
    private devicemanageService : DevicemanagerService,
    private dialog: MatDialog,
    private uiService : UiService,
    private utilService : UtilService
  ) { }

  gridApi!: GridApi;
  selectNodeID : string = null;

  startDate : any
  endDate :any

  firmwareVehiclesColumn: ColDef[] = [
    { field: 'vin', headerName: 'VIN',
    headerCheckboxSelection: true,
    checkboxSelection: true, tooltipField: 'vin', },
    { field: 'currentState', headerName: 'currentState', tooltipField: 'currentState'},
    { field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt' }}
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

  page$ : Subscription
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
  }

  ngOnInit(): void {
    //this.getOtaFirmware()
    this.getDevicemanagersFirmware()
    //this.getDevicemanagersVehicles()
  }

  getPageSize(){
    if(this.gridHeight != this.otaManagementGrid.nativeElement.offsetHeight){
      this.gridHeight = this.otaManagementGrid.nativeElement.offsetHeight;
      this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
      if(this.selectFirmware != null){
        this.getDevicemanagersFirmwareFirmwareNameVehicles()
      }
    }

  }

  onResize(event : any){
    this.getPageSize()
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

    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize

    this.devicemanageService.getDevicemanagersFirmwareFirmwareNameVehicles(this.selectFirmware.firmwareName,f).subscribe(res=>{
      console.log(res)
      this.firmwareVehiclesList = res.body

      let pagination = {
        count : this.firmwareVehiclesList.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

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
