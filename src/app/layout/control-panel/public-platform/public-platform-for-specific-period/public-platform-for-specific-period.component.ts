import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddPublicPlatformManagementComponent } from 'src/app/component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from 'src/app/component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-public-platform-for-specific-period',
  templateUrl: './public-platform-for-specific-period.component.html',
  styleUrls: ['./public-platform-for-specific-period.component.css']
})
export class PublicPlatformForSpecificPeriodComponent implements OnInit {
  @ViewChild('publicPlatformManagementGrid1', { read: ElementRef }) publicPlatformManagementGrid1 : ElementRef;

  @ViewChild('publicPlatformManagementGrid2', { read: ElementRef }) publicPlatformManagementGrid2 : ElementRef;


  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private utilService : UtilService,
    private uiService : UiService
  ) { }

  managementColumnDefs: ColDef[] = [
    { field: 'name', headerName: 'name', tooltipField: 'name' },
    { field: 'ip', headerName: 'IP', tooltipField: 'ip'},
    { field: 'port', headerName : 'port', tooltipField: 'port'},
    { field: 'platform_id', headerName : 'platform ID', tooltipField: 'platform_id'},
    { field: 'platform_password', headerName : 'platform password', tooltipField: 'platform_password'},
    { field: 'last_login', headerName : 'last login', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'last_login', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'last_login' }},
    { field: 'last_logout', headerName : 'last logout', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'last_logout', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'last_logout' }},
    { field: 'stat_stop', headerName : 'stat/stop', tooltipField: 'stat_stop'},
    { field: 'no_ack_mode', headerName : 'no_ack_mode', tooltipField: 'no_ack_mode'},
    { field: 'force_login_vehicle', headerName : 'force login vehicle', tooltipField: 'force_login_vehicle'},
    { field: 'filter_location_info', headerName : 'filter location info', tooltipField: 'filter_location_info'},
    { field: 'encryption_mode', headerName : 'encryption mode', tooltipField: 'encryption_mode'},
    { field: 'encryption_key', headerName : 'encryption key', tooltipField: 'encryption_key'},
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
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin' },
    { field: 'vehicle_info_senapshot', headerName: 'Vehicle Info Snapshot', tooltipField: 'vehicle_info_senapshot'},
    { field: 'last_sync', headerName : 'last sync(server time)', tooltipField: 'last_sync'},
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

  managementGridApi!: GridApi;
  mappingGridApi!: GridApi;

  page$ : Subscription
  page2$ : Subscription
  grid1Height : number
  grid2Height : number
  pageSize : number
  pageSize2 : number
  currentPage : number = 1
  currentPage2 : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
    if(this.page2$)this.page2$.unsubscribe()
  }

  ngOnInit(): void {
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
    })

    this.page2$ = this.uiService.page2$.subscribe((page : number)=>{
      this.currentPage2 = page
    })
  }

  getPageSize(){

    if(this.grid1Height != this.publicPlatformManagementGrid1.nativeElement.offsetHeight){
      this.grid1Height = this.publicPlatformManagementGrid1.nativeElement.offsetHeight
      this.pageSize = this.uiService.getGridPageSize(this.grid1Height)
    }

    if(this.grid2Height != this.publicPlatformManagementGrid2.nativeElement.offsetHeight){
      this.grid2Height = this.publicPlatformManagementGrid2.nativeElement.offsetHeight
      this.pageSize2 = this.uiService.getGridPageSize(this.grid1Height)
    }
  }


  onResize(event : any){
    this.getPageSize()
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

  onBtExport(type : string) {
    if(type == "management"){
      this.utilService.gridDataToExcelData("public platform for specific period 1", this.managementGridApi ,this.managementRowData)
    }else{
      this.utilService.gridDataToExcelData("public platform for specific period 2", this.mappingGridApi,this.mappingRowData)
    }
  }

}
