import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-otainformation',
  templateUrl: './otainformation.component.html',
  styleUrls: ['./otainformation.component.css']
})
export class OTAInformationComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  constructor() { }
  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'need_ota', headerName: 'need OTA'},
    { field: 'aaa', headerName : '한자'},
    { field: 'last_ota_start_time', headerName : 'last OTA start time'},
    { field: 'last_response_time', headerName : 'last response time'},
    { field: 'firmware', headerName : 'firmware(MD5)'},
    { field: 'firmware_name', headerName : 'firmware Name'},
  ];

  rowData = [
    {
      vin: 'vin',
      need_ota: 'need_ota',
      aaa: 'aaa',
      last_ota_start_time: 'last_ota_start_time',
      last_response_time: 'last_response_time',
      firmware: 'firmware',
      firmware_name: 'firmware_name',
    },
    {
      vin: 'vin',
      need_ota: 'need_ota',
      aaa: 'aaa',
      last_ota_start_time: 'last_ota_start_time',
      last_response_time: 'last_response_time',
      firmware: 'firmware',
      firmware_name: 'firmware_name',
    },
    {
      vin: 'vin',
      need_ota: 'need_ota',
      aaa: 'aaa',
      last_ota_start_time: 'last_ota_start_time',
      last_response_time: 'last_response_time',
      firmware: 'firmware',
      firmware_name: 'firmware_name',
    }];

  private gridApi!: GridApi;
  selectNodeID : string = null;
  public rowSelection = 'multiple';
  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

}
