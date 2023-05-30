import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-otainformation',
  templateUrl: './otainformation.component.html',
  styleUrls: ['./otainformation.component.css']
})
export class OTAInformationComponent implements OnInit {
  selectedLanguage: string;

  @ViewChild('otaInformationGrid', { read: ElementRef }) otaInformationGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()



  constructor(
    private vehiclemanagerService : VehiclemanagerService,
    private devicemanagerService : DevicemanagerService,
    private utilService : UtilService,
    private uiService : UiService,
    private _formBuilder: FormBuilder,

    private translate: TranslateService,
    private http: HttpClient
  ) { }

  stateToppings = this._formBuilder.group({
    _1RESERVE : false,
    _2WAITACK : false,
    _3START : false,
    _4DOWNLOADING : false,
    _5FAIL : false,
    _6DISCONNECT : false,
    _7COMPLETE : false,
  });


  columnDefs: ColDef[] = [
    { field: 'vin', headerName : 'VIN', tooltipField: 'vin'},
    { field: 'firmwareName', headerName: 'Firmware Name', tooltipField: 'firmwareName'},
    { field: 'currentState', headerName: 'State', tooltipField: 'currentState', filter : CheckboxFilterComponent, filterParams :  { toppings: this.stateToppings}},
    { field: 'forceOta', headerName : 'Force OTA', tooltipField: 'forceOta'},
    { field: 'start', headerName : 'Start', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'start', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'start', type : 'date' }},
    { field: 'end', headerName : 'End', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'end', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'end', type : 'date' }}
  ];

  vehicle : any ={
    count : 0,
    vehicleList : []
  }

  private gridApi!: GridApi;
  selectNodeID : string = null;

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
    this.selectedLanguage = 'en'; // Set the default language
    this.translate.setDefaultLang('en'); // Set the default language
  
    // Load the translation file for the selected language
    const languageToLoad = this.selectedLanguage;
    const translationFile = `../assets/i18n/dashboard/${languageToLoad}.json`;
    
    this.translate.use(languageToLoad).subscribe(() => {
      this.http.get<any>(translationFile).subscribe((data) => {
        this.translate.setTranslation(languageToLoad, data);
        console.log('Translation file loaded successfully');
        //this.translateColumnHeaders();
      });
    });

    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getDevicemanagersVehiclesFirmware()
    })
  }

  isDropdownOpen =false;

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
     //this.translateColumnHeaders();
   });
 }

  getPageSize(){
    this.gridHeight = this.otaInformationGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getDevicemanagersVehiclesFirmware()
    }

  }

  onResize(event : any){
    if(this.gridHeight != this.otaInformationGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.gridApi){
      this.gridApi.sizeColumnsToFit()
    }
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
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

  getDevicemanagersVehiclesFirmware(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.searchFilter.state = []

    for (const [key, value] of Object.entries(this.stateToppings.value)) {
      if(value){
        this.searchFilter.state.push(key.substr(2))
      }
    }

    this.devicemanagerService.getDevicemanagersVehiclesFirmware(this.searchFilter).subscribe(res=>{
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

  onBtExport() {
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.vehiclemanagerService.getVehiclemanagerStaticinfo(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("OTA Information", this.gridApi ,res.body.vehicleList)
    },error=>{
      console.log(error)
    })
  }

  setSearch(){
    if(this.searchText != ""){
      if(this.filter == 'VIN'){
        this.searchFilter.vin = this.searchText
        this.searchFilter.firmwareName = undefined
      }else if(this.filter == 'firmware_name'){
        this.searchFilter.firmwareName = this.searchText
        this.searchFilter.vin = undefined
      }
    }else{
      this.searchFilter.vin = undefined
      this.searchFilter.firmwareName = undefined
    }

    this.uiService.setCurrentPage(1);
  }

  changeFilter(){
    this.uiService.setCurrentPage(1);
  }
}

