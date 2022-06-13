import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddVehicleComponent } from 'src/app/component/add-vehicle/add-vehicle.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
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
  ) { }

  columnDefs: ColDef[] = [
    { field: 'iccid', headerName: 'ICCID' },
    { field: 'vehicle_number', headerName: 'Vehicle Number'},
    { field: 'batterycode', headerName : 'BATTERYCODE'},
  ];

  rowData = [
      {
      iccid: 'iccid',
      vehicle_number: 'vehicle_number',
      batterycode: 'batterycode'
    },
    {
      iccid: 'iccid',
      vehicle_number: 'vehicle_number',
      batterycode: 'batterycode'
    },
    {
      iccid: 'iccid',
      vehicle_number: 'vehicle_number',
      batterycode: 'batterycode'
    }
  ];

  gridApi!: GridApi;
  public rowSelection = 'multiple';
  ngOnInit(): void {

  }

  addVehicle(){
    const dialogRef = this.dialog.open( AddVehicleComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  modifyVehicle(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddVehicleComponent, {
        data:{
          type : this.constant.MODIFY_TYPE,
          user : this.gridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        }
      });
    }
  }

  deleteVehicle(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (ICCID : " + this.gridApi.getSelectedRows()[0].iccid+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;

        }
      });
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }
}
