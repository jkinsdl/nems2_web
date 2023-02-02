import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AddRemoteParameterConfigurationInfoComponent } from 'src/app/component/add-remote-parameter-configuration-info/add-remote-parameter-configuration-info.component';
import { AddRegisterRemoteSettingComponent } from 'src/app/component/add-register-remote-setting/add-register-remote-setting.component';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
  ) { }

  managementColumnDefs: ColDef[] = [
    { field: 'configure_name', headerName: 'configure name' },
    { field: 'car_local_save_cycle', headerName: 'car local save cycle (ms)'},
    { field: 'normal_transmission_cycle', headerName : 'normal transmission cycle (sec)'},
    { field: 'warning_transmission_cycle', headerName : 'warning transmission cycle (ms)'},
    { field: 'manage_platform_name', headerName : 'manage platform name'},
    { field: 'manage_platform_port', headerName : 'manage platform port'},
    { field: 'hardware_version', headerName : 'hardware Version (sw)'},
    { field: 'firmware_version', headerName : 'firmware Version'},
    { field: 'car_heartbeat_cycle', headerName : 'car heartBeat cycle (sec)'},
    { field: 'car_response_timeout', headerName : 'car response timeout (sec)'},
    { field: 'platform_response_timeout', headerName : 'platform_response_timeout (sec)'},
    { field: 'next_login_interval', headerName : 'next login interval (sec)'},
    { field: 'public_platform_name', headerName : 'public platform name'},
    { field: 'public_platform_port', headerName : 'public platform port'},
    { field: 'monitoring', headerName : 'monitoring'},
  ];

  managementRowData = [
    {
      configure_name: 'configure_name',
      car_local_save_cycle: 'car_local_save_cycle',
      normal_transmission_cycle: 'normal_transmission_cycle',
      warning_transmission_cycle : 'warning_transmission_cycle',
      manage_platform_name : 'manage_platform_name',
      manage_platform_port : 'manage_platform_port',
      hardware_version : 'hardware_version',
      firmware_version : 'firmware_version',
      car_heartbeat_cycle : 'car_heartbeat_cycle',
      car_response_timeout : 'car_response_timeout',
      platform_response_timeout : 'platform_response_timeout',
      next_login_interval : 'next_login_interval',
      public_platform_name : 'public_platform_name',
      public_platform_port : 'public_platform_port',
      monitoring : 'monitoring'
    }];



  mappingColumnDefs: ColDef[] = [
    { field: 'configure_name', headerName: 'configure name' },
    { field: 'vin', headerName: 'VIN'},
    { field: 'matched', headerName : 'matched'},
    { field: 'matched_date', headerName : 'matched date'},
  ];

  mappingRowData = [
    {
      configure_name: 'configure_name',
      vin: 'vin',
      matched: 'matched',
      matched_date: 'matched_date'
    }];

  public rowSelection = 'multiple';
  managementGridApi!: GridApi;
  mappingGridApi!: GridApi;
  ngOnInit(): void {
  }

  onServerGridReady(params: GridReadyEvent) {
    this.managementGridApi = params.api;
  }

  onMappingGridReady(params: GridReadyEvent) {
    this.mappingGridApi = params.api;
    this.mappingGridApi.sizeColumnsToFit()
  }

  addMapping(){
    const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){

      }
    });
  }

  modifyMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){}
      });
    }
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

  addManagement(){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){

      }
    });
  }

  modifyManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
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

  deleteManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (name : " + this.managementGridApi.getSelectedRows()[0].name+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,

        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.managementGridApi.applyTransaction({ remove: this.managementGridApi.getSelectedRows() })!;

        }
      });
    }
  }

}
