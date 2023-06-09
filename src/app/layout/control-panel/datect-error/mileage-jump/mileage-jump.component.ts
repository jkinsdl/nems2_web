import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';
import {Router} from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mileage-jump',
  templateUrl: './mileage-jump.component.html',
  styleUrls: ['./mileage-jump.component.css']
})
export class MileageJumpComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  selectedLanguage: string; // Property to track the selected language(MINE)
  translationFile : string = ""

  @ViewChild('mileageJumpGrid', { read: ElementRef }) mileageJumpGrid : ElementRef;

  constructor(
    private utilService : UtilService,
    private uiService : UiService,
    private gbpacketService : GbpacketService,
    private router: Router,

    private translate: TranslateService,
    private http: HttpClient

  ) { }


  columnDefs: ColDef[] = [
    { field: 'vin', headerName: 'VIN', tooltipField: 'vin', width:120 },
    { field: 'serverTime', headerName: 'Server Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime', type : 'date' }, width:140},
    { field: 'packetTime', headerName : 'Packet Time', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }, width:140},
    { field: 'state',headerName: "State", tooltipField: 'state', width:120},
    { field: 'value', headerName : 'Value', tooltipField: 'value', width:100},
    { field: 'data', headerName : 'Data', tooltipField: 'data'},
  ];

  gridApi!: GridApi;
  selectNodeID : string = null;

  beginDate : any
  endDate :any

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  errorPacketList : any = {
    entities : [],
    count : 0
  }

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
      this.getGbpacketInvalid()
    })
  }

  translateColumnHeaders(): void {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'VIN', 'Server Time', 'Packet Time', 'State', 'Value', 'Data' ]).subscribe((translations: any) => {
    
          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.columnDefs = [
            { field: 'vin', headerName: translations['VIN'], tooltipField: 'vin', width:120 },
            { field: 'serverTime', headerName: translations['Server Time'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime', type : 'date' }, width:140},
            { field: 'packetTime', headerName : translations['Packet Time'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }, width:140},
            { field: 'state',headerName: translations["State"], tooltipField: 'state', width:120},
            { field: 'value', headerName : translations['Value'], tooltipField: 'value', width:100},
            { field: 'data', headerName : translations['Data'], tooltipField: 'data'},
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
    this.gridHeight = this.mileageJumpGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getGbpacketInvalid()
    }
  }

  getGbpacketInvalid(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.searchFilter.state = ["MILEAGE_JUMP"]

    if(this.beginDate){
      this.searchFilter.begin = new Date(this.beginDate).toISOString()
    }else{
      this.searchFilter.begin = undefined
    }

    if(this.endDate){
      this.searchFilter.end = new Date(this.endDate).toISOString()
    }else{
      this.searchFilter.end = undefined
    }

    this.gbpacketService.getGbpacketInvalid(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.errorPacketList = res.body

      let pagination = {
        count : this.errorPacketList.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)

    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  onResize(event : any){
    if(this.gridHeight != this.mileageJumpGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
    this.gridApi.sizeColumnsToFit()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.gbpacketService.getGbpacketInvalid(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("abnormal vehicle real time", this.gridApi ,res.body)
    },error=>{
      console.log(error)
    })
  }

  changeFilter(){
    this.uiService.setCurrentPage(1);
  }

  clearEndDate(){
    this.endDate = undefined
  }

  clearBeginDate(){
    this.beginDate = undefined
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

}
