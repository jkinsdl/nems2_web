import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddPublicPlatformManagementComponent } from 'src/app/component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from 'src/app/component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-public-platform-management',
  templateUrl: './public-platform-management.component.html',
  styleUrls: ['./public-platform-management.component.css']
})
export class PublicPlatformManagementComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private forwardingService : ForwardingService,
    private utilService : UtilService
  ) { }

  forwardingColumnDefs: ColDef[] = [
    { field: 'serverName', headerName : 'name', tooltipField: 'serverName'},
    { field: 'domain', headerName : 'IP', tooltipField: 'domain'},
    { field: 'port', headerName : 'port', tooltipField: 'port'},
    { field: 'platformId', headerName : 'platform ID', tooltipField: 'platformId'},
    { field: 'lastLogin', headerName : 'last login', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastLogin', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastLogin' }},
    { field: 'lastLogout', headerName : 'last logout', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastLogout', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastLogout' }},
    { field: '', headerName : 'start/stop', tooltipField: ''},
    { field: 'noAck', headerName : 'no Ack Mode', tooltipField: 'noAck'},
    { field: 'forceLoginVehicle', headerName : 'force vehcile login', tooltipField: 'forceLoginVehicle'},
    { field: 'filterLocationInfo', headerName : 'filter location info', tooltipField: 'filterLocationInfo'},
    { field: '', headerName : 'discards old data', tooltipField: ''},
    { field: 'encryptionMode', headerName : 'encryption Mode', tooltipField: 'encryptionMode'},
    { field: 'encryptionKey', headerName : 'encryption Key', tooltipField: 'encryptionKey'},
    { field: '', headerName : 'enterprise code', tooltipField: ''},

    { field: 'command', headerName : 'command', tooltipField: 'command'},
    { field: 'connectionStatus', headerName : 'connectionStatus', tooltipField: 'connectionStatus'},
    { field: 'platformPw', headerName : 'platformPw', tooltipField: 'platformPw'},
    //{ field: 'serverId', headerName : 'serverId', tooltipField: 'serverId'},

  ];

  forwarding : any = {
    count : 0,
    entities : []
  }


  relationsColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin' },
    { field: 'synctime', headerName: 'Last sync(packet time)', tooltipField: 'synctime'}
  ];

  relations : any = {
    count : 0,
    entities : []
  }

  managementGridApi!: GridApi;
  mappingGridApi!: GridApi;

  searchFilter : SearchFilter = new SearchFilter()

  selectForwardingServerName : string = null

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

  onServerGridReady(params: GridReadyEvent) {
    this.managementGridApi = params.api;
  }

  onForwardingRowClick(event : any ){
    console.log(event)
    this.selectForwardingServerName = event.data.serverName
    this.getForwardingServerNameRelations(this.selectForwardingServerName)
  }

  getForwardingServerNameRelations(serverName : string){
    this.forwardingService.getForwardingServerNameRelations(serverName, new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.relations = res.body
    },error=>{
      console.log(error)
    })
  }

  onMappingGridReady(params: GridReadyEvent) {
    this.mappingGridApi = params.api;
    this.mappingGridApi.sizeColumnsToFit()
  }

  addManagement(){
    const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.postForwarding(result)
      }
    });
  }

  postForwarding(parameter : any){
    this.forwardingService.postForwarding(parameter).subscribe(res=>{
      console.log(res)
      this.getForwarding()
    },error=>{
      console.log(error)
    })
  }

  modifyManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddPublicPlatformManagementComponent, {
        data:{
          type:this.constant.MODIFY_TYPE,
          forwarding : this.managementGridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.putForwardingServerName(result)
        }
      });
    }
  }

  putForwardingServerName(parameter : any){
    this.forwardingService.putForwardingServerName(parameter).subscribe(res=>{
      console.log(res)
      this.getForwarding()
    },error=>{
      console.log(error)
    })
  }

  deleteManagement(){
    if(this.managementGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the data ? (Server Name : " + this.managementGridApi.getSelectedRows()[0].serverName+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteForwardingServerName(this.managementGridApi.getSelectedRows()[0].serverName)
        }
      });
    }
  }

  deleteForwardingServerName(serverName : string){
    this.forwardingService.deleteForwardingServerName(serverName).subscribe(res=>{
      console.log(res)

      if(serverName == this.selectForwardingServerName){
        this.selectForwardingServerName = null
        this.relations = {
          count : 0,
          entities : []
        }
      }

      this.managementGridApi.applyTransaction({ remove: this.managementGridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  addMapping(){
    const dialogRef = this.dialog.open( AddPublicPlatformMappingComponent, {
      data:{
        type:this.constant.ADD_TYPE,
        serverName : this.selectForwardingServerName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result)
        let parameter : any = {
          vin : [result]
        }
        this.postForwardingServerNameRelations(parameter)
      }
    });
  }

  postForwardingServerNameRelations(parameter : any){
    this.forwardingService.postForwardingServerNameRelations(this.selectForwardingServerName,parameter).subscribe(res=>{
      console.log(res)
      this.getForwardingServerNameRelations(this.selectForwardingServerName)
    },error=>{
      console.log(error)
    })
  }

  modifyMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddPublicPlatformMappingComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){}
      });
    }
  }

  deleteMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Vehicle",
          alertContents : "Do you want to delete the mapping ? (VIN : " + this.mappingGridApi.getSelectedRows()[0].vin+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteForwardingServerNameRelations(this.mappingGridApi.getSelectedRows()[0].vin);
        }
      });
    }
  }

  deleteForwardingServerNameRelations(vin : string){

    let filter = new SearchFilter()
    filter.vin = vin

    this.forwardingService.deleteForwardingServerNameRelations(this.selectForwardingServerName,filter).subscribe(res=>{
      console.log(res)
      this.mappingGridApi.applyTransaction({ remove: this.mappingGridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  onBtExport(type : string) {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    if(type == "management"){
      this.utilService.gridDataToExcelData("public platform management forwarding", this.managementGridApi ,this.forwarding.entities)
    }else{
      this.utilService.gridDataToExcelData("public platform management relations", this.mappingGridApi,this.relations.entities)
    }
  }

}
