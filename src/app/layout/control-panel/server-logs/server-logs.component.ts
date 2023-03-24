import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { DetailServerLogComponent } from 'src/app/component/detail-server-log/detail-server-log.component';
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
    private dialog: MatDialog,
    private gbpacketService : GbpacketService,
    private utilService : UtilService,
    private uiService : UiService,
    private _formBuilder: FormBuilder,
  ) { }

  requestToppings = this._formBuilder.group({
    _aVEHICLE_LOGIN : false,
    _bINFORMATION : false,
    _cADDITIONAL : false,
    _dVEHICLE_LOGOUT : false,
    _ePLATFORM_LOGIN : false,
    _fPLATFORM_LOGOUT : false,
    _gVEHICLE_HEARTBEAT : false,
    _hVEHICLE_SYNC : false,
    _uVEHICLE_QUERY : false,
    _jVEHICLE_SETTING : false,
    _kVEHICLE_CONTROL : false,
    _lPLATFORM_CUSTOM_DATA_REQUEST : false,
    _mPLATFORM_CUSTOM_DATA_STATIC_INFO : false,
    _nPLATFORM_CUSTOM_TEST_TERMINAL : false,
    _oPLATFORM_CUSTOM_TEST_TERMIANL_RESET : false,
    _pPLATFORM_CUSTOM_OTA_REPORT : false,
  });


  columnDefs: ColDef[] = [
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
    { field: 'serverTime', headerName : 'serverTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime' }},
    { field: 'packetTime', headerName : 'packetTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime' }},
    { field: 'request', headerName : 'request', tooltipField: 'request', filter : CheckboxFilterComponent, filterParams :  { toppings: this.requestToppings}},
    { field: 'response', headerName : 'response', tooltipField: 'response'},
    { field: 'data', headerName: 'data', tooltipField: 'data', },
    { field: 'responsePacket', headerName : 'responsePacket', tooltipField: 'responsePacket'},
    { field: 'encryption', headerName: 'encryption', tooltipField: 'encryption'},
    { field: 'flaged', headerName : 'flaged', tooltipField: 'flaged'},
    { field: 'type', headerName : 'type', tooltipField: 'type'},
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
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getPageSize()
    })
  }

  getPageSize(){
    this.gridHeight = this.serverLogGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getGbpacket()
  }

  onResize(event : any){
    if(this.gridHeight != this.serverLogGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }

  getGbpacket(){
    this.searchFilter.request = []

    for (const [key, value] of Object.entries(this.requestToppings.value)) {
      if(value){
        this.searchFilter.request.push(key.substr(2))
      }
    }

    if(this.beginDate){
      this.searchFilter.begin = this.beginDate.toISOString()
    }else{
      this.searchFilter.begin = undefined
    }

    if(this.endDate){
      this.searchFilter.end = this.endDate.toISOString()
    }else{
      this.searchFilter.end = undefined
    }

    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    /*this.searchFilter.asc = []
    this.searchFilter.asc.push('SERVER_TIME')*/
    this.searchFilter.desc = []
    this.searchFilter.desc.push('SERVER_TIME')

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

  onGridRowDoubleClicked(e : any){
    console.log(e)

    const dialogRef = this.dialog.open( DetailServerLogComponent, {
      data:{
        serverLog : e.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });

  }

  onBtExport() {

    this.gbpacketService.getGbpacketExport(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.exportDownload('server_log.zip',res.body[0].data)
    },error=>{
      console.log(error)
    })

    /*this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.gbpacketService.getGbpacket(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("Server Log", this.gridApi ,res.body.entities)
    },error=>{
      console.log(error)
    })*/
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

  clearEndDate(){
    this.endDate = undefined
  }

  clearBeginDate(){
    this.beginDate = undefined
  }


}
