import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import mapboxgl from 'mapbox-gl';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

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

  vehiclewarning : any = {
    totalCount : 0,
    warnings : []
  }

  rowSelection = 'multiple';
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
    this.gridApi.sizeColumnsToFit();
  }

}
