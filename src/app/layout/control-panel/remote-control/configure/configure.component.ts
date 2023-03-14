import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AddRemoteParameterConfigurationInfoComponent } from 'src/app/component/add-remote-parameter-configuration-info/add-remote-parameter-configuration-info.component';
import { AddRegisterRemoteSettingComponent } from 'src/app/component/add-register-remote-setting/add-register-remote-setting.component';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  @ViewChild('configure1', { read: ElementRef }) configure1 : ElementRef;

  @ViewChild('configure2', { read: ElementRef }) configure2 : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private devicemanagerService : DevicemanagerService,
    private utilService : UtilService,
    private uiService : UiService
  ) { }

  configurationColumnDefs: ColDef[] = [
    { field: 'configureName', headerName: 'Configure Name', tooltipField: 'configureName' },
    { field: 'carLocalSavePeriod', headerName : 'Car Local Save Period (ms)', tooltipField: 'carLocalSavePeriod', minWidth:220},
    { field: 'normalSubmitPeriod', headerName : 'Normal Submit Period (sec)', tooltipField: 'normalSubmitPeriod', minWidth:220},
    { field: 'warningSubmitPeriod', headerName : 'Warning Submit Period (ms)', tooltipField: 'warningSubmitPeriod', minWidth:250},
    { field: 'managePlatformName', headerName : 'Manage Platform Name', tooltipField: 'managePlatformName'},
    { field: 'managePlatformPort', headerName : 'Manage Platform Port', tooltipField: 'managePlatformPort'},
    { field: 'hwVersion', headerName : 'Hardware Version(sw)', tooltipField: 'hwVersion'},
    { field: 'fwVersion', headerName : 'Firmware Version', tooltipField: 'fwVersion'},
    { field: 'carHeartBeatPeriod', headerName: 'Car Heart Beat Period (sec)', tooltipField: 'carHeartBeatPeriod', minWidth:220},
    { field: 'carResponseTimeout', headerName : 'Car Response Timeout (sec)', tooltipField: 'carResponseTimeout', minWidth:250},
    { field: 'platformResponseTimeout', headerName : 'Platform Response Timeout (sec)', tooltipField: 'platformResponseTimeout', minWidth:280},
    { field: 'nextLoginInterval', headerName : 'Next Login Interval (sec)', tooltipField: 'nextLoginInterval'},
    { field: 'publicPlatformName', headerName : 'Public Platform Name', tooltipField: 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'Public Platform Port', tooltipField: 'publicPlatformPort'},
    { field: 'monitoring', headerName : 'Monitoring', tooltipField: 'monitoring'},
    //{ field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt' }},
    //{ field: 'updatedUserId', headerName : 'updated User Id', tooltipField: 'updatedUserId'},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyConfigure(field)
      },
      delete : (field: any) => {
        this.deleteConfigure(field)
      },
    }, width:120},
  ];

  mappingColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin'},
    { field: 'matched', headerName : 'Matched', tooltipField: 'matched'},
    { field: 'matched_date', headerName : 'Matched Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'matched_date', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'matched_date' }},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      onlyRemove : true,
      delete : (field: any) => {
        this.deleteMapping(field)
      },
    }, width:120},
  ];

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

  page$ : Subscription
  page2$ : Subscription
  grid1Height : number
  grid2Height : number
  pageSize : number
  pageSize2 : number
  currentPage : number = 1
  currentPage2 : number = 1

  selectConfigureName : string = ""


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
      this.getDevicemanagersParameter()
    })

    this.page2$ = this.uiService.page2$.subscribe((page : number)=>{
      this.currentPage2 = page
      this.getDevicemanagersParametersConfigureNameVehicles()
    })
  }

  getPageSize(){
    this.grid1Height = this.configure1.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.grid1Height)
    this.getDevicemanagersParameter()

    this.grid2Height = this.configure2.nativeElement.offsetHeight
    this.pageSize2 = this.uiService.getGridPageSize(this.grid1Height)
    if(this.selectConfigureRow != null){
      this.getDevicemanagersParametersConfigureNameVehicles()
    }
  }

  onResize(event : any){
    if(this.grid1Height != this.configure1.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }

  getDevicemanagersParameter(){

    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize

    this.devicemanagerService.getDevicemanagersParameter(f).subscribe(res=>{
      console.log(res)
      this.devicemanagersParameter = res.body

      let pagination = {
        count : this.devicemanagersParameter.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

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
        type:this.constant.ADD_TYPE,
        configureName : this.selectConfigureRow.configureName
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getDevicemanagersParametersConfigureNameVehicles()
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
        if(result){

        }
      });
    }
  }



  deleteMapping(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the mapping ? (VIN : " + field.vin+ ")",
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

  addConfigure(){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getDevicemanagersParameter()
      }
    });
  }

  modifyConfigure(field: any){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.MODIFY_TYPE,
        configure : field
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getDevicemanagersParameter()
      }
    });
  }

  deleteConfigure(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (name : " + field.configureName+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.deleteDevicemanagersParametersConfigureName(field.configureName)
      }
    });
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
      this.devicemanagersParameterVehicle = res.body
      let pagination = {
        count : this.devicemanagersParameterVehicle.count,
        pageSize : this.pageSize2,
        page : this.currentPage2
      }

      this.uiService.setPagination2(pagination)
    },error=>{
      console.log(error)
    })
  }


  onBtExport(type : string) {
    if(type == "configure"){
      this.devicemanagerService.getDevicemanagersParameter(new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("Configure", this.configureGridApi ,res.body.entities)
      },error=>{
        console.log(error)
      })
    }else{
      this.devicemanagerService.getDevicemanagersParametersConfigureNameVehicles(this.selectConfigureRow.configureName, new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("Configure Vehicle", this.mappingGridApi,res.body.entities)
      },error=>{
        console.log(error)
      })
    }
  }

}
