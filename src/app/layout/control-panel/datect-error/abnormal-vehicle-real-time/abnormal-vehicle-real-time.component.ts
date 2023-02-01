import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';

@Component({
  selector: 'app-abnormal-vehicle-real-time',
  templateUrl: './abnormal-vehicle-real-time.component.html',
  styleUrls: ['./abnormal-vehicle-real-time.component.css']
})
export class AbnormalVehicleRealTimeComponent implements OnInit {

  constructor(
    private vehiclewarningService : VehiclewarningService,) { }

  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'server_time', headerName: 'Server Time'},
    { field: 'packet_time', headerName : 'Packet Time'},
    { field: 'state', headerName : 'State'},
    { field: 'value', headerName : 'Value'},
    { field: 'data', headerName : 'Data'},
  ];

  rowData = [
    {
        vin: 'vin',
        server_time: 'server_time',
        packet_time: 'packet_time',
        state: 'state',
        value: 'value',
        data: 'data',
    },
    {
      vin: 'vin',
      server_time: 'server_time',
      packet_time: 'packet_time',
      state: 'state',
      value: 'value',
      data: 'data',
  },
  {
    vin: 'vin',
    server_time: 'server_time',
    packet_time: 'packet_time',
    state: 'state',
    value: 'value',
    data: 'data',
  }];

  gridApi!: GridApi;
  selectNodeID : string = null;
  rowSelection = 'multiple';

  startDate : any
  endDate :any
  ngOnInit(): void {
    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());

    this.getVehiclewarning()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  getVehiclewarning(){
    this.vehiclewarningService.getVehiclewarning(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

}
