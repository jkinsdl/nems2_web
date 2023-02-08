import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';

@Component({
  selector: 'app-data-forwarding',
  templateUrl: './data-forwarding.component.html',
  styleUrls: ['./data-forwarding.component.css']
})
export class DataForwardingComponent implements OnInit {

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field:"checkBox",
      cellClass: 'cell-wrap-text',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 10
    },
    { field: 'command', headerName : 'command'},
    { field: 'connectionStatus', headerName : 'connectionStatus'},
    { field: 'domain', headerName : 'domain'},
    { field: 'encryptionKey', headerName : 'encryptionKey'},
    { field: 'encryptionMode', headerName : 'encryptionMode'},
    { field: 'filterLocationInfo', headerName : 'filterLocationInfo'},
    { field: 'forceLoginVehicle', headerName : 'forceLoginVehicle'},
    { field: 'noAck', headerName : 'noAck'},
    { field: 'platformId', headerName : 'platformId'},
    { field: 'platformPw', headerName : 'platformPw'},
    { field: 'port', headerName : 'port'},
    { field: 'serverId', headerName : 'serverId'},
    { field: 'serverName', headerName : 'serverName'}
  ];

  forwarding : any = {
    count : 0,
    entities : []
  }

    rowSelection = 'multiple';
    gridApi!: GridApi;
    gridColumnApi : any
    startDatePicker : any
    endDatePicker : any

  constructor(
    private forwardingService : ForwardingService
  ) { }

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.getForwarding()
  }

  getForwarding(){
    this.forwardingService.getForwarding(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.forwarding = res.body
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
