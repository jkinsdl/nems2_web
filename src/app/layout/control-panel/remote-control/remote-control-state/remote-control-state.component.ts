import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
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
    { field: 'vin', headerName: 'VIN' },
    { field: 'carHeartBeatPeriod', headerName: 'carHeartBeatPeriod'},
    { field: 'carLocalSavePeriod', headerName : 'carLocalSavePeriod'},
    { field: 'carResponseTimeout', headerName : 'carResponseTimeout'},
    { field: 'configureName', headerName : 'configureName'},
    { field: 'configureFwVersion', headerName : 'configureFwVersion'},
    { field: 'configureHwVersion', headerName : 'configureHwVersion'},
    { field: 'managePlatformName', headerName : 'managePlatformName'},
    { field: 'managePlatformPort', headerName : 'managePlatformPort'},
    { field: 'monitoring', headerName : 'monitoring'},
    { field: 'nextLoginInterval', headerName : 'nextLoginInterval'},
    { field: 'platformResponseTimeout', headerName : 'platformResponseTimeout'},
    { field: 'publicPlatformName', headerName : 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'publicPlatformPort'},
    { field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat},
    { field: 'updatedUserId', headerName : 'updatedUserId'},
    { field: 'dataFilePath', headerName : 'dataFilePath'},
    { field: 'dataSize', headerName : 'dataSize'},
    { field: 'firmwareName', headerName : 'firmwareName'},
    { field: 'firmwareInfoFwVersion', headerName : 'firmwareInfoFwVersion'},
    { field: 'firmwareInfoHwVersion', headerName : 'firmwareInfoHwVersion'},
    { field: 'md5Hash', headerName : 'md5Hash'},
    { field: 'modelName', headerName : 'modelName'}
  ];

  gridApi!: GridApi;
  rowSelection = 'multiple';

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

}
