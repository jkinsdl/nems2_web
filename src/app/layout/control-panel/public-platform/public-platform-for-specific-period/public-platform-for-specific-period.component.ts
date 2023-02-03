import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddPublicPlatformManagementComponent } from 'src/app/component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from 'src/app/component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-public-platform-for-specific-period',
  templateUrl: './public-platform-for-specific-period.component.html',
  styleUrls: ['./public-platform-for-specific-period.component.css']
})
export class PublicPlatformForSpecificPeriodComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
  ) { }

  managementColumnDefs: ColDef[] = [
    { field: 'name', headerName: 'name' },
    { field: 'ip', headerName: 'IP'},
    { field: 'port', headerName : 'port'},
    { field: 'platform_id', headerName : 'platform ID'},
    { field: 'platform_password', headerName : 'platform password'},
    { field: 'last_login', headerName : 'last login'},
    { field: 'last_logout', headerName : 'last logout'},
    { field: 'stat_stop', headerName : 'stat/stop'},
    { field: 'no_ack_mode', headerName : 'no_ack_mode'},
    { field: 'force_login_vehicle', headerName : 'force login vehicle'},
    { field: 'filter_location_info', headerName : 'filter location info'},
    { field: 'encryption_mode', headerName : 'encryption mode'},
    { field: 'encryption_key', headerName : 'encryption key'},
  ];

  managementRowData = [
    {
      name: 'name',
      ip: 'ip',
      port: 'port',
      platform_id : 'platform_id',
      platform_password : 'platform_password',
      last_login : 'last_login',
      last_logout : 'last_logout',
      stat_stop : 'stat_stop',
      no_ack_mode : 'no_ack_mode',
      force_login_vehicle : 'force_login_vehicle',
      filter_location_info : 'filter_location_info',
      encryption_mode : 'encryption_mode',
      encryption_key : 'encryption_key'
    },
    {
      name: 'name',
      ip: 'ip',
      port: 'port',
      platform_id : 'platform_id',
      platform_password : 'platform_password',
      last_login : 'last_login',
      last_logout : 'last_logout',
      stat_stop : 'stat_stop',
      no_ack_mode : 'no_ack_mode',
      force_login_vehicle : 'force_login_vehicle',
      filter_location_info : 'filter_location_info',
      encryption_mode : 'encryption_mode',
      encryption_key : 'encryption_key'
    },
    {
      name: 'name',
      ip: 'ip',
      port: 'port',
      platform_id : 'platform_id',
      platform_password : 'platform_password',
      last_login : 'last_login',
      last_logout : 'last_logout',
      stat_stop : 'stat_stop',
      no_ack_mode : 'no_ack_mode',
      force_login_vehicle : 'force_login_vehicle',
      filter_location_info : 'filter_location_info',
      encryption_mode : 'encryption_mode',
      encryption_key : 'encryption_key'
    },
  ];



  mappingColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'vehicle_info_senapshot', headerName: 'Vehicle Info Snapshot'},
    { field: 'last_sync', headerName : 'last sync(server time)'},
  ];

  mappingRowData = [
    {
      vin: 'vin',
      vehicle_info_senapshot: 'vehicle_info_senapshot',
      last_sync: 'last_sync'
    },
    {
      vin: 'vin',
      vehicle_info_senapshot: 'vehicle_info_senapshot',
      last_sync: 'last_sync'
    },
    {
      vin: 'vin',
      vehicle_info_senapshot: 'vehicle_info_senapshot',
      last_sync: 'last_sync'
    }
  ];

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
    const dialogRef = this.dialog.open( AddPublicPlatformMappingComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  modifyMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddPublicPlatformMappingComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe(result => {
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
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.mappingGridApi.applyTransaction({ remove: this.mappingGridApi.getSelectedRows() })!;
        }
      });
    }
  }

  addManagement(){
    const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  modifyManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe(result => {
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
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.managementGridApi.applyTransaction({ remove: this.managementGridApi.getSelectedRows() })!;

        }
      });
    }
  }

}
