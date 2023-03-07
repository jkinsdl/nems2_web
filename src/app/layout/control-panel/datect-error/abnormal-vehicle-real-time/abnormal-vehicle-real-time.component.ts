import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-abnormal-vehicle-real-time',
  templateUrl: './abnormal-vehicle-real-time.component.html',
  styleUrls: ['./abnormal-vehicle-real-time.component.css']
})
export class AbnormalVehicleRealTimeComponent implements OnInit {

  @ViewChild('abnormalVehicleRealTimeGrid', { read: ElementRef }) abnormalVehicleRealTimeGrid : ElementRef;


  constructor(
    private utilService : UtilService,
    private uiService : UiService,
    private gbpacketService : GbpacketService,
    private _formBuilder: FormBuilder,
  ) { }

  stateToppings = this._formBuilder.group({
    UNKNOWN : false,
    CARSTATE_INVALID : false,
    LOCATIONSTATE_INVALID : false,
    SPEED : false,
    TOTAL_VOLT : false,
    TOTAL_AMPHERE : false,
    SOC : false,
    LOCATION : false,
    MILEAGE_JUMP : false,
    DUPLICATED_AMPHERE : false,
    RELAY_DELAY : false,
  });

  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin', width:120 },
    { field: 'serverTime', headerName: 'Server Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime' }, width:140},
    { field: 'packetTime', headerName : 'Packet Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime' }, width:140},
    { field: 'state',headerName: "State", tooltipField: 'state', filter : CheckboxFilterComponent, filterParams :  { toppings: this.stateToppings}, width:120},
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
      this.gridHeight = this.abnormalVehicleRealTimeGrid.nativeElement.offsetHeight;
      this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
      this.getGbpacketInvalid()
  }

  getGbpacketInvalid(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize

    this.searchFilter.state = []
    for (const [key, value] of Object.entries(this.stateToppings.value)) {
      if(value){
        this.searchFilter.state.push(key)
      }
    }

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
    if(this.gridHeight != this.abnormalVehicleRealTimeGrid.nativeElement.offsetHeight){
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
