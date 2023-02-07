import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddVehicleComponent } from 'src/app/component/add-vehicle/add-vehicle.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-vehicle-settings',
  templateUrl: './vehicle-settings.component.html',
  styleUrls: ['./vehicle-settings.component.css']
})
export class VehicleSettingsComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
    private vehiclemanagerService : VehiclemanagerService
  ) { }

  columnDefs: ColDef[] = [
    { field: 'batteryCode', headerName: 'batteryCode' },
    { field: 'engineNo', headerName: 'engineNo'},
    { field: 'iccid', headerName : 'iccid'},
    { field: 'modelName', headerName : 'modelName'},
    { field: 'motorNo', headerName : 'motorNo'},
    { field: 'nemsSn', headerName : 'nemsSn'},
    { field: 'purpose', headerName : 'purpose'},
    { field: 'region', headerName : 'region'},
    { field: 'registDate', headerName : 'registDate'},
    { field: 'registrationPlate', headerName : 'registrationPlate'},
    { field: 'sOffDate', headerName : 'sOffDate'},
    { field: 'vin', headerName : 'vin'},
    { field: 'zipCode', headerName : 'zipCode'}
  ];

  vehicleList : any[] = []

  gridApi!: GridApi;
  public rowSelection = 'multiple';

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.getVehiclemanagerStaticinfo()
  }

  getVehiclemanagerStaticinfo(){
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehicleList = res.body.vehicleList
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
      if(result){
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
    this.gridApi.sizeColumnsToFit()
  }
}