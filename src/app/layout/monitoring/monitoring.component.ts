import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { LoginCarRendererComponent } from 'src/app/component/login-car-renderer/login-car-renderer.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  translationFile : string = ""
  // stateOptions: { label: string; value: string; }[];

  @ViewChild('realTimeMonitoringGrid', { read: ElementRef }) realTimeMonitoringGrid : ElementRef;

  constructor(   private router: Router,
    private realtimedataService : RealtimedataService,
    private uiService : UiService,
    private utilService : UtilService,

    private translate: TranslateService,
    private http: HttpClient
    ) { }

  startDate : any
  endDate :any

  mapsBtn$ : Subscription

  columnDefs: ColDef[] = [
    { headerName: this.translate.instant('translationKeyLogin'), width:80, cellRenderer : LoginCarRendererComponent},
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin', width:180},
    { field: 'regNumber', headerName : 'Reg. number', tooltipField: 'regNumber', width:130},
    { field: 'nemsSn', headerName : 'NEMS S/N', tooltipField: 'nemsSn', width:180},
    { field: 'lastUpdate', headerName : 'Last Updated', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastUpdate'},
    { field: 'accumulatedMile', headerName : 'Accumulated Mile(km)', tooltipField: 'accumulatedMile', width:200 },
    { field: 'packetCount', headerName : 'Packet Count', tooltipField: 'packetCount', width:150 },
    { field: 'model', headerName : 'model', tooltipField: 'model', width:100 },
    { field: 'region', headerName : 'region', tooltipField: 'region', width:100 },
    { field: 'purpose', headerName : 'Purpose', tooltipField: 'purpose', valueFormatter : this.utilService.purposeValueToString, width:120 },
    { field: 'warningLevel', headerName : 'Warning', tooltipField: 'warningLevel', width:100 },
    { field: 'soc', headerName : 'soc(%)', tooltipField: 'soc', width:100 },
  ];

  vehicleInfo : any ={
    totalCount : 0,
    vehicleBrief : []

  }

  gridApi!: GridApi;

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnInit(): void {
    this.selectedLanguage = 'en'; // Set the default language
    this.translate.setDefaultLang('en'); // Set the default language

    // Load the translation file for the selected language
    this.translationFile = `../assets/i18n/dashboard/${this.selectedLanguage}.json`;

    this.uiService.currentLanguage$.subscribe((language : string)=>{
      console.log(language)
      this.selectedLanguage = language
      this.translationFile = `../assets/i18n/dashboard/${this.selectedLanguage}.json`;

      if(this.selectedLanguage == 'en'){
        console.log("영어")
      }else {
        console.log("중문")
      }
      this.translateColumnHeaders()
    })

    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getRealtimedataVehiclelist()
    })
   }

   translateColumnHeaders(): void {

    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'VIN', 'Reg. number', 'NEMS S/N', 'Last Updated', 'Accumulated Mile(km)', 'Packet Count', 'model', 'region', 'Purpose', 'Warning', 'soc(%)' ]).subscribe((translations: any) => {
          console.log(translations['vin']); // Check the translation value
          console.log(translations['regNumber']);
          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.columnDefs = [
            { headerName: 'Login', width:80, cellRenderer : LoginCarRendererComponent},
            { field: 'vin', headerName: translations['VIN'], tooltipField: 'vin', width:180},
            { field: 'regNumber', headerName : translations['Reg. number'], tooltipField: 'regNumber', width:130},
            { field: 'nemsSn', headerName : translations['NEMS S/N'], tooltipField: 'nemsSn', width:180},
            { field: 'lastUpdate', headerName : translations['Last Updated'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastUpdate'},
            { field: 'accumulatedMile', headerName : translations[ 'Accumulated Mile(km)'], tooltipField: 'accumulatedMile', width:200 },
            { field: 'packetCount', headerName : translations['Packet Count'], tooltipField: 'packetCount', width:150 },
            { field: 'model', headerName : translations['model'], tooltipField: 'model', width:100 },
            { field: 'region', headerName : translations['region'], tooltipField: 'region', width:100 },
            { field: 'purpose', headerName : translations['Purpose'], tooltipField: 'purpose', valueFormatter : this.utilService.purposeValueToString, width:120 },
            { field: 'warningLevel', headerName : translations['Warning'], tooltipField: 'warningLevel', width:100 },
            { field: 'soc', headerName : translations['soc(%)'], tooltipField: 'soc', width:100 },
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
   this.translate.use(language).subscribe(() => {
     // Translation changed successfully
     this.translateColumnHeaders();
   });
 }

 /*translateColumnHeaders(): void {
  this.columnDefs.forEach((columnDef) => {
    columnDef.headerName = this.translate.instant(columnDef.headerName);
  });
}*/

  getPageSize(){
    this.gridHeight = this.realTimeMonitoringGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getRealtimedataVehiclelist()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.realTimeMonitoringGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.realTimeMonitoringGrid.nativeElement.offsetWidth > 1640){
      this.gridApi.sizeColumnsToFit()
    }

  }

  getVehicleRow(event : any){
    console.log(event.data)

    this.router.navigateByUrl('/main/monitoring/detail/'+event.data.vin).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });

  }

  getRealtimedataVehiclelist(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.realtimedataService.getRealtimedataVehiclelist(this.searchFilter).subscribe(
      res=>{
        console.log(res)
        this.vehicleInfo = res.body
        let pagination = {
          count : this.vehicleInfo.totalCount,
          pageSize : this.pageSize,
          page : this.currentPage
        }

        this.uiService.setPagination(pagination)

      }, error=>{
        console.log(error)
      })
  }

  moveDetaileMonitoring(){
    this.router.navigateByUrl('/main/monitoring/detail/'+null).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.mapsBtn$)this.mapsBtn$.unsubscribe()
    if(this.page$)this.page$.unsubscribe()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if(this.realTimeMonitoringGrid.nativeElement.offsetWidth > 1640){
      this.gridApi.sizeColumnsToFit()
    }
  }




  onBtExport() {

    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.realtimedataService.getRealtimedataVehiclelist(this.searchFilter).subscribe(
      res=>{
        console.log(res)
        this.utilService.gridDataToExcelData("monitoring", this.gridApi ,res.body.vehicleBrief)
      }, error=>{
        console.log(error)
      })
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

}
