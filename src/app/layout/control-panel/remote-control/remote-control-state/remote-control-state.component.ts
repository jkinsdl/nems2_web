import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-remote-control-state',
  templateUrl: './remote-control-state.component.html',
  styleUrls: ['./remote-control-state.component.css']
})
export class RemoteControlStateComponent implements OnInit {

  constructor(
    private devicemanagersService : DevicemanagerService,
    private utilService : UtilService
  ) { }

  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin' },
    { field: 'carHeartBeatPeriod', headerName: 'carHeartBeatPeriod', tooltipField: 'carHeartBeatPeriod'},
    { field: 'carLocalSavePeriod', headerName : 'carLocalSavePeriod', tooltipField: 'carLocalSavePeriod'},
    { field: 'carResponseTimeout', headerName : 'carResponseTimeout', tooltipField: 'carResponseTimeout'},
    { field: 'configureName', headerName : 'configureName', tooltipField: 'configureName'},
    { field: 'configureFwVersion', headerName : 'configureFwVersion', tooltipField: 'configureFwVersion'},
    { field: 'configureHwVersion', headerName : 'configureHwVersion', tooltipField: 'configureHwVersion'},
    { field: 'managePlatformName', headerName : 'managePlatformName', tooltipField: 'managePlatformName'},
    { field: 'managePlatformPort', headerName : 'managePlatformPort', tooltipField: 'managePlatformPort'},
    { field: 'monitoring', headerName : 'monitoring', tooltipField: 'monitoring'},
    { field: 'nextLoginInterval', headerName : 'nextLoginInterval', tooltipField: 'nextLoginInterval'},
    { field: 'platformResponseTimeout', headerName : 'platformResponseTimeout', tooltipField: 'platformResponseTimeout'},
    { field: 'publicPlatformName', headerName : 'publicPlatformName', tooltipField: 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'publicPlatformPort', tooltipField: 'publicPlatformPort'},
    { field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt' }},
    { field: 'updatedUserId', headerName : 'updatedUserId', tooltipField: 'updatedUserId'},
    { field: 'dataFilePath', headerName : 'dataFilePath', tooltipField: 'dataFilePath'},
    { field: 'dataSize', headerName : 'dataSize', tooltipField: 'dataSize'},
    { field: 'firmwareName', headerName : 'firmwareName', tooltipField: 'firmwareName'},
    { field: 'firmwareInfoFwVersion', headerName : 'firmwareInfoFwVersion', tooltipField: 'firmwareInfoFwVersion'},
    { field: 'firmwareInfoHwVersion', headerName : 'firmwareInfoHwVersion', tooltipField: 'firmwareInfoHwVersion'},
    { field: 'md5Hash', headerName : 'md5Hash', tooltipField: 'md5Hash'},
    { field: 'modelName', headerName : 'modelName', tooltipField: 'modelName'}
  ];

  gridApi!: GridApi;

  devicemanagersVehicles : any ={
    count : 0,
    entities : [],
    link : {}
  }

  rowData : any[] = [];

  searchFilter : SearchFilter = new SearchFilter()

  currentUser : any = {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user'))
    this.getDevicemanagersVehicles()
  }

  getDevicemanagersVehicles(){
    this.devicemanagersService.getDevicemanagersVehicles(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.devicemanagersVehicles = res.body
      this.rowData = []
      for(let i = 0; i < res.body.entities.length; i++) {
        this.rowData.push({
          vin : res.body.entities[i].vin,
          carHeartBeatPeriod : res.body.entities[i].configure.carHeartBeatPeriod,
          carLocalSavePeriod : res.body.entities[i].configure.carLocalSavePeriod,
          carResponseTimeout : res.body.entities[i].configure.carResponseTimeout,
          configureName : res.body.entities[i].configure.configureName,
          configureFwVersion : res.body.entities[i].configure.fwVersion,
          configureHwVersion : res.body.entities[i].configure.hwVersion,
          managePlatformName : res.body.entities[i].configure.managePlatformName,
          managePlatformPort : res.body.entities[i].configure.managePlatformPort,
          monitoring : res.body.entities[i].configure.monitoring,
          nextLoginInterval : res.body.entities[i].configure.nextLoginInterval,
          platformResponseTimeout : res.body.entities[i].configure.platformResponseTimeout,
          publicPlatformName : res.body.entities[i].configure.publicPlatformName,
          publicPlatformPort : res.body.entities[i].configure.publicPlatformPort,
          updatedAt : res.body.entities[i].configure.updatedAt,
          updatedUserId : res.body.entities[i].configure.updatedUserId,
          warningSubmitPeriod : res.body.entities[i].configure.warningSubmitPeriod,
          createdAt : res.body.entities[i].firmwareInfo.createdAt,
          createdUserId : res.body.entities[i].firmwareInfo.createdUserId,
          dataFilePath : res.body.entities[i].firmwareInfo.dataFilePath,
          dataSize : res.body.entities[i].firmwareInfo.dataSize,
          firmwareName : res.body.entities[i].firmwareInfo.firmwareName,
          firmwareInfoFwVersion : res.body.entities[i].firmwareInfo.fwVersion,
          firmwareInfoHwVersion : res.body.entities[i].firmwareInfo.hwVersion,
          md5Hash : res.body.entities[i].firmwareInfo.md5Hash,
          modelName : res.body.entities[i].firmwareInfo.modelName,
        })
      }

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
    this.utilService.gridDataToExcelData("Remote Control", this.gridApi,this.rowData)
  }


}
