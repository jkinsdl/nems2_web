import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddPublicPlatformManagementComponent } from 'src/app/component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from 'src/app/component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-public-platform-management',
  templateUrl: './public-platform-management.component.html',
  styleUrls: ['./public-platform-management.component.css']
})
export class PublicPlatformManagementComponent implements OnInit {

  @ViewChild('publicPlatformManagementGrid1', { read: ElementRef }) publicPlatformManagementGrid1 : ElementRef;

  @ViewChild('publicPlatformManagementGrid2', { read: ElementRef }) publicPlatformManagementGrid2 : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private forwardingService : ForwardingService,
    private utilService : UtilService,
    private uiService : UiService
  ) { }

  forwardingColumnDefs: ColDef[] = [
    { field: 'serverName', headerName : 'name', tooltipField: 'serverName'},
    { field: 'domain', headerName : 'IP', tooltipField: 'domain'},
    { field: 'port', headerName : 'port', tooltipField: 'port'},
    { field: 'platformId', headerName : 'platform ID', tooltipField: 'platformId'},
    { field: 'lastLogin', headerName : 'last login', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastLogin', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastLogin' }},
    { field: 'lastLogout', headerName : 'last logout', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastLogout', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastLogout' }},
    { field: 'connectionStatus', headerName : 'start/stop', tooltipField: 'connectionStatus'},
    { field: 'noAck', headerName : 'no Ack Mode', tooltipField: 'noAck'},
    { field: 'forceLoginVehicle', headerName : 'force vehcile login', tooltipField: 'forceLoginVehicle'},
    { field: 'filterLocationInfo', headerName : 'filter location info', tooltipField: 'filterLocationInfo'},
    { field: 'encryptionMode', headerName : 'encryption Mode', tooltipField: 'encryptionMode'},
    { field: 'encryptionKey', headerName : 'encryption Key', tooltipField: 'encryptionKey'},
    { field: '', headerName : 'enterprise code', tooltipField: ''},
    { field: 'connectionStatus', headerName : 'connectionStatus', tooltipField: 'connectionStatus'},
    { field: 'platformPw', headerName : 'platformPw', tooltipField: 'platformPw'},
    { field: 'action', cellRenderer: BtnCellRendererComponent,

    cellRendererParams: {
      modify: (field: any) => {
        this.modifyManagement(field)
      },
      delete : (field: any) => {
        this.deleteManagement(field)
      },
    }, width:120},
  ];

  forwarding : any = {
    count : 0,
    entities : []
  }


  relationsColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin' },
    { field: 'synctime', headerName: 'Last sync(packet time)', tooltipField: 'synctime'},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      onlyRemove : true,
      delete : (field: any) => {
        this.deleteMapping(field)
      },
    }, width:120},
  ];

  relations : any = {
    count : 0,
    entities : []
  }

  managementGridApi!: GridApi;
  mappingGridApi!: GridApi;

  selectForwardingServerName : string = null

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
      this.getForwarding()
    })

    this.page2$ = this.uiService.page2$.subscribe((page : number)=>{
      this.currentPage2 = page
      this.getForwardingServerNameRelations(this.selectForwardingServerName)
    })
  }

  getPageSize(){

    this.grid1Height = this.publicPlatformManagementGrid1.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.grid1Height)
    this.getForwarding()

    this.grid2Height = this.publicPlatformManagementGrid2.nativeElement.offsetHeight
    this.pageSize2 = this.uiService.getGridPageSize(this.grid1Height)
    if(this.selectForwardingServerName != null){
      this.getForwardingServerNameRelations(this.selectForwardingServerName)
    }
  }

  onResize(event : any){
    if(this.grid1Height != this.publicPlatformManagementGrid1.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }

  getForwarding(){
    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize
    f.isPeriod = false

    this.forwardingService.getForwarding(f).subscribe(res=>{
      console.log(res)
      this.forwarding = res.body

      let pagination = {
        count : this.forwarding.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
    })
  }

  onServerGridReady(params: GridReadyEvent) {
    this.managementGridApi = params.api;
  }

  onForwardingRowClick(event : any ){
    console.log(event)
    this.selectForwardingServerName = event.data.serverName
    this.getForwardingServerNameRelations(this.selectForwardingServerName)
  }

  getForwardingServerNameRelations(serverName : string){
    let f = new SearchFilter()
    f.offset = (this.currentPage2-1) * this.pageSize2
    f.limit = this.pageSize2


    this.forwardingService.getForwardingServerNameRelations(serverName, f).subscribe(res=>{
      console.log(res)
      this.relations = res.body

      let pagination = {
        count : this.relations.count,
        pageSize : this.pageSize2,
        page : this.currentPage2
      }

      this.uiService.setPagination2(pagination)
    },error=>{
      console.log(error)
    })
  }

  onMappingGridReady(params: GridReadyEvent) {
    this.mappingGridApi = params.api;
    this.mappingGridApi.sizeColumnsToFit()
  }

  addManagement(){
    const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getForwarding()
      }
    });
  }



  modifyManagement(field: any){
    const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
      data:{
        type:this.constant.MODIFY_TYPE,
        forwarding : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getForwarding()
      }
    });
  }

  sendManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Forwarding Server",
          alertContents : "Do you want to forwarding the server ? (Server Name : " + this.managementGridApi.getSelectedRows()[0].serverName+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.putForwardingServerNameCommand(this.managementGridApi.getSelectedRows()[0].serverName)
        }
      });
    }
  }

  putForwardingServerNameCommand(serverName : string){
    this.forwardingService.putForwardingServerNameCommand(serverName).subscribe(res=>{
      console.log(res)
      this.utilService.alertPopup("Public Platform", "Server forwarding complete.", this.constant.POPUP_CONFIRM)
    },error=>{

    })
  }



  deleteManagement(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (Server Name : " + field.serverName+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteForwardingServerName(field.serverName)
      }
    });
  }

  deleteForwardingServerName(serverName : string){
    this.forwardingService.deleteForwardingServerName(serverName).subscribe(res=>{
      console.log(res)

      if(serverName == this.selectForwardingServerName){
        this.selectForwardingServerName = null
        this.relations = {
          count : 0,
          entities : []
        }
      }

      this.managementGridApi.applyTransaction({ remove: this.managementGridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  addMapping(){
    const dialogRef = this.dialog.open( AddPublicPlatformMappingComponent, {
      data:{
        type:this.constant.ADD_TYPE,
        serverName : this.selectForwardingServerName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getForwardingServerNameRelations(this.selectForwardingServerName)
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

  deleteMapping(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the mapping ? (VIN : " + field.vin+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteForwardingServerNameRelations(field.vin);
      }
    });
  }

  deleteForwardingServerNameRelations(vin : string){

    let filter = new SearchFilter()
    filter.vin = vin

    this.forwardingService.deleteForwardingServerNameRelations(this.selectForwardingServerName,filter).subscribe(res=>{
      console.log(res)
      this.mappingGridApi.applyTransaction({ remove: this.mappingGridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  onBtExport(type : string) {
    if(type == "management"){
      let f = new SearchFilter()
      f.isPeriod = false
      this.forwardingService.getForwarding(f).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("public platform management forwarding", this.managementGridApi ,res.body.entities)
      },error=>{
        console.log(error)
      })
    }else{
      this.forwardingService.getForwardingServerNameRelations(this.selectForwardingServerName, new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("public platform management relations", this.mappingGridApi,res.body.entities)
      },error=>{
        console.log(error)
      })
    }
  }
}
