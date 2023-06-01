import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddVehicleComponent } from 'src/app/component/add-vehicle/add-vehicle.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-settings',
  templateUrl: './vehicle-settings.component.html',
  styleUrls: ['./vehicle-settings.component.css']
})
export class VehicleSettingsComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  translationFile : string = ""

  @ViewChild('vehicleSettingsGrid', { read: ElementRef }) vehicleSettingsGrid : ElementRef;
  @ViewChild('uploadExcel', { read: ElementRef }) uploadExcel : ElementRef;
  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private vehiclemanagerService : VehiclemanagerService,
    private utilService : UtilService,
    private uiService : UiService,
    private translate: TranslateService,
    private http: HttpClient

  ) { }

  columnDefs: ColDef[] = [
    { field: 'iccid', headerName : 'iccid', tooltipField: 'iccid'},
    { field: 'vin', headerName : 'VIN', tooltipField: 'vin'},
    { field: 'nemsSn', headerName : 'NEMS S/N', tooltipField: 'nemsSn'},
    { field: 'registDate', headerName : 'Regist Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'registDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'registDate', type : 'date' }, width:180},
    { field: 'sOffDate', headerName : 'S Off Date', valueFormatter : this.utilService.dateFormatDate, tooltipField: 'sOffDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'sOffDate', type : 'date' }, width:120},
    { field: 'region', headerName : 'region', tooltipField: 'region', width:150},
    { field: 'registrationPlate', headerName : 'Reg. number', tooltipField: 'registrationPlate', width:150},
    { field: 'purpose', headerName : 'Purpose', tooltipField: 'purpose', width:150},
    { field: 'modelName', headerName : 'model', tooltipField: 'modelName', width:100},
    { field: 'batteryCode', headerName: 'battery code', tooltipField: 'batteryCode', width:150},
    { field: 'motorNo', headerName : 'motor no', tooltipField: 'motorNo'},
    { field: 'engineNo', headerName: 'engine no', tooltipField: 'engineNo'},
    { field: 'histories', headerName: 'histories', tooltipField: 'histories'},
    //{ field: 'registrationPlate', headerName : 'registrationPlate', tooltipField: 'registrationPlate'},
    //{ field: 'pcode', headerName : 'pcode', tooltipField: 'pcode'}
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyVehicle(field)
      },
      delete : (field: any) => {
        this.deleteVehicle(field)
      },
    }, width:120},
  ];

  vehicle : any = {
    count : 0,
    vehicleList : []
  }

  gridApi!: GridApi;

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  filter : string = "VIN"
  searchText : string = ""

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
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
      this.getVehiclemanagerStaticinfo()
    })
  }

  translateColumnHeaders(): void {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'iccid', 'VIN', 'NEMS S/N', 'Regist Date', 'S Off Date', 'region', 'Reg. number',  'Purpose', 'battery code', 'motor no', 'engine no', 'histories', 'action' ]).subscribe((translations: any) => {

          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.columnDefs = [
            { field: 'iccid', headerName : translations['iccid'], tooltipField: 'iccid'},
            { field: 'vin', headerName : translations['VIN'], tooltipField: 'vin'},
            { field: 'nemsSn', headerName : translations['NEMS S/N'], tooltipField: 'nemsSn'},
            { field: 'registDate', headerName :translations ['Regist Date'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'registDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'registDate', type : 'date' }, width:180},
            { field: 'sOffDate', headerName : translations['S Off Date'], valueFormatter : this.utilService.dateFormatDate, tooltipField: 'sOffDate', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'sOffDate', type : 'date' }, width:120},
            { field: 'region', headerName : translations['region'], tooltipField: 'region', width:150},
            { field: 'registrationPlate', headerName :translations['Reg. number'], tooltipField: 'registrationPlate', width:150},
            { field: 'purpose', headerName :translations ['Purpose'], tooltipField: 'purpose', width:150},
            { field: 'modelName', headerName : translations ['model'], tooltipField: 'modelName', width:100},
            { field: 'batteryCode', headerName:translations ['battery code'], tooltipField: 'batteryCode', width:150},
            { field: 'motorNo', headerName :translations ['motor no'], tooltipField: 'motorNo'},
            { field: 'engineNo', headerName: translations['engine no'], tooltipField: 'engineNo'},
            { field: 'histories', headerName: translations['histories'], tooltipField: 'histories'},
            //{ field: 'registrationPlate', headerName : 'registrationPlate', tooltipField: 'registrationPlate'},
            //{ field: 'pcode', headerName : 'pcode', tooltipField: 'pcode'}
            { field: translations['action'], cellRenderer: BtnCellRendererComponent,
            cellRendererParams: {
              modify: (field: any) => {
                this.modifyVehicle(field)
              },
              delete : (field: any) => {
                this.deleteVehicle(field)
              },
            }, width:120},
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
    localStorage.setItem('selectedLanguage', language);
    this.translate.use(language).subscribe(() => {
       // Translation changed successfully
      this.translateColumnHeaders();
    });
  } 

  getPageSize(){
    this.gridHeight = this.vehicleSettingsGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getVehiclemanagerStaticinfo()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.vehicleSettingsGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.vehicleSettingsGrid.nativeElement.offsetWidth > 2420){
      this.gridApi.sizeColumnsToFit()
    }
  }

  getVehiclemanagerStaticinfo(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehicle = res.body
      let pagination = {
        count : this.vehicle.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)
    },error=>{
      console.log(error)
    })
  }

  addVehicle(){
    const dialogRef = this.dialog.open( AddVehicleComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.sOffDate){
        this.getVehiclemanagerStaticinfo()
      }
    });
  }

  modifyVehicle(field: any){
    const dialogRef = this.dialog.open( AddVehicleComponent, {
      data:{
        type : this.constant.MODIFY_TYPE,
        vehicle : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getVehiclemanagerStaticinfo()
      }
    });
  }


  deleteVehicle(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Vehicle",
        alertContents : "Do you want to delete the data ? (VIN : " + field.vin+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteVehiclemanagerStaticinfoVin(field.vin)
      }
    });
  }

  deleteVehiclemanagerStaticinfoVin(vin:string){
    this.vehiclemanagerService.deleteVehiclemanagerStaticinfoVin(vin).subscribe(res=>{
      console.log(res)
      this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
    },error=>{
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if(this.vehicleSettingsGrid.nativeElement.offsetWidth > 2420){
      this.gridApi.sizeColumnsToFit()
    }
  }

  async onBtnImport(event : any){
    console.log(event.target.files)
    let base64 = await this.utilService.getBase64(event.target.files[0])

    let parameter = {
      contents : base64
    }

    this.vehiclemanagerService.postVehiclemanagerVehicleinfoImport(parameter).subscribe(res=>{
      console.log(res)
      this.uploadExcel.nativeElement.value = "";
      this.utilService.alertPopup("Vehicle Settings",
      `Imported Number : ${res.body.importedNum} \n
      Request Number : ${res.body.requestNum}`, this.constant.ALERT_CONFIRMATION)
    },error=>{
      console.log(error)
      this.uploadExcel.nativeElement.value = "";
      this.utilService.alertPopup("Vehicle Settings", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
    })
  }

  onBtExport(){

    this.vehiclemanagerService.getVehiclemanagerVehicleinfoExport(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.exportDownload('vehicle_static_info.zip',res.body[0].data)
    },error=>{
      console.log(error)
    })

    /*this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined

    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      this.utilService.gridDataToExcelData("Vehicle Settings",this.gridApi,res.body.vehicleList)
    },error=>{
      console.log(error)
    })
    */
  }

  setSearch(){

    if(this.searchText != ""){
      if(this.filter == 'VIN'){
        this.searchFilter.vin = this.searchText
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'iccid'){
        this.searchFilter.iccid = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'NEMS S/N'){
        this.searchFilter.nemsSn = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'Reg. number'){
        this.searchFilter.registrationPlate = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'region'){
        this.searchFilter.region = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.pcode = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'pcode'){
        this.searchFilter.pcode = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.modelName = undefined
      }else if(this.filter == 'modelName'){
        this.searchFilter.modelName = this.searchText
        this.searchFilter.vin = undefined
        this.searchFilter.iccid = undefined
        this.searchFilter.nemsSn = undefined
        this.searchFilter.registrationPlate = undefined
        this.searchFilter.region = undefined
        this.searchFilter.pcode = undefined
      }
    }else{
      this.searchFilter.vin = undefined
      this.searchFilter.iccid = undefined
      this.searchFilter.nemsSn = undefined
      this.searchFilter.registrationPlate = undefined
      this.searchFilter.region = undefined
      this.searchFilter.pcode = undefined
      this.searchFilter.modelName = undefined
    }

    this.uiService.setCurrentPage(1);
  }
}
