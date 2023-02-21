import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import mapboxgl from 'mapbox-gl';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

  constructor(
    private vehiclewarningService : VehiclewarningService,
    private utilService : UtilService
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
    { field: 'warningLevel',headerName: "warningLevel", tooltipField: 'warningLevel'},
    { field: 'vin',headerName: "vin", tooltipField: 'vin'},
    { field: 'warningCode',headerName: "warningCode", tooltipField: 'warningCode'},
    { field: 'code',headerName: "code", tooltipField: 'code'},
    { field: 'createTime',headerName: "createTime", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'createTime' }},
    { field: 'lastPacketTime',headerName: "lastPacketTime", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastPacketTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastPacketTime' }},
    { field: 'releasedTime',headerName: "releasedTime", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'releasedTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'releasedTime' }},
    { field: 'state',headerName: "state", tooltipField: 'state'},
    { field: 'maxWarning',headerName: "maxWarning", tooltipField: 'maxWarning'},
    { field: 'warningFlag',headerName: "warningFlag", tooltipField: 'warningFlag'},
    { field: 'region',headerName: "region", tooltipField: 'region'},
    { field: 'comment',headerName: "comment", tooltipField: 'comment'},
  ];

  vehiclewarning : any = {
    totalCount : 0,
    warnings : []
  }

  gridApi!: GridApi;
  gridColumnApi : any

  frameworkComponents : any

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 35.8617;
  lng = 104.1954;

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 4,
        center: [this.lng, this.lat]
      });
      this.map.addControl(new mapboxgl.NavigationControl());
    },1)
    this.getVehiclewarning()
  }

  getVehiclewarning(){
    this.vehiclewarningService.getVehiclewarning(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehiclewarning = res.body
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("Alarm", this.gridApi ,this.vehiclewarning.warnings)
  }
}
