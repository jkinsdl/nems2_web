import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, ITooltipParams } from 'ag-grid-community';
import { OtaService } from 'src/app/service/ota.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOTAManagementComponent } from 'src/app/component/add-otamanagement/add-otamanagement.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otamanagement',
  templateUrl: './otamanagement.component.html',
  styleUrls: ['./otamanagement.component.css']
})
export class OTAManagementComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  translationFile : string = ""


  @ViewChild('otaManagementGrid', { read: ElementRef }) otaManagementGrid : ElementRef;
  @ViewChild('importFirmwareVehiclesInput', { read: ElementRef }) importFirmwareVehiclesInput : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private otaService : OtaService,
    private devicemanageService : DevicemanagerService,
    private dialog: MatDialog,
    private uiService : UiService,
    private utilService : UtilService,
    private router : Router,
    private vehiclemanagersService : VehiclemanagerService,

    private translate: TranslateService,
    private http: HttpClient
  ) { }

  gridApi!: GridApi;
  selectNodeID : string = null;

  startDate : any
  endDate :any

  firmwareVehiclesColumn: ColDef[] = [
    { field: 'vin', headerName: 'VIN',
    headerCheckboxSelection: true,
    checkboxSelection: true, tooltipField: 'vin', },
    { field: 'currentState', headerName: 'State', tooltipField: 'currentState'},
    { field: 'updatedAt', headerName : 'Update Date', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt', type : 'date' }}
  ];


  rowData : any[]= [];

  modelList : any = {
    modelList : [],
    count : 0
  }

  firmwareList : any = {
    count : 0,
    entities : [],
    link : {}
  }

  firmwareVehiclesList : any = {
    count : 0,
    entities : [],
    link : {}
  }

  selectFirmware : any = null;

  inputVinText : string = ""

  page$ : Subscription
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  selectModel : any

  searchVehicleList : any[] = []

  vinSearchListShow : boolean = false

  ngAfterViewInit() {
    this.getPageSize()
    this.gridHeight = this.otaManagementGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
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
    this.getVehiclemanagerModel()
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getDevicemanagersFirmwareFirmwareNameVehicles()
    })
  }

  translateColumnHeaders(): void {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'VIN', 'State', 'NEMS S/N', 'Update Date' ]).subscribe((translations: any) => {
          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.firmwareVehiclesColumn = [
            { field: 'vin', headerName: translations['VIN'],
            headerCheckboxSelection: true,
            checkboxSelection: true, tooltipField: 'vin', },
            { field: 'currentState', headerName: translations['State'], tooltipField: 'currentState'},
            { field: 'updatedAt', headerName : translations['Update Date'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'updatedAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'updatedAt', type : 'date' }}
          ];
          if (this.gridApi) {
            this.gridApi.setColumnDefs(this.firmwareVehiclesColumn );
            this.gridApi.refreshHeader();
          }
          console.log("Table are translating", this.firmwareVehiclesColumn );
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
    this.gridHeight = this.otaManagementGrid.nativeElement.offsetHeight;
    if(this.selectFirmware != null && this.pageSize != this.uiService.getGridPageSize(this.gridHeight)){
      this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
      this.getDevicemanagersFirmwareFirmwareNameVehicles()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.otaManagementGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    this.gridApi.sizeColumnsToFit()

  }

  getVehiclemanagerModel(){
    this.vehiclemanagersService.getVehiclemanagerModel(new SearchFilter).subscribe(res=>{
      console.log(res)
      this.modelList = res.body
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getDevicemanagersFirmware(){
    let f = new SearchFilter
    f.modelName = this.selectModel.modelName

    this.devicemanageService.getDevicemanagersFirmware(f).subscribe(res=>{
      console.log(res)

      /*for(let i = 0; i < this.modelList.modelList.length; i++){
        this.modelList.modelList[i].firmwareList = []
        for(let j = 0 ; j < res.body.entities.length; j++){
          if(this.modelList.modelList[i].modelName == res.body.entities[j].modelName){
            this.modelList.modelList[i].firmwareList.push(res.body.entities[j])
          }
        }
      }*/
      this.firmwareList = res.body
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getOtaFirmware(){
    this.otaService.getOtaFirmware().subscribe(res=>{
      console.log(res)
    },error=>{
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
      console.log(error)
    })
  }

  getOtaFirmwareFirmwareNo(firmwareNo : string){
    this.otaService.getOtaFirmwareFirmwareNo(firmwareNo).subscribe(res=>{
      console.log(res)
    },error=>{
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
      console.log(error)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  leftListAddModal(){
    const dialogRef = this.dialog.open( AddOTAManagementComponent, {
      data : {
        model : this.selectModel
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result)
        this.getDevicemanagersFirmware()
      }
    });
  }

  leftListRemove(){
    if(this.selectFirmware.firmwareName == undefined){
      return
    }
    if(this.firmwareVehiclesList.entities.length != 0 ){

      this.utilService.alertPopup("Unremovable Firmware", "If there is no vehicle using this firmware, it can be deleted",this.constant.ALERT_WARNING)

      return
    }


    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Firmware",
        alertContents :  "Are you sure to delete this Firmware?",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteDevicemanagersFirmwareFirmwareName()
      }
    });
  }

  rowOpen(item : any){
    console.log(item)
    this.inputVinText = ""
    if(this.selectFirmware == item){
      this.selectFirmware = null
      this.firmwareVehiclesList = {
        count : 0,
        entities : [],
        link : {}
      }
      let pagination = {
        count : 0,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)
    }else{
      this.selectFirmware = item
      this.getDevicemanagersFirmwareFirmwareNameVehicles()
    }
  }

  getDevicemanagersFirmwareFirmwareNameVehicles(){

    let f = new SearchFilter()
    f.offset = (this.currentPage-1) * this.pageSize
    f.limit = this.pageSize

    this.devicemanageService.getDevicemanagersFirmwareFirmwareNameVehicles(this.selectFirmware.firmwareName,f).subscribe(res=>{
      console.log(res)
      this.firmwareVehiclesList = res.body

      let pagination = {
        count : this.firmwareVehiclesList.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
      this.firmwareVehiclesList = []
    })
  }

  inputVinTextClose(){
    this.inputVinText = ""
  }

  postDevicemanagersFirmwareFirmwareNo(){
    let parameter = {
      vin : this.inputVinText
    }
    this.devicemanageService.postDevicemanagersFirmwareFirmwareNo(this.selectFirmware.firmwareName,parameter).subscribe(res=>{
      console.log(res)

      this.getDevicemanagersFirmwareFirmwareNameVehicles()

    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else{

      this.uiService.setAlertMessage("does not exist : " + this.inputVinText)
      }

    })
  }

  deleteDevicemanagersFirmwareFirmwareName(){
    this.devicemanageService.deleteDevicemanagersFirmwareFirmwareName(this.selectFirmware.firmwareName).subscribe(res=>{
      console.log(res)
      this.getDevicemanagersFirmware()
      this.selectFirmware = {}
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  deleteDevicemanagersFirmwareFirmwareNameVehiclesVin(){
    console.log(this.gridApi.getSelectedRows())

    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete OTA info",
        alertContents : "Do you want to delete the data?  (Number of info : " + this.gridApi.getSelectedRows().length+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let checkRowList : any[] = this.gridApi.getSelectedRows()

        for(let i = 0; i < checkRowList.length; i++){
          let vin = checkRowList[i].vin
          this.devicemanageService.deleteDevicemanagersFirmwareFirmwareNameVehiclesVin(this.selectFirmware.firmwareName,vin).subscribe(res=>{
            console.log(res)
            if(i == checkRowList.length-1){
              this.getDevicemanagersFirmwareFirmwareNameVehicles()
            }
          },error=>{
            console.log(error)
            if (error.status === 401){
              this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
              // Redirect to the login page
              this.router.navigate(['/component/login']);
            }
          })
        }
      }
    });
  }

  modelRowOpen(model : any){
    this.selectFirmware = null
    this.inputVinText = "";
    this.searchVehicleList = []
    this.firmwareVehiclesList = {
      count : 0,
      entities : [],
      link : {}
    }
    if(this.selectModel == model){
      this.selectModel = null
    }else {
      this.selectModel = model
      this.getDevicemanagersFirmware()
    }
  }

  importFirmwareVehicles(event : any){
    console.log(event.target.files)
    this.importFirmwareVehiclesInput.nativeElement.value = "";
  }

  getVehiclemanagerStaticinfo(){
    console.log(this.inputVinText)
    if(this.inputVinText != ""){
      let f = new SearchFilter()
      f.vin = this.inputVinText
      f.modelName = this.selectModel.modelName
      this.vehiclemanagersService.getVehiclemanagerStaticinfo(f).subscribe(res=>{
        console.log(res)
        this.searchVehicleList = res.body.vehicleList
      },error=>{
        console.log(error)
      })
    }else{
      this.searchVehicleList = []
    }
  }

  vehicleItemClick(vin : string){
    this.inputVinText = vin
    this.getVehiclemanagerStaticinfo()
  }

  vinInputFocusout(){
    setTimeout(()=>{
      this.vinSearchListShow=false
    },1)
  }

}
