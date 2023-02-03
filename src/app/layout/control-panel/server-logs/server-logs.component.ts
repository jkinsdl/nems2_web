import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.css']
})
export class ServerLogsComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private gbpacketService : GbpacketService
  ) { }
  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN' },
    { field: 'server_time', headerName: 'Server Time'},
    { field: 'packet_time', headerName : 'Packet Time'},
    { field: 'request', headerName : 'Request'},
    { field: 'response', headerName : 'Response'},
    { field: 'data', headerName : 'Data'},
  ];

  rowData = [
    {
        vin: 'vin',
        server_time: 'server_time',
        packet_time: 'packet_time',
        request: 'request',
        response: 'response',
        data: 'data',
    },
    {
      vin: 'vin',
      server_time: 'server_time',
      packet_time: 'packet_time',
      request: 'request',
      response: 'response',
      data: 'data',
  },
  {
    vin: 'vin',
    server_time: 'server_time',
    packet_time: 'packet_time',
    request: 'request',
    response: 'response',
    data: 'data',
  }];

  gridApi!: GridApi;
  selectNodeID : string = null;
  public rowSelection = 'multiple';

  datePicker : any
  ngOnInit(): void {
    this.datePicker = new Date()
    this.getGbpacketInvalidpacket()
    this.getGbpacketPacket()
    this.getForwardingId()

  }

  getGbpacketInvalidpacket(){
    this.gbpacketService.getGbpacketInvalidpacket(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getGbpacketPacket(){
    this.gbpacketService.getGbpacketPacket(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getForwardingId(){
    this.gbpacketService.getForwardingId(new SearchFilter(), "").subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

}
