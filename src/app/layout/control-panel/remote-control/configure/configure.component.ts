import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AddRemoteParameterConfigurationInfoComponent } from 'src/app/component/add-remote-parameter-configuration-info/add-remote-parameter-configuration-info.component';
import { AddRegisterRemoteSettingComponent } from 'src/app/component/add-register-remote-setting/add-register-remote-setting.component';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private devicemanagerService : DevicemanagerService,
    private utilService : UtilService
  ) { }

  configurationColumnDefs: ColDef[] = [
    { field: 'configureName', headerName: 'configure name' },
    { field: 'carHeartBeatPeriod', headerName: 'car Heart Beat Period'},
    { field: 'carLocalSavePeriod', headerName : 'car Local Save Period'},
    { field: 'carResponseTimeout', headerName : 'car Response Timeout'},
    { field: 'fwVersion', headerName : 'fw Version'},
    { field: 'hwVersion', headerName : 'hw Version'},
    { field: 'managePlatformName', headerName : 'manage Platform Name'},
    { field: 'managePlatformPort', headerName : 'manage Platform Port'},
    { field: 'monitoring', headerName : 'monitoring'},
    { field: 'nextLoginInterval', headerName : 'next LoginInterval'},
    { field: 'normalSubmitPeriod', headerName : 'normal Submit Period'},
    { field: 'platformResponseTimeout', headerName : 'platform Response Timeout'},
    { field: 'publicPlatformName', headerName : 'public Platform Name'},
    { field: 'publicPlatformPort', headerName : 'public Platform Port'},
    { field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat},
    { field: 'updatedUserId', headerName : 'updated User Id'},
    { field: 'warningSubmitPeriod', headerName : 'warning Submit Period'},
  ];

  mappingColumnDefs: ColDef[] = [
    { field: 'configure_name', headerName: 'configure name' },
    { field: 'vin', headerName: 'VIN'},
    { field: 'matched', headerName : 'matched'},
    { field: 'matched_date', headerName : 'matched date', valueFormatter : this.utilService.gridDateFormat},
  ];

  public rowSelection = 'single';
  configureGridApi!: GridApi;
  mappingGridApi!: GridApi;

  devicemanagersParameter : any ={
    count : 0,
    entities : [],
    link : {}
  }

  selectConfigureRow : any = null

  devicemanagersParameterVehicle : any ={
    count : 0,
    entities : [],
    link : {}
  }

  ngOnInit(): void {
    this.getDevicemanagersParameter()
  }

  getDevicemanagersParameter(){
    this.devicemanagerService.getDevicemanagersParameter(new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.devicemanagersParameter = res.body
    },error=>{
      console.log(error)
    })
  }

  onServerGridReady(params: GridReadyEvent) {
    this.configureGridApi = params.api;
  }

  onMappingGridReady(params: GridReadyEvent) {
    this.mappingGridApi = params.api;
    this.mappingGridApi.sizeColumnsToFit()
  }

  addVehicle(){
    const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.putDevicemanagersParametersConfigureNameVehicles(result)
      }
    });
  }

  putDevicemanagersParametersConfigureNameVehicles(vin :string){
    let body = {
      vin : vin
    }
    this.devicemanagerService.putDevicemanagersParametersConfigureNameVehicles(this.selectConfigureRow.configureName,body).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  modifyMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){

        }
      });
    }
  }

  putDevicemanagersParameterVehicle(configureName : string, body : any){
    this.devicemanagerService.putDevicemanagersParameterVehicle(configureName,body).subscribe(res=>{
      console.log(res)
      this.utilService.alertPopup("Configure","configure has been added & modified.",this.constant.ADD_TYPE)
      this.getDevicemanagersParameter()
    },error=>{
      console.log(error)
    })
  }

  deleteMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the mapping ? (VIN : " + this.mappingGridApi.getSelectedRows()[0].vin+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.mappingGridApi.applyTransaction({ remove: this.mappingGridApi.getSelectedRows() })!;
        }
      });
    }
  }

  addConfigure(){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        let configureName = result.configureName
        let body = result.body
        this.putDevicemanagersParameterVehicle(configureName,body)
      }
    });
  }

  modifyConfigure(){
    if(this.configureGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
        data:{
          type:this.constant.MODIFY_TYPE,
          configure : this.configureGridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          let configureName = result.configureName
          let body = result.body
          body.updatedUserId = JSON.parse(localStorage.getItem('user')).userId
          this.putDevicemanagersParameterVehicle(configureName,body)
        }
      });
    }
  }

  deleteConfigure(){
    if(this.configureGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (name : " + this.configureGridApi.getSelectedRows()[0].configureName+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.deleteDevicemanagersParametersConfigureName(this.configureGridApi.getSelectedRows()[0].configureName)
        }
      });
    }
  }

  deleteDevicemanagersParametersConfigureName(configureName : string){
    this.devicemanagerService.deleteDevicemanagersParametersConfigureName(configureName).subscribe(res=>{
      console.log(res)
      this.utilService.alertPopup("Configure","configure has been removed.",this.constant.ADD_TYPE)
      this.selectConfigureRow = null
      this.getDevicemanagersParameter()
    },error=>{
      console.log(error)
    })
  }

  onConfigureRowClicked(event : any ){
    console.log(event.data)
    this.selectConfigureRow = event.data
    this.getDevicemanagersParametersConfigureNameVehicles()
  }

  getDevicemanagersParametersConfigureNameVehicles(){
    this.devicemanagerService.getDevicemanagersParametersConfigureNameVehicles(this.selectConfigureRow.configureName, new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }
}
