import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddVehicleComponent } from 'src/app/component/add-vehicle/add-vehicle.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
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
    { field: 'iccid', headerName : 'iccid', tooltipField: 'iccid'},
    { field: 'vin', headerName : 'VIN', tooltipField: 'vin'},
    { field: 'nemsSn', headerName : 'NEMS S/N', tooltipField: 'nemsSn'},
    { field: 'registDate', headerName : 'Regist Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'registDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'registDate' }},
    { field: 'sOffDate', headerName : 'S Off Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'sOffDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'sOffDate' }},
    { field: 'region', headerName : 'region', tooltipField: 'region'},
    { field: 'registrationPlate', headerName : 'Reg. number', tooltipField: 'registrationPlate'},
    { field: 'purpose', headerName : 'Purpose', tooltipField: 'purpose'},
    { field: 'modelName', headerName : 'model', tooltipField: 'modelName'},
    { field: 'batteryCode', headerName: 'battery code', tooltipField: 'batteryCode'},
    { field: 'motorNo', headerName : 'motor no', tooltipField: 'motorNo'},
    { field: 'engineNo', headerName: 'engine no', tooltipField: 'engineNo'},
    { field: 'histories', headerName: 'histories', tooltipField: 'histories'},
    //{ field: 'registrationPlate', headerName : 'registrationPlate', tooltipField: 'registrationPlate'},
    //{ field: 'pcode', headerName : 'pcode', tooltipField: 'pcode'}
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyVehicle(field)
      },
      delete : (field: any) => {
        this.deleteVehicle(field)
      },
    }, width:120},
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

  filter : string = "VIN"
  searchText : string = ""

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
    if(this.gridHeight != this.vehicleSettingsGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
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
        this.getVehiclemanagerStaticinfo()
      }
    });
  }

  modifyVehicle(field: any){
    const dialogRef = this.dialog.open( AddVehicleComponent, {
      data:{
        type : this.constant.MODIFY_TYPE,
        vehicle : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getVehiclemanagerStaticinfo()
      }
    });
  }


  deleteVehicle(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (VIN : " + field.vin+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteVehiclemanagerStaticinfoVin(field.vin)
      }
    });
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

  onBtExport(){
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      this.utilService.gridDataToExcelData("Vehicle Settings",this.gridApi,res.body.vehicleList)
    },error=>{
      console.log(error)
    })
  }

  setSearch(){

    if(this.searchText != ""){
      if(this.filter == 'VIN'){
        this.searchFilter.vin = this.searchText
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
      }else if(this.filter == 'iccid'){
        this.searchFilter.iccid = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
      }else if(this.filter == 'NEMS S/N'){
        this.searchFilter.nemsSn = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
      }else if(this.filter == 'Reg. number'){
        this.searchFilter.registrationPlate = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
      }else if(this.filter == 'region'){
        this.searchFilter.region = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.pcode = undefined
      }else if(this.filter == 'pcode'){
        this.searchFilter.pcode = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
      }
    }else{
      this.searchFilter.vin = undefined
      this.searchFilter.iccid = undefined
      this.searchFilter.nemsSn = undefined
      this.searchFilter.registrationPlate = undefined
      this.searchFilter.region = undefined
      this.searchFilter.pcode = undefined
    }

    this.uiService.setCurrentPage(1);
  }
}
