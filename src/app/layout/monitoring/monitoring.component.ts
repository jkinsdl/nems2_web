import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { LoginCarRendererComponent } from 'src/app/component/login-car-renderer/login-car-renderer.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

  @ViewChild('realTimeMonitoringGrid', { read: ElementRef }) realTimeMonitoringGrid : ElementRef;

  constructor(   private router: Router,
    private realtimedataService : RealtimedataService,
    private uiService : UiService,
    private utilService : UtilService) { }

  startDate : any
  endDate :any

  mapsBtn$ : Subscription

  columnDefs: ColDef[] = [
    { headerName: 'Login', width:80, cellRenderer : LoginCarRendererComponent},
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin', width:180},
    { field: 'regNumber', headerName : 'Reg. number', tooltipField: 'regNumber', width:130},
    { field: 'nemsSn', headerName : 'NEMS S/N', tooltipField: 'nemsSn', width:180},
    { field: 'lastUpdate', headerName : 'Last Updated', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastUpdate'},
    { field: 'accumulatedMile', headerName : 'Accumulated Mile(km)', tooltipField: 'accumulatedMile', width:200 },
    { field: 'packetCount', headerName : 'Packet Count', tooltipField: 'packetCount', width:150 },
    { field: 'model', headerName : 'model', tooltipField: 'model', width:100 },
    { field: 'region', headerName : 'region', tooltipField: 'region', width:100 },
    { field: 'purpose', headerName : 'Purpose', tooltipField: 'purpose', valueFormatter : this.utilService.purposeValueToString, width:120 },
    { field: 'warningLevel', headerName : 'Warning', tooltipField: 'warningLevel', width:100 },
    { field: 'soc', headerName : 'soc(%)', tooltipField: 'soc', width:100 },
  ];

  vehicleInfo : any ={
    totalCount : 0,
    vehicleBrief : []

  }

  gridApi!: GridApi;

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnInit(): void {
    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getRealtimedataVehiclelist()
    })
  }

  getPageSize(){
    this.gridHeight = this.realTimeMonitoringGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getRealtimedataVehiclelist()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.realTimeMonitoringGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.realTimeMonitoringGrid.nativeElement.offsetWidth > 1640){
      this.gridApi.sizeColumnsToFit()
    }

  }

  getVehicleRow(event : any){
    console.log(event.data)

    this.router.navigateByUrl('/main/monitoring/detail/'+event.data.vin).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });

  }

  getRealtimedataVehiclelist(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.realtimedataService.getRealtimedataVehiclelist(this.searchFilter).subscribe(
      res=>{
        console.log(res)
        this.vehicleInfo = res.body
        let pagination = {
          count : this.vehicleInfo.totalCount,
          pageSize : this.pageSize,
          page : this.currentPage
        }

        this.uiService.setPagination(pagination)

      }, error=>{
        console.log(error)
      })
  }

  moveDetaileMonitoring(){
    this.router.navigateByUrl('/main/monitoring/detail/'+null).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.mapsBtn$)this.mapsBtn$.unsubscribe()
    if(this.page$)this.page$.unsubscribe()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if(this.realTimeMonitoringGrid.nativeElement.offsetWidth > 1640){
      this.gridApi.sizeColumnsToFit()
    }
  }

  onBtExport() {

    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.realtimedataService.getRealtimedataVehiclelist(this.searchFilter).subscribe(
      res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("monitoring", this.gridApi ,res.body.vehicleBrief)
      }, error=>{
        console.log(error)
      })
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

}
