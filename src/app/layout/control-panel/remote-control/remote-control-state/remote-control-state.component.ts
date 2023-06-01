import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-remote-control-state',
  templateUrl: './remote-control-state.component.html',
  styleUrls: ['./remote-control-state.component.css']
})
export class RemoteControlStateComponent implements OnInit {
  selectedLanguage: string; 
  translationFile : string = ""

  @ViewChild('remoteControlStateGrid', { read: ElementRef }) remoteControlStateGrid : ElementRef;

  constructor(
    private devicemanagersService : DevicemanagerService,
    private utilService : UtilService,
    private uiService: UiService,

    private translate: TranslateService,
    private http: HttpClient
  ) { }


  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin',width:180 },
    { field: 'updatedAt', headerName : 'Updated At', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt', type : 'date' }},

    { field: 'vehicleStaticInfo', headerName : 'Vehicle Static Info', tooltipField: 'vehicleStaticInfo',width:180},

    { field: 'carLocalSavePeriod', headerName : 'Car Local Save Period', tooltipField: 'carLocalSavePeriod',width:180},
    { field: 'normalSubmitPeriod', headerName : 'Normal Submit Period', tooltipField: 'normalSubmitPeriod',width:200},
    { field: 'warningSubmitPeriod', headerName : 'Warning Submit Period', tooltipField: 'warningSubmitPeriod',width:200},
    { field: 'managePlatformName', headerName : 'Manage Platform Name', tooltipField: 'managePlatformName',width:200},
    { field: 'managePlatformPort', headerName : 'Manage Platform Port', tooltipField: 'managePlatformPort',width:200},
    { field: 'hwVersion', headerName : 'Hardware Version', tooltipField: 'hwVersion',width:180},
    { field: 'fwVersion', headerName : 'Firmware Version', tooltipField: 'fwVersion',width:180},
    { field: 'carHeartBeatPeriod', headerName: 'Car Heart Beat Period', tooltipField: 'carHeartBeatPeriod',width:180},
    { field: 'carResponseTimeout', headerName : 'Car Response Timeout', tooltipField: 'carResponseTimeout',width:200},
    { field: 'platformResponseTimeout', headerName : 'Platform Response Timeout', tooltipField: 'platformResponseTimeout',width:240},
    { field: 'nextLoginInterval', headerName : 'Next Login Interval', tooltipField: 'nextLoginInterval',width:180},
    { field: 'publicPlatformName', headerName : 'Public Platform Name', tooltipField: 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'Public Platform Port', tooltipField: 'publicPlatformPort',width:180},
    { field: 'monitoring', headerName : 'Monitoring', tooltipField: 'monitoring',width:120},
    { field: 'packetTime', headerName : 'Packet Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }},
  ];

  /*columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin',width:180 },
    { field: 'updatedAt', headerName : 'Updated At', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt', type : 'date' }},
    //state
    { field: 'carLocalSavePeriod', headerName : 'Car Local Save Period', tooltipField: 'carLocalSavePeriod',width:180},
    { field: 'normalSubmitPeriod', headerName : 'Normal Submit Period', tooltipField: 'normalSubmitPeriod',width:200},
    { field: 'warningSubmitPeriod', headerName : 'Warning Submit Period', tooltipField: 'warningSubmitPeriod',width:200},
    { field: 'managePlatformName', headerName : 'Manage Platform Name', tooltipField: 'managePlatformName',width:200},
    { field: 'managePlatformPort', headerName : 'Manage Platform Port', tooltipField: 'managePlatformPort',width:200},
    { field: 'configureHwVersion', headerName : 'Hardware Version', tooltipField: 'configureHwVersion',width:180},
    { field: 'configureFwVersion', headerName : 'Firmware Version', tooltipField: 'configureFwVersion',width:180},
    { field: 'carHeartBeatPeriod', headerName: 'Car Heart Beat Period', tooltipField: 'carHeartBeatPeriod',width:180},
    { field: 'carResponseTimeout', headerName : 'Car Response Timeout', tooltipField: 'carResponseTimeout',width:200},
    { field: 'platformResponseTimeout', headerName : 'Platform Response Timeout', tooltipField: 'platformResponseTimeout',width:240},
    { field: 'nextLoginInterval', headerName : 'Next Login Interval', tooltipField: 'nextLoginInterval',width:180},
    { field: 'publicPlatformName', headerName : 'Public Platform Name', tooltipField: 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'Public Platform Port', tooltipField: 'publicPlatformPort',width:180},
    { field: 'monitoring', headerName : 'Monitoring', tooltipField: 'monitoring',width:120},


    //{ field: 'configureName', headerName : 'configureName', tooltipField: 'configureName',width:150},
    //{ field: 'firmwareInfoHwVersion', headerName : 'Firmware Info Hw Version', tooltipField: 'firmwareInfoHwVersion', width:220},
    //{ field: 'firmwareInfoFwVersion', headerName : 'Firmware Info Fw Version', tooltipField: 'firmwareInfoFwVersion', width:220},
    //{ field: 'updatedUserId', headerName : 'updatedUserId', tooltipField: 'updatedUserId',width:120},
    //{ field: 'dataFilePath', headerName : 'dataFilePath', tooltipField: 'dataFilePath'},
    //{ field: 'dataSize', headerName : 'dataSize', tooltipField: 'dataSize',width:120},
    //{ field: 'firmwareName', headerName : 'firmwareName', tooltipField: 'firmwareName',width:150},
    //{ field: 'md5Hash', headerName : 'md5Hash', tooltipField: 'md5Hash'},
    //{ field: 'modelName', headerName : 'modelName', tooltipField: 'modelName',width:120}
  ];*/

  gridApi!: GridApi;

  devicemanagersVehicles : any ={
    count : 0,
    entities : [],
    link : {}
  }

  rowData : any[] = [];
  currentUser : any = {}

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
  }

  ngOnInit(): void {
    // this.fetchData();
    console.log('currentUser.authorityId:', this.currentUser.authorityId);
    this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    //this.selectedLanguage = 'en'; // Set the default language
    this.translate.setDefaultLang('en'); // Set the default language
  
    // Load the translation file for the selected language
    this.translationFile = `../assets/i18n/dashboard/${this.selectedLanguage}.json`;

    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translateColumnHeaders();
        // this.getUsers(); 
      });
    });
    this.uiService.currentLanguage$.subscribe((language : string)=>{
      console.log(language)
      this.selectedLanguage = language
      this.translationFile = `../assets/i18n/dashboard/${this.selectedLanguage}.json`;

      if(this.selectedLanguage == 'en'){
        console.log("영어")
      }else {
        console.log("중문")
      }
      this.translate.use(this.selectedLanguage).subscribe(() => {
        this. translateColumnHeaders();
        // this.getUsers(); // Load the table content after setting the translations
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
      });
    });
    this.currentUser = JSON.parse(localStorage.getItem('user'))

    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      //this.getDevicemanagersVehicles()
      this.getDevicemanagersVehiclesParametervalues();
    })
  }

  translateColumnHeaders(): void {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'VIN', 'Updated At', 'Vehicle Static Info', 'Car Local Save Period', 'Normal Submit Period', 'Warning Submit Period', 'Manage Platform Name', 'Manage Platform Port', 'Hardware Version', 'Firmware Version', 'Car Heart Beat Period', 'Car Response Timeout', 'Platform Response Timeout', 'Next Login Interval', 'Public Platform Name',  'Public Platform Port', 'Monitoring', 'Packet Time']).subscribe((translations: any) => {;
          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.columnDefs = [
            { field: 'vin', headerName: translations['VIN'], tooltipField: 'vin',width:180 },
            { field: 'updatedAt', headerName : translations['Updated At'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt', type : 'date' }},
        
            { field: 'vehicleStaticInfo', headerName : translations['Vehicle Static Info'], tooltipField: 'vehicleStaticInfo',width:180},
        
            { field: 'carLocalSavePeriod', headerName : translations['Car Local Save Period'], tooltipField: 'carLocalSavePeriod',width:180},
            { field: 'normalSubmitPeriod', headerName : translations['Normal Submit Period'], tooltipField: 'normalSubmitPeriod',width:200},
            { field: 'warningSubmitPeriod', headerName : translations['Warning Submit Period'], tooltipField: 'warningSubmitPeriod',width:200},
            { field: 'managePlatformName', headerName : translations['Manage Platform Name'], tooltipField: 'managePlatformName',width:200},
            { field: 'managePlatformPort', headerName : translations['Manage Platform Port'], tooltipField: 'managePlatformPort',width:200},
            { field: 'hwVersion', headerName : translations['Hardware Version'], tooltipField: 'hwVersion',width:180},
            { field: 'fwVersion', headerName : translations['Firmware Version'], tooltipField: 'fwVersion',width:180},
            { field: 'carHeartBeatPeriod', headerName: translations['Car Heart Beat Period'], tooltipField: 'carHeartBeatPeriod',width:180},
            { field: 'carResponseTimeout', headerName : translations['Car Response Timeout'], tooltipField: 'carResponseTimeout',width:200},
            { field: 'platformResponseTimeout', headerName : translations['Platform Response Timeout'], tooltipField: 'platformResponseTimeout',width:240},
            { field: 'nextLoginInterval', headerName : translations['Next Login Interval'], tooltipField: 'nextLoginInterval',width:180},
            { field: 'publicPlatformName', headerName : translations['Public Platform Name'], tooltipField: 'publicPlatformName'},
            { field: 'publicPlatformPort', headerName : translations['Public Platform Port'], tooltipField: 'publicPlatformPort',width:180},
            { field: 'monitoring', headerName : translations['Monitoring'], tooltipField: 'monitoring',width:120},
            { field: 'packetTime', headerName : translations['Packet Time'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }},
          ];
         
          if (this.gridApi) {
            this.gridApi.setColumnDefs(this.columnDefs);
            this.gridApi.refreshHeader();
          }
          console.log("Table are translating", this.columnDefs);
        });
      });
    });

   }

  
   //MINE//
   isDropdownOpen = false;

   toggleDropdown():void{
     this.isDropdownOpen = !this.isDropdownOpen;
   }
 
  //  changeLanguage(language:string): void{
  //    this.language = language;
  //  } 
 
  onLanguageChange(event: any) {
   const language = event.target.value;
   this.uiService.setCurrentLanguage(language)
   localStorage.setItem('selectedLanguage',language);
   this.translate.use(language).subscribe(() => {
     // Translation changed successfully
     this.translateColumnHeaders();
   });
 }

  getPageSize(){
    this.gridHeight = this.remoteControlStateGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      //this.getDevicemanagersVehicles()
      this.getDevicemanagersVehiclesParametervalues()
    }

  }

  onResize(event : any){
    if(this.gridHeight != this.remoteControlStateGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.remoteControlStateGrid.nativeElement.offsetWidth > 3020){
      this.gridApi.sizeColumnsToFit()
    }

  }


  getDevicemanagersVehiclesParametervalues(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.devicemanagersService.getDevicemanagersVehiclesParametervalues(this.searchFilter).subscribe(res=>{
      console.log("Data is here:",res)
      this.devicemanagersVehicles = res.body
      let pagination = {
        count : this.devicemanagersVehicles.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)
    },error=>{
      console.log(error)
    })
  }

  fetchData() {
    this.getDevicemanagersVehicles(); // Call the function
  }

  getDevicemanagersVehicles(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.devicemanagersService.getDevicemanagersVehicles(this.searchFilter).subscribe(res=>{
      console.log("This data",res)
      this.devicemanagersVehicles = res.body
      this.rowData = [];
      for(let i = 0; i < res.body.entities.length; i++) {
        this.rowData.push({
          vin : res.body.entities[i].vin,
          carHeartBeatPeriod : res.body.entities[i].configure ? res.body.entities[i].configure.carHeartBeatPeriod : null,
          carLocalSavePeriod : res.body.entities[i].configure ? res.body.entities[i].configure.carLocalSavePeriod : null,
          carResponseTimeout : res.body.entities[i].configure ? res.body.entities[i].configure.carResponseTimeout : null,
          configureName : res.body.entities[i].configure ? res.body.entities[i].configure.configureName : null,
          configureFwVersion : res.body.entities[i].configure ? res.body.entities[i].configure.fwVersion : null,
          configureHwVersion : res.body.entities[i].configure ? res.body.entities[i].configure.hwVersion : null,
          managePlatformName : res.body.entities[i].configure ? res.body.entities[i].configure.managePlatformName : null,
          managePlatformPort : res.body.entities[i].configure ? res.body.entities[i].configure.managePlatformPort : null,
          monitoring : res.body.entities[i].configure ? res.body.entities[i].configure.monitoring : null,
          nextLoginInterval : res.body.entities[i].configure ? res.body.entities[i].configure.nextLoginInterval : null,
          normalSubmitPeriod : res.body.entities[i].configure ? res.body.entities[i].configure.normalSubmitPeriod : null,
          platformResponseTimeout : res.body.entities[i].configure ? res.body.entities[i].configure.platformResponseTimeout : null,
          publicPlatformName : res.body.entities[i].configure ? res.body.entities[i].configure.publicPlatformName : null,
          publicPlatformPort : res.body.entities[i].configure ? res.body.entities[i].configure.publicPlatformPort : null,
          updatedAt : res.body.entities[i].configure ? res.body.entities[i].configure.updatedAt : null,
          updatedUserId : res.body.entities[i].configure ? res.body.entities[i].configure.updatedUserId : null,
          warningSubmitPeriod : res.body.entities[i].configure ? res.body.entities[i].configure.warningSubmitPeriod : null,
          createdAt : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.createdAt : null,
          createdUserId : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.createdUserId : null,
          dataFilePath : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.dataFilePath : null,
          dataSize : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.dataSize : null,
          firmwareName : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.firmwareName : null,
          firmwareInfoFwVersion : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.fwVersion : null,
          firmwareInfoHwVersion : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.hwVersion : null,
          md5Hash : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.md5Hash : null,
          modelName : res.body.entities[i].firmwareInfo ? res.body.entities[i].firmwareInfo.modelName : null,
        })
      }
      // this.rowData = [...this.rowData];

      let pagination = {
        count : this.devicemanagersVehicles.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if(this.remoteControlStateGrid.nativeElement.offsetWidth > 3020){
      this.gridApi.sizeColumnsToFit()
    }
  }

  onBtExport() {
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.devicemanagersService.getDevicemanagersVehicles(this.searchFilter).subscribe(res=>{
      console.log(res)
      let excelRowData = []
      for(let i = 0; i < res.body.entities.length; i++) {
        excelRowData.push({
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
      this.utilService.gridDataToExcelData("Remote Control", this.gridApi,excelRowData)
    },error=>{
      console.log(error)
    })
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }
}
