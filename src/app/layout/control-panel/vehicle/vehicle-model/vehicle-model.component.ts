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
import {Router} from '@angular/router';
import { UiService } from 'src/app/service/ui.service';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
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
    private uiService : UiService,
    private router: Router
  ) { }

  columnDefs: ColDef[] = [
    { field: 'modelName', headerName : 'Model Name', tooltipField: 'modelName', width:150},
    { field: 'driveMotorKind', headerName : 'drive motor kind', tooltipField: 'driveMotorKind', width:150},
    { field: 'maxSpeed', headerName : 'max speed', tooltipField: 'maxSpeed', width:120},
    { field: 'pureElectricDistance', headerName : 'pure electric distance', tooltipField: 'pureElectricDistance', width:180},
    { field: 'gearRatio', headerName : 'gear ratio', tooltipField: 'gearRatio', width:120},
    { field: 'warningPreValue', headerName : 'warning pre value', tooltipField: 'warningPreValue', width:160},
    { field: 'fuelType', headerName : 'fuel type', tooltipField: 'fuelType', width:120},
    { field: 'fuelLabel', headerName : 'fuel label', tooltipField: 'fuelLabel', width:120},
    { field: 'maxPower', headerName : 'max power', tooltipField: 'maxPower', width:120},
    { field: 'maxTorque', headerName : 'max torque', tooltipField: 'maxTorque', width:120},
    { field: 'batteryType', headerName : 'battery type', tooltipField: 'batteryType', width:120},
    { field: 'batteryTotalEnergy', headerName: 'battery total energy', tooltipField: 'batteryTotalEnergy', width:180},
    { field: 'batteryCoolingSystem', headerName: 'battery cooling system', tooltipField: 'batteryCoolingSystem' },
    { field: 'motorCoolingSystem', headerName : 'motor cooling system', tooltipField: 'motorCoolingSystem'},
    { field: 'ratedVoltage', headerName : 'rated voltage', tooltipField: 'ratedVoltage', width:150},
    { field: 'motorMaxCurrent', headerName : 'motor max current', tooltipField: 'motorMaxCurrent', width:180},
    { field: 'motorType', headerName : 'motor type', tooltipField: 'motorType', width:120},
    { field: 'motorPeakPower', headerName : 'motor peak power', tooltipField: 'motorPeakPower', width:180},
    { field: 'motorMaxSpeed', headerName : 'motor max speed', tooltipField: 'motorMaxSpeed', width:180},
    { field: 'motorPeakTorque', headerName : 'motor peak torque', tooltipField: 'motorPeakTorque', width:180},
    { field: 'motorMaxTorque', headerName : 'motor max torque', tooltipField: 'motorMaxTorque', width:180},
    { field: 'powerRatio', headerName : 'Power Ratio', tooltipField: 'powerRatio', width:150},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyVehicleModel(field)
      },
      delete : (field: any) => {
        this.deleteVehicle(field)
      },
    }, width:120},
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
      this.getVehiclemanagerModel()
    })
  }

  getPageSize(){
    this.gridHeight = this.vehicleModelGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getVehiclemanagerModel()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.vehicleModelGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.vehicleModelGrid.nativeElement.offsetWidth > 3500){
      this.gridApi.sizeColumnsToFit()
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
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
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
        this.getVehiclemanagerModel()
      }
    });
  }


  modifyVehicleModel(field: any){
    const dialogRef = this.dialog.open( AddVehicleModelComponent, {
      data:{
        type : this.constant.MODIFY_TYPE,
        vehicleModel : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getVehiclemanagerModel()
      }
    });
  }

  deleteVehicle(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (Model Name: " + field.modelName+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteVehiclemanagerModelModelName(field.modelName)
      }
    });
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
    if(this.vehicleModelGrid.nativeElement.offsetWidth > 3500){
      this.gridApi.sizeColumnsToFit()
    }
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
