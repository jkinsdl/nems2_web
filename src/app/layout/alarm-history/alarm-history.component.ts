import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';

@Component({
  selector: 'app-alarm-history',
  templateUrl: './alarm-history.component.html',
  styleUrls: ['./alarm-history.component.css']
})
export class AlarmHistoryComponent implements OnInit {

  constructor(
    private vehiclewarningService : VehiclewarningService
  ) { }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field:"checkBox",
      cellClass: 'cell-wrap-text',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 10
    },
    { field: 'warningLevel',headerName: "warningLevel"},
    { field: 'vin',headerName: "vin"},
    { field: 'warningCode',headerName: "warningCode"},
    { field: 'createTime',headerName: "createTime"},
    { field: 'updateTime',headerName: "updateTime"},
    { field: 'state',headerName: "state"},
    { field: 'maxWarning',headerName: "maxWarning"},
    { field: 'warningFlag',headerName: "warningFlag"},
    { field: 'region',headerName: "region"},
    { field: 'comment',headerName: "comment"},
  ];

  gridApi!: GridApi;
  gridColumnApi : any

  startDatePicker : any
  endDatePicker : any

  searchFilter : SearchFilter = new SearchFilter()

  vehiclewarning : any = {
    totalCount : 0,
    warnings : []
  }

  ngOnInit(): void {
    this.getVehiclewarnings()
  }

  getVehiclewarnings(){
    this.vehiclewarningService.getVehiclewarnings(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehiclewarning = res.body
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

}
