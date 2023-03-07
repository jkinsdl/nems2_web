import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { AddVehicleModelComponent } from 'src/app/component/add-vehicle-model/add-vehicle-model.component';
import { UtilService } from 'src/app/service/util.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
@Component({
  selector: 'app-vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.css']
})
export class VehicleModelComponent implements OnInit {

  @ViewChild('vehicleModelGrid', { read: ElementRef }) vehicleModelGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
    private vehiclemanagersService : VehiclemanagerService,
    private utilService : UtilService,
    private uiService : UiService
  ) { }

  columnDefs: ColDef[] = [
    { field: 'modelName', headerName : 'Model Name', tooltipField: 'modelName'},
    { field: 'driveMotorKind', headerName : 'drive motor kind', tooltipField: 'driveMotorKind'},
    { field: 'maxSpeed', headerName : 'max speed', tooltipField: 'maxSpeed'},
    { field: 'pureElectricDistance', headerName : 'pure electric distance', tooltipField: 'pureElectricDistance'},
    { field: 'gearRatio', headerName : 'gear ratio', tooltipField: 'gearRatio'},
    { field: 'warningPreValue', headerName : 'warning pre value', tooltipField: 'warningPreValue'},
    { field: 'fuelType', headerName : 'fuel type', tooltipField: 'fuelType'},
    { field: 'fuelLabel', headerName : 'fuel label', tooltipField: 'fuelLabel'},
    { field: 'maxPower', headerName : 'max power', tooltipField: 'maxPower'},
    { field: 'maxTorque', headerName : 'max torque', tooltipField: 'maxTorque'},
    { field: 'batteryType', headerName : 'battery type', tooltipField: 'batteryType'},
    { field: 'batteryTotalEnergy', headerName: 'battery total energy', tooltipField: 'batteryTotalEnergy'},
    { field: 'batteryCoolingSystem', headerName: 'battery cooling system', tooltipField: 'batteryCoolingSystem' },
    { field: 'motorCoolingSystem', headerName : 'motor cooling system', tooltipField: 'motorCoolingSystem'},
    { field: 'ratedVoltage', headerName : 'rated voltage', tooltipField: 'ratedVoltage'},
    { field: 'motorMaxCurrent', headerName : 'motor max current', tooltipField: 'motorMaxCurrent'},
    { field: 'motorType', headerName : 'motor type', tooltipField: 'motorType'},
    { field: 'motorPeakPower', headerName : 'motor peak power', tooltipField: 'motorPeakPower'},
    { field: 'motorMaxSpeed', headerName : 'motor max speed', tooltipField: 'motorMaxSpeed'},
    { field: 'motorPeakTorque', headerName : 'motor peak torque', tooltipField: 'motorPeakTorque'},
    { field: 'motorMaxTorque', headerName : 'motor max torque', tooltipField: 'motorMaxTorque'},
    { field: 'powerRatio', headerName : 'Power Ratio', tooltipField: 'powerRatio'},
  ];

  model : any = {
    count : 0,
    modelList : []
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
    this.gridHeight = this.vehicleModelGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getVehiclemanagerModel()
  }

  onResize(event : any){
    if(this.gridHeight != this.vehicleModelGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }


  getVehiclemanagerModel(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.vehiclemanagersService.getVehiclemanagerModel(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.model = res.body

      let pagination = {
        count : this.model.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)
    },error=>{
      console.log(error)
    })
  }

  addVehicleModel(){
    const dialogRef = this.dialog.open( AddVehicleModelComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.postVehiclemanagerModel(result)
      }
    });
  }

  postVehiclemanagerModel(parameter : any){
    this.vehiclemanagersService.postVehiclemanagerModel(parameter).subscribe(res=>{
      console.log(res)
      this.getVehiclemanagerModel()
    },error=>{
      console.log(error)
    })
  }

  modifyVehicleModel(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddVehicleModelComponent, {
        data:{
          type : this.constant.MODIFY_TYPE,
          vehicleModel : this.gridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.putVehiclemanagerModelModelName(result)
        }
      });
    }
  }

  putVehiclemanagerModelModelName(parameter : any){
    this.vehiclemanagersService.putVehiclemanagerModelModelName(parameter).subscribe(res=>{
      console.log(res)
      this.getVehiclemanagerModel()
    },error=>{
      console.log(error)
    })
  }


  deleteVehicle(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (Model Name: " + this.gridApi.getSelectedRows()[0].modelName+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteVehiclemanagerModelModelName(this.gridApi.getSelectedRows()[0].modelName)
        }
      });
    }
  }

  deleteVehiclemanagerModelModelName(modelName : string){
    this.vehiclemanagersService.deleteVehiclemanagerModelModelName(modelName).subscribe(res=>{
      console.log(res)
      this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.vehiclemanagersService.getVehiclemanagerModel(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("Vehicle Model",this.gridApi,res.body.modelList)
    },error=>{
      console.log(error)
    })
  }
}
