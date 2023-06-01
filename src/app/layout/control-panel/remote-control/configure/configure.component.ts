import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { MatDialog } from '@angular/material/dialog';
import { AddRemoteParameterConfigurationInfoComponent } from 'src/app/component/add-remote-parameter-configuration-info/add-remote-parameter-configuration-info.component';
import { AddRegisterRemoteSettingComponent } from 'src/app/component/add-register-remote-setting/add-register-remote-setting.component';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  translationFile : string = ""

  @ViewChild('configure1', { read: ElementRef }) configure1 : ElementRef;

  @ViewChild('configure2', { read: ElementRef }) configure2 : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private devicemanagerService : DevicemanagerService,
    private utilService : UtilService,
    private uiService : UiService,

    private translate: TranslateService,
    private http: HttpClient
  ) { }

  configurationColumnDefs: ColDef[] = [
    { field: 'configureName', headerName: 'Configure Name', tooltipField: 'configureName', width:150 },
    { field: 'carLocalSavePeriod', headerName : 'Car Local Save Period (ms)', tooltipField: 'carLocalSavePeriod', minWidth:220},
    { field: 'normalSubmitPeriod', headerName : 'Normal Submit Period (sec)', tooltipField: 'normalSubmitPeriod', minWidth:220},
    { field: 'warningSubmitPeriod', headerName : 'Warning Submit Period (ms)', tooltipField: 'warningSubmitPeriod', minWidth:250},
    { field: 'managePlatformName', headerName : 'Manage Platform Name', tooltipField: 'managePlatformName'},
    { field: 'managePlatformPort', headerName : 'Manage Platform Port', tooltipField: 'managePlatformPort'},
    { field: 'hwVersion', headerName : 'Hardware Version(sw)', tooltipField: 'hwVersion'},
    { field: 'fwVersion', headerName : 'Firmware Version', tooltipField: 'fwVersion', width:180 },
    { field: 'carHeartBeatPeriod', headerName: 'Car Heart Beat Period (sec)', tooltipField: 'carHeartBeatPeriod', minWidth:220},
    { field: 'carResponseTimeout', headerName : 'Car Response Timeout (sec)', tooltipField: 'carResponseTimeout', minWidth:250},
    { field: 'platformResponseTimeout', headerName : 'Platform Response Timeout (sec)', tooltipField: 'platformResponseTimeout', minWidth:280},
    { field: 'nextLoginInterval', headerName : 'Next Login Interval (sec)', tooltipField: 'nextLoginInterval'},
    { field: 'publicPlatformName', headerName : 'Public Platform Name', tooltipField: 'publicPlatformName'},
    { field: 'publicPlatformPort', headerName : 'Public Platform Port', tooltipField: 'publicPlatformPort'},
    { field: 'monitoring', headerName : 'Monitoring', tooltipField: 'monitoring', width:150 },
    //{ field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt' }},
    //{ field: 'updatedUserId', headerName : 'updated User Id', tooltipField: 'updatedUserId'},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyConfigure(field)
      },
      delete : (field: any) => {
        this.deleteConfigure(field)
      },
    }, width:120},
  ];

  mappingColumnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin'},
    { field: 'matched', headerName : 'Matched', tooltipField: 'matched'},
    { field: 'matched_date', headerName : 'Matched Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'matched_date', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'matched_date', type : 'date' }},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      onlyRemove : true,
      delete : (field: any) => {
        this.deleteMapping(field)
      },
    }, width:120},
  ];

  configureGridApi!: GridApi;
  mappingGridApi!: GridApi;

  devicemanagersParameter : any ={
    count : 0,
    entities : [],
    link : {}
  }

  selectConfigureRow : any = null

  devicemanagersParameterVehicle : any ={
    count : 0,
    entities : [],
    link : {}
  }

  page$ : Subscription
  page2$ : Subscription
  grid1Height : number
  grid2Height : number
  pageSize : number
  pageSize2 : number
  currentPage : number = 1
  currentPage2 : number = 1

  selectConfigureName : string = ""


  ngAfterViewInit() {
    this.getPageSize()
    this.grid2Height = this.configure2.nativeElement.offsetHeight
    this.pageSize2 = this.uiService.getGridPageSize(this.grid2Height)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
    if(this.page2$)this.page2$.unsubscribe()
  }

  ngOnInit(): void {
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
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getDevicemanagersParameter()
    })

    this.page2$ = this.uiService.page2$.subscribe((page : number)=>{
      this.currentPage2 = page
      this.getDevicemanagersParametersConfigureNameVehicles()
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
          this.configurationColumnDefs = [
            { field: 'configureName', headerName: 'Configure Name', tooltipField: 'configureName', width:150 },
            { field: 'carLocalSavePeriod', headerName : 'Car Local Save Period (ms)', tooltipField: 'carLocalSavePeriod', minWidth:220},
            { field: 'normalSubmitPeriod', headerName : 'Normal Submit Period (sec)', tooltipField: 'normalSubmitPeriod', minWidth:220},
            { field: 'warningSubmitPeriod', headerName : 'Warning Submit Period (ms)', tooltipField: 'warningSubmitPeriod', minWidth:250},
            { field: 'managePlatformName', headerName : 'Manage Platform Name', tooltipField: 'managePlatformName'},
            { field: 'managePlatformPort', headerName : 'Manage Platform Port', tooltipField: 'managePlatformPort'},
            { field: 'hwVersion', headerName : 'Hardware Version(sw)', tooltipField: 'hwVersion'},
            { field: 'fwVersion', headerName : 'Firmware Version', tooltipField: 'fwVersion', width:180 },
            { field: 'carHeartBeatPeriod', headerName: 'Car Heart Beat Period (sec)', tooltipField: 'carHeartBeatPeriod', minWidth:220},
            { field: 'carResponseTimeout', headerName : 'Car Response Timeout (sec)', tooltipField: 'carResponseTimeout', minWidth:250},
            { field: 'platformResponseTimeout', headerName : 'Platform Response Timeout (sec)', tooltipField: 'platformResponseTimeout', minWidth:280},
            { field: 'nextLoginInterval', headerName : 'Next Login Interval (sec)', tooltipField: 'nextLoginInterval'},
            { field: 'publicPlatformName', headerName : 'Public Platform Name', tooltipField: 'publicPlatformName'},
            { field: 'publicPlatformPort', headerName : 'Public Platform Port', tooltipField: 'publicPlatformPort'},
            { field: 'monitoring', headerName : 'Monitoring', tooltipField: 'monitoring', width:150 },
            //{ field: 'updatedAt', headerName : 'updatedAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt' }},
            //{ field: 'updatedUserId', headerName : 'updated User Id', tooltipField: 'updatedUserId'},
            { field: 'action', cellRenderer: BtnCellRendererComponent,
            cellRendererParams: {
              modify: (field: any) => {
                this.modifyConfigure(field)
              },
              delete : (field: any) => {
                this.deleteConfigure(field)
              },
            }, width:120},
          ];
        
          this.mappingColumnDefs = [
            { field: 'vin', headerName: 'VIN', tooltipField: 'vin'},
            { field: 'matched', headerName : 'Matched', tooltipField: 'matched'},
            { field: 'matched_date', headerName : 'Matched Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'matched_date', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'matched_date', type : 'date' }},
            { field: 'action', cellRenderer: BtnCellRendererComponent,
            cellRendererParams: {
              onlyRemove : true,
              delete : (field: any) => {
                this.deleteMapping(field)
              },
            }, width:120},
          ];
        
         
          if (this.configureGridApi) {
            this.configureGridApi.setColumnDefs(this.configurationColumnDefs);
            this.configureGridApi.refreshHeader();
          }
          console.log("Table are translating", this.configurationColumnDefs);
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
   this.translate.use(language).subscribe(() => {
     // Translation changed successfully
     this.translateColumnHeaders();
   });
 }

  getPageSize(){
    this.grid1Height = this.configure1.nativeElement.offsetHeight;
    if(this.uiService.getGridPageSize(this.grid1Height) != this.pageSize){
      this.pageSize = this.uiService.getGridPageSize(this.grid1Height)
      this.getDevicemanagersParameter()
    }

    this.grid2Height = this.configure2.nativeElement.offsetHeight
    if(this.selectConfigureRow != null && this.uiService.getGridPageSize(this.grid2Height) != this.pageSize2){
      this.pageSize2 = this.uiService.getGridPageSize(this.grid2Height)
      this.getDevicemanagersParametersConfigureNameVehicles()
    }
  }

  onResize(event : any){
    if(this.grid1Height != this.configure1.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.configure1.nativeElement.offsetWidth > 3240){
      this.configureGridApi.sizeColumnsToFit()
    }
    this.mappingGridApi.sizeColumnsToFit()
  }

  getDevicemanagersParameter(){

    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize

    this.devicemanagerService.getDevicemanagersParameter(f).subscribe(res=>{
      console.log(res)
      this.devicemanagersParameter = res.body

      let pagination = {
        count : this.devicemanagersParameter.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
    })
  }

  onServerGridReady(params: GridReadyEvent) {
    this.configureGridApi = params.api;
    if(this.configure1.nativeElement.offsetWidth > 3240){
      this.configureGridApi.sizeColumnsToFit()
    }
  }

  onMappingGridReady(params: GridReadyEvent) {
    this.mappingGridApi = params.api;
    this.mappingGridApi.sizeColumnsToFit()
  }

  addVehicle(){
    if(this.selectConfigureRow){
      const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
        data:{
          type:this.constant.ADD_TYPE,
          configureName : this.selectConfigureRow.configureName
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){
          this.getDevicemanagersParametersConfigureNameVehicles()
        }
      });
    }
  }

  modifyMapping(){
    if(this.mappingGridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddRemoteParameterConfigurationInfoComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result){

        }
      });
    }
  }



  deleteMapping(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the mapping ? (VIN : " + field.vin+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.mappingGridApi.applyTransaction({ remove: this.mappingGridApi.getSelectedRows() })!;
      }
    });

  }

  addConfigure(){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getDevicemanagersParameter()
      }
    });
  }

  modifyConfigure(field: any){
    const dialogRef = this.dialog.open( AddRegisterRemoteSettingComponent, {
      data:{
        type:this.constant.MODIFY_TYPE,
        configure : field
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getDevicemanagersParameter()
      }
    });
  }

  deleteConfigure(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (name : " + field.configureName+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.deleteDevicemanagersParametersConfigureName(field.configureName)
      }
    });
  }

  deleteDevicemanagersParametersConfigureName(configureName : string){
    this.devicemanagerService.deleteDevicemanagersParametersConfigureName(configureName).subscribe(res=>{
      console.log(res)
      this.utilService.alertPopup("Configure","configure has been removed.",this.constant.ADD_TYPE)
      this.selectConfigureRow = null
      this.getDevicemanagersParameter()
    },error=>{
      console.log(error)
    })
  }

  onConfigureRowClicked(event : any ){
    console.log(event.data)
    this.selectConfigureRow = event.data
    this.getDevicemanagersParametersConfigureNameVehicles()
  }

  getDevicemanagersParametersConfigureNameVehicles(){
    this.devicemanagerService.getDevicemanagersParametersConfigureNameVehicles(this.selectConfigureRow.configureName, new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.devicemanagersParameterVehicle = res.body
      let pagination = {
        count : this.devicemanagersParameterVehicle.count,
        pageSize : this.pageSize2,
        page : this.currentPage2
      }

      this.uiService.setPagination2(pagination)
    },error=>{
      console.log(error)
    })
  }


  onBtExport(type : string) {
    if(type == "configure"){
      this.devicemanagerService.getDevicemanagersParameter(new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("Configure", this.configureGridApi ,res.body.entities)
      },error=>{
        console.log(error)
      })
    }else{
      this.devicemanagerService.getDevicemanagersParametersConfigureNameVehicles(this.selectConfigureRow.configureName, new SearchFilter()).subscribe(res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("Configure Vehicle", this.mappingGridApi,res.body.entities)
      },error=>{
        console.log(error)
      })
    }
  }

}
