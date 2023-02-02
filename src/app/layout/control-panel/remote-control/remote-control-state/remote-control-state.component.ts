import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-remote-control-state',
  templateUrl: './remote-control-state.component.html',
  styleUrls: ['./remote-control-state.component.css']
})
export class RemoteControlStateComponent implements OnInit {

  constructor() { }

  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'date', headerName: 'date'},
    { field: 'state', headerName : 'state'},
    { field: 'car_local_save_cycle', headerName : 'car local save cycle(ms)'},
    { field: 'normal_transmission_cycle', headerName : 'normal transmission cycle (sec)'},
    { field: 'warning_transmission_cycle', headerName : 'warning transmission cycle (ms)'},
    { field: 'manage_platform_name', headerName : 'manage platform name'},
    { field: 'manage_platform_port', headerName : 'manage platform port'},
    { field: 'hardware_version', headerName : 'hardware Version(sw)'},
    { field: 'firmware_version', headerName : 'firmware Version'},
    { field: 'car_heartbeat_cycle', headerName : 'car heartBeat cycle (sec)'},
    { field: 'car_response_timeout', headerName : 'car response timeout (sec)'},
    { field: 'platform_response_timeout', headerName : 'platform response timeout (sec)'},
    { field: 'next_login_interval', headerName : 'next login interval (sec)'},
    { field: 'public_platform_name', headerName : 'public platform port'},
    { field: 'monitoring', headerName : 'monitoring'},
  ];

  rowData = [
    {
      vin: 'vin',
      date: 'date',
      state: 'state',
      car_local_save_cycle: 'car_local_save_cycle',
      normal_transmission_cycle: 'normal_transmission_cycle',
      warning_transmission_cycle: 'warning_transmission_cycle',

      manage_platform_name: 'manage_platform_name',
      manage_platform_port: 'manage_platform_port',
      hardware_version: 'hardware_version',
      firmware_version: 'firmware_version',
      car_heartbeat_cycle: 'car_heartbeat_cycle',
      car_response_timeout: 'car_response_timeout',
      platform_response_timeout: 'platform_response_timeout',
      next_login_interval: 'next_login_interval',
      public_platform_name: 'public_platform_name',
      monitoring: 'monitoring',
    }];

  gridApi!: GridApi;
  rowSelection = 'multiple';

  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

}
