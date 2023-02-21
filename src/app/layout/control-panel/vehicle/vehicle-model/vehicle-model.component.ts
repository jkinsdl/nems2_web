import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { AddVehicleModelComponent } from 'src/app/component/add-vehicle-model/add-vehicle-model.component';
@Component({
  selector: 'app-vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.css']
})
export class VehicleModelComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
    private vehiclemanagersService : VehiclemanagerService
  ) { }

  columnDefs: ColDef[] = [
    { field: 'batteryCoolingSystem', headerName: 'batteryCoolingSystem', tooltipField: 'batteryCoolingSystem' },
    { field: 'batteryTotalEnergy', headerName: 'batteryTotalEnergy', tooltipField: 'batteryTotalEnergy'},
    { field: 'batteryType', headerName : 'batteryType', tooltipField: 'batteryType'},
    { field: 'driveMotorKind', headerName : 'driveMotorKind', tooltipField: 'driveMotorKind'},
    { field: 'fuelLabel', headerName : 'fuelLabel', tooltipField: 'fuelLabel'},
    { field: 'fuelType', headerName : 'fuelType', tooltipField: 'fuelType'},
    { field: 'gearRatio', headerName : 'gearRatio', tooltipField: 'gearRatio'},
    { field: 'maxPower', headerName : 'maxPower', tooltipField: 'maxPower'},
    { field: 'maxSpeed', headerName : 'maxSpeed', tooltipField: 'maxSpeed'},
    { field: 'maxTorque', headerName : 'maxTorque', tooltipField: 'maxTorque'},
    { field: 'modelName', headerName : 'modelName', tooltipField: 'modelName'},
    { field: 'motorCoolingSystem', headerName : 'motorCoolingSystem', tooltipField: 'motorCoolingSystem'},
    { field: 'motorMaxCurrent', headerName : 'motorMaxCurrent', tooltipField: 'motorMaxCurrent'},
    { field: 'motorMaxSpeed', headerName : 'motorMaxSpeed', tooltipField: 'motorMaxSpeed'},
    { field: 'motorMaxTorque', headerName : 'motorMaxTorque', tooltipField: 'motorMaxTorque'},
    { field: 'motorPeakPower', headerName : 'motorPeakPower', tooltipField: 'motorPeakPower'},
    { field: 'motorPeakTorque', headerName : 'motorPeakTorque', tooltipField: 'motorPeakTorque'},
    { field: 'motorType', headerName : 'motorType', tooltipField: 'motorType'},
    { field: 'powerRatio', headerName : 'powerRatio', tooltipField: 'powerRatio'},
    { field: 'pureElectricDistance', headerName : 'pureElectricDistance', tooltipField: 'pureElectricDistance'},
    { field: 'ratedVoltage', headerName : 'ratedVoltage', tooltipField: 'ratedVoltage'},
    { field: 'warningPreValue', headerName : 'warningPreValue', tooltipField: 'warningPreValue'}
  ];

  modelList : any[] = []

  gridApi!: GridApi;

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.getVehiclemanagerModel()
  }

  getVehiclemanagerModel(){
    this.vehiclemanagersService.getVehiclemanagerModel(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.modelList = res.body.modelList
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

}
