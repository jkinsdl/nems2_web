import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.css']
})
export class ServerLogsComponent implements OnInit {

  @ViewChild('serverLogGrid', { read: ElementRef }) serverLogGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private gbpacketService : GbpacketService,
    private utilService : UtilService,
    private uiService : UiService

  ) { }
  columnDefs: ColDef[] = [
    { field: 'data', headerName: 'data', tooltipField: 'data', },
    { field: 'encryption', headerName: 'encryption', tooltipField: 'encryption'},
    { field: 'flaged', headerName : 'flaged', tooltipField: 'flaged'},
    { field: 'packetTime', headerName : 'packetTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime' }},
    { field: 'request', headerName : 'request', tooltipField: 'request'},
    { field: 'response', headerName : 'response', tooltipField: 'response'},
    { field: 'responsePacket', headerName : 'responsePacket', tooltipField: 'responsePacket'},
    { field: 'serverTime', headerName : 'serverTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime' }},
    { field: 'type', headerName : 'type', tooltipField: 'type'},
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
  ];

  gridApi!: GridApi;
  selectNodeID : string = null;

  beginDate : Date = null
  endDate : Date = null

  gbpacket : any ={
    count : 0,
    entities : [],
    link : {}
  }

  loginFilter : boolean = false
  logoutFilter : boolean = false
  realTimeFilter : boolean = false
  addtionaFilter : boolean = false
  etcFilter : boolean = false
  customFilter : boolean = false

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
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
    this.endDate = new Date()
    this.beginDate = new Date()
    this.beginDate.setDate(this.endDate.getDate() - 30)
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getPageSize()
    })
  }

  getPageSize(){
    this.gridHeight = this.serverLogGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getGbpacket()
  }

  onResize(event : any){
    this.getPageSize()
  }

  getGbpacket(){
    this.searchFilter.request = []

    if(this.loginFilter){
      this.searchFilter.request.push("LOGIN")
    }

    if(this.logoutFilter){
      this.searchFilter.request.push("LOGOUT")
    }

    if(this.realTimeFilter){
      this.searchFilter.request.push("REALTIME")
    }

    if(this.addtionaFilter){
      this.searchFilter.request.push("ADDITIONAL")
    }

    if(this.etcFilter){
      this.searchFilter.request.push("ETC")
    }

    if(this.customFilter){
      this.searchFilter.request.push("CUSTOM")
    }

    this.searchFilter.begin = this.beginDate.toISOString()
    this.searchFilter.end = this.endDate.toISOString()
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize


    this.gbpacketService.getGbpacket(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.gbpacket = res.body
      let pagination = {
        count : this.gbpacket.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)
    },error=>{
      console.log(error)
    })
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("Server Log", this.gridApi ,this.gbpacket.entities)
  }

}
