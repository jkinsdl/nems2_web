import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-location-jump',
  templateUrl: './location-jump.component.html',
  styleUrls: ['./location-jump.component.css']
})
export class LocationJumpComponent implements OnInit {


  @ViewChild('locationJumpGrid', { read: ElementRef }) locationJumpGrid : ElementRef;

  constructor(
    private utilService : UtilService,
    private uiService : UiService,
    private gbpacketService : GbpacketService,
  ) { }


  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin', width:120 },
    { field: 'serverTime', headerName: 'Server Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime' }, width:140},
    { field: 'packetTime', headerName : 'Packet Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime' }, width:140},
    { field: 'state',headerName: "State", tooltipField: 'state', width:120},
    { field: 'value', headerName : 'Value', tooltipField: 'value', width:100},
    { field: 'data', headerName : 'Data', tooltipField: 'data'},
  ];

  gridApi!: GridApi;
  selectNodeID : string = null;

  beginDate : any
  endDate :any

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  errorPacketList : any = {
    entities : [],
    count : 0
  }

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
    this.gridHeight = this.locationJumpGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getGbpacketInvalid()
  }

  getGbpacketInvalid(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.searchFilter.state = ["LOCATION"]

    if(this.beginDate){
      this.searchFilter.begin = new Date(this.beginDate).toISOString()
    }else{
      this.searchFilter.begin = undefined
    }

    if(this.endDate){
      this.searchFilter.end = new Date(this.endDate).toISOString()
    }else{
      this.searchFilter.end = undefined
    }

    this.gbpacketService.getGbpacketInvalid(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.errorPacketList = res.body

      let pagination = {
        count : this.errorPacketList.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
    })
  }

  onResize(event : any){
    if(this.gridHeight != this.locationJumpGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.gbpacketService.getGbpacketInvalid(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("abnormal vehicle real time", this.gridApi ,res.body)
    },error=>{
      console.log(error)
    })
  }

  changeFilter(){
    this.uiService.setCurrentPage(1);
  }

  clearEndDate(){
    this.endDate = undefined
  }

  clearBeginDate(){
    this.beginDate = undefined
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

}
