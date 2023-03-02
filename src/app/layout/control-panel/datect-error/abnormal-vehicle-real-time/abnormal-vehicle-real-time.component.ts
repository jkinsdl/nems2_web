import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';

@Component({
  selector: 'app-abnormal-vehicle-real-time',
  templateUrl: './abnormal-vehicle-real-time.component.html',
  styleUrls: ['./abnormal-vehicle-real-time.component.css']
})
export class AbnormalVehicleRealTimeComponent implements OnInit {

  @ViewChild('abnormalVehicleRealTimeGrid', { read: ElementRef }) abnormalVehicleRealTimeGrid : ElementRef;

  constructor(
    private vehiclewarningService : VehiclewarningService,
    private utilService : UtilService,
    private uiService : UiService) { }

  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'server_time', headerName: 'Server Time'},
    { field: 'packet_time', headerName : 'Packet Time'},
    { field: 'state', headerName : 'State'},
    { field: 'value', headerName : 'Value'},
    { field: 'data', headerName : 'Data'},
  ];

  rowData = [
    {
        vin: 'vin',
        server_time: 'server_time',
        packet_time: 'packet_time',
        state: 'state',
        value: 'value',
        data: 'data',
    },
    {
      vin: 'vin',
      server_time: 'server_time',
      packet_time: 'packet_time',
      state: 'state',
      value: 'value',
      data: 'data',
  },
  {
    vin: 'vin',
    server_time: 'server_time',
    packet_time: 'packet_time',
    state: 'state',
    value: 'value',
    data: 'data',
  }];

  gridApi!: GridApi;
  selectNodeID : string = null;

  startDate : any
  endDate :any

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
    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());


  }

  getPageSize(){
    this.gridHeight = this.abnormalVehicleRealTimeGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getVehiclewarnings()
  }

  onResize(event : any){
    this.getPageSize()
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  getVehiclewarnings(){
    this.vehiclewarningService.getVehiclewarnings(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  onBtExport() {
    this.utilService.gridDataToExcelData("abnormal vehicle real time", this.gridApi ,this.rowData)
  }

}
