import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddPublicPlatformManagementComponent } from 'src/app/component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from 'src/app/component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-public-platform-for-specific-period',
  templateUrl: './public-platform-for-specific-period.component.html',
  styleUrls: ['./public-platform-for-specific-period.component.css']
})
export class PublicPlatformForSpecificPeriodComponent implements OnInit {
  @ViewChild('publicPlatformForSpecificPeriod1', { read: ElementRef }) publicPlatformForSpecificPeriod1 : ElementRef;

  @ViewChild('publicPlatformForSpecificPeriod2', { read: ElementRef }) publicPlatformForSpecificPeriod2 : ElementRef;


  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private utilService : UtilService,
    private uiService : UiService,
    private forwardingService : ForwardingService
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
  ];




  relationsColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin' },
    { field: 'synctime', headerName: 'Last sync(packet time)', tooltipField: 'synctime'}
  ];

  relations : any = {
    count : 0,
    entities : []
  }

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

  forwarding : any = {
    count : 0,
    entities : []
  }

  selectForwardingServerName : string = null

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
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
    this.grid1Height = this.publicPlatformForSpecificPeriod1.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.grid1Height)
    this.getForwarding()

    this.grid2Height = this.publicPlatformForSpecificPeriod2.nativeElement.offsetHeight
    this.pageSize2 = this.uiService.getGridPageSize(this.grid1Height)

  }

  getForwarding(){
    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize
    f.isPeriod = true

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


  onResize(event : any){
    if(this.grid1Height != this.publicPlatformForSpecificPeriod1.nativeElement.offsetHeight){
      this.getPageSize()
    }
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

  onBtExport(type : string) {
    if(type == "management"){
      let f = new SearchFilter()
      f.isPeriod = true
      this.forwardingService.getForwarding(f).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("public platform for specific period 1", this.managementGridApi ,res.body.entities)
      },error=>{
        console.log(error)
      })
    }else{
      this.forwardingService.getForwardingServerNameRelations(this.selectForwardingServerName, new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("public platform for specific period 2", this.mappingGridApi,res.body.entities)
      },error=>{
        console.log(error)
      })
    }
  }
}
