import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-otainformation',
  templateUrl: './otainformation.component.html',
  styleUrls: ['./otainformation.component.css']
})
export class OTAInformationComponent implements OnInit {

  @ViewChild('otaInformationGrid', { read: ElementRef }) otaInformationGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()

  constructor(
    private vehiclemanagerService : VehiclemanagerService,
    private utilService : UtilService,
    private uiService : UiService
  ) { }
  columnDefs: ColDef[] = [
    { field: 'batteryCode', headerName: 'batteryCode', tooltipField: 'batteryCode'},
    { field: 'engineNo', headerName: 'engineNo', tooltipField: 'engineNo'},
    { field: 'iccid', headerName : 'iccid', tooltipField: 'iccid'},
    { field: 'modelName', headerName : 'modelName', tooltipField: 'modelName'},
    { field: 'motorNo', headerName : 'motorNo', tooltipField: 'motorNo'},
    { field: 'nemsSn', headerName : 'nemsSn', tooltipField: 'nemsSn'},
    { field: 'purpose', headerName : 'purpose', tooltipField: 'purpose'},
    { field: 'region', headerName : 'region', tooltipField: 'region'},
    { field: 'registDate', headerName : 'registDate', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'registDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'registDate' }},
    { field: 'registrationPlate', headerName : 'registrationPlate', tooltipField: 'registrationPlate'},
    { field: 'sOffDate', headerName : 'sOffDate', tooltipField: 'sOffDate'},
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
    { field: 'pcode', headerName : 'pcode', tooltipField: 'pcode'}
  ];

  vehicle : any ={
    count : 0,
    vehicleList : []
  }

  private gridApi!: GridApi;
  selectNodeID : string = null;

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
      this.getVehiclemanagerStaticinfo()
    })
  }

  getPageSize(){
    if(this.gridHeight != this.otaInformationGrid.nativeElement.offsetHeight){
      this.gridHeight = this.otaInformationGrid.nativeElement.offsetHeight;
      this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
      this.getVehiclemanagerStaticinfo()
    }
  }

  onResize(event : any){
    this.getPageSize()
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getVehiclemanagerStaticinfo(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehicle = res.body

      let pagination = {
        count : this.vehicle.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
    })
  }

  onBtExport() {
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("OTA Information", this.gridApi ,res.body.vehicleList)
    },error=>{
      console.log(error)
    })
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }
}
