import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-otainformation',
  templateUrl: './otainformation.component.html',
  styleUrls: ['./otainformation.component.css']
})
export class OTAInformationComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  constructor(
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
    { field: 'pcode', headerName : 'pcode'}
  ];

  vehicleList : any[] = []

  private gridApi!: GridApi;
  selectNodeID : string = null;
  public rowSelection = 'multiple';

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.getVehiclemanagerStaticinfo()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getVehiclemanagerStaticinfo(){
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehicleList = res.body.vehicleList
    },error=>{
      console.log(error)
    })
  }

}
