import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
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
    private vehiclemanagerService : VehiclemanagerService,
    private utilService : UtilService
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
