import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-offline-vehicle-history',
  templateUrl: './offline-vehicle-history.component.html',
  styleUrls: ['./offline-vehicle-history.component.css']
})
export class OfflineVehicleHistoryComponent implements OnInit {

  constructor(
    private utilService : UtilService
  ) { }


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

  startDate : any
  endDate :any

  ngOnInit(): void {
    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("offline vehicle history", this.gridApi ,this.rowData)
  }

}
