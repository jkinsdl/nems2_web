import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddVehicleComponent } from 'src/app/component/add-vehicle/add-vehicle.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-vehicle-settings',
  templateUrl: './vehicle-settings.component.html',
  styleUrls: ['./vehicle-settings.component.css']
})
export class VehicleSettingsComponent implements OnInit {

  @ViewChild('vehicleSettingsGrid', { read: ElementRef }) vehicleSettingsGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
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
    { field: 'sOffDate', headerName : 'sOffDate', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'sOffDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'sOffDate' }},
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
    { field: 'pcode', headerName : 'pcode', tooltipField: 'pcode'}
  ];

  vehicle : any = {
    count : 0,
    vehicleList : []
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
    this.gridHeight = this.vehicleSettingsGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getVehiclemanagerStaticinfo()
  }

  onResize(event : any){
    this.getPageSize()
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

  addVehicle(){
    const dialogRef = this.dialog.open( AddVehicleComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.sOffDate){
        this.postVehiclemanagerStaticinfo(result)
      }
    });
  }

  postVehiclemanagerStaticinfo(parameter : any){
    this.vehiclemanagerService.postVehiclemanagerStaticinfo(parameter).subscribe(res=>{
      console.log(res)
      this.getVehiclemanagerStaticinfo()
    },error=>{
      console.log(error)
    })
  }

  modifyVehicle(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddVehicleComponent, {
        data:{
          type : this.constant.MODIFY_TYPE,
          vehicle : this.gridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.putVehiclemanagerStaticinfoVin(result)
        }
      });
    }
  }

  putVehiclemanagerStaticinfoVin(parameter : any){
    this.vehiclemanagerService.putVehiclemanagerStaticinfoVin(parameter).subscribe(res=>{
      console.log(res)
      this.getVehiclemanagerStaticinfo()
    },error=>{
      console.log(error)
    })
  }


  deleteVehicle(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (VIN : " + this.gridApi.getSelectedRows()[0].vin+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteVehiclemanagerStaticinfoVin(this.gridApi.getSelectedRows()[0].vin)
        }
      });
    }
  }

  deleteVehiclemanagerStaticinfoVin(vin:string){
    this.vehiclemanagerService.deleteVehiclemanagerStaticinfoVin(vin).subscribe(res=>{
      console.log(res)
      this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
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
    this.utilService.gridDataToExcelData("Vehicle Settings",this.gridApi,this.vehicle.vehicleList)
  }

}
