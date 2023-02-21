import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.css']
})
export class ServerLogsComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private gbpacketService : GbpacketService,
    private utilService : UtilService
  ) { }
  columnDefs: ColDef[] = [
    { field: 'data', headerName: 'data', tooltipField: 'data', },
    { field: 'encryption', headerName: 'encryption', tooltipField: 'encryption'},
    { field: 'flaged', headerName : 'flaged', tooltipField: 'flaged'},
    { field: 'packetTime', headerName : 'packetTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime' }},
    { field: 'request', headerName : 'request', tooltipField: 'request'},
    { field: 'response', headerName : 'response', tooltipField: 'response'},
    { field: 'responsePacket', headerName : 'responsePacket', tooltipField: 'responsePacket'},
    { field: 'serverTime', headerName : 'serverTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime' }},
    { field: 'type', headerName : 'type', tooltipField: 'type'},
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
  ];

  gridApi!: GridApi;
  selectNodeID : string = null;

  beginDate : Date = null
  endDate : Date = null

  searchFilter : SearchFilter = new SearchFilter()

  gbpacket : any ={
    count : 0,
    entities : [],
    link : {}
  }

  loginFilter : boolean = false
  logoutFilter : boolean = false
  realTimeFilter : boolean = false
  addtionaFilter : boolean = false
  etcFilter : boolean = false
  customFilter : boolean = false

  ngOnInit(): void {
    this.endDate = new Date()
    this.beginDate = new Date()
    this.beginDate.setDate(this.endDate.getDate() - 30)
    this.getGbpacket()

  }

  getGbpacket(){
    this.searchFilter.request = []

    if(this.loginFilter){
      this.searchFilter.request.push("LOGIN")
    }

    if(this.logoutFilter){
      this.searchFilter.request.push("LOGOUT")
    }

    if(this.realTimeFilter){
      this.searchFilter.request.push("REALTIME")
    }

    if(this.addtionaFilter){
      this.searchFilter.request.push("ADDITIONAL")
    }

    if(this.etcFilter){
      this.searchFilter.request.push("ETC")
    }

    if(this.customFilter){
      this.searchFilter.request.push("CUSTOM")
    }

    this.searchFilter.begin = this.beginDate.toISOString()
    this.searchFilter.end = this.endDate.toISOString()

    this.gbpacketService.getGbpacket(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.gbpacket = res.body
    },error=>{
      console.log(error)
    })
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("Server Log", this.gridApi ,this.gbpacket.entities)
  }

}
