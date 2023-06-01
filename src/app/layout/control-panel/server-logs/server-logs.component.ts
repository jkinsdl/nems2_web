import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { DetailServerLogComponent } from 'src/app/component/detail-server-log/detail-server-log.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { GbpacketService } from 'src/app/service/gbpacket.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.css']
})

export class ServerLogsComponent implements OnInit {
  selectedLanguage: string;
  translationFile : string = ""

  @ViewChild('serverLogGrid', { read: ElementRef }) serverLogGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private gbpacketService : GbpacketService,
    private utilService : UtilService,
    private uiService : UiService,
    private _formBuilder: FormBuilder,

    private translate: TranslateService,
    private http: HttpClient
  ) { }

  requestToppings = this._formBuilder.group({
    _aVEHICLE_LOGIN : false,
    _bINFORMATION : false,
    _cADDITIONAL : false,
    _dVEHICLE_LOGOUT : false,
    _ePLATFORM_LOGIN : false,
    _fPLATFORM_LOGOUT : false,
    _gVEHICLE_HEARTBEAT : false,
    _hVEHICLE_SYNC : false,
    _uVEHICLE_QUERY : false,
    _jVEHICLE_SETTING : false,
    _kVEHICLE_CONTROL : false,
    _lPLATFORM_CUSTOM_DATA_REQUEST : false,
    _mPLATFORM_CUSTOM_DATA_STATIC_INFO : false,
    _nPLATFORM_CUSTOM_TEST_TERMINAL : false,
    _oPLATFORM_CUSTOM_TEST_TERMIANL_RESET : false,
    _pPLATFORM_CUSTOM_OTA_REPORT : false,
  });

  columnDefs: ColDef[] = [
    { field: 'vin', headerName : 'vin', tooltipField: 'vin'},
    { field: 'serverTime', headerName : 'serverTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime', type : 'date' }},
    { field: 'packetTime', headerName : 'packetTime', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }},
    { field: 'request', headerName : 'request', tooltipField: 'request', filter : CheckboxFilterComponent, filterParams :  { toppings: this.requestToppings}},
    { field: 'response', headerName : 'response', tooltipField: 'response', width:110},
    { field: 'encryption', headerName: 'encryption', tooltipField: 'encryption', width:110},
    { field: 'flagged', headerName : 'flagged', tooltipField: 'flagged', width:90},
    { field: 'data', headerName: 'data', valueFormatter: this.utilService.base64ToHex, tooltipField: 'data', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'data', type:'decoding' }},
    { field: 'responsePacket', headerName : 'responsePacket', valueFormatter: this.utilService.base64ToHex, tooltipField: 'responsePacket', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'responsePacket', type:'decoding' }},
    //{ field: 'type', headerName : 'type', tooltipField: 'type'},
  ];

  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;

  selectNodeID : string = null;

  beginDate : Date = null
  endDate : Date = null

  gbpacket : any ={
    count : 0,
    entities : [],
    link : {}
  }

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
      this.getGbpacket()
    })
  }

  translateColumnHeaders(): void {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      this.http.get<any>(this.translationFile).subscribe((data) => {
        this.translate.setTranslation(this.selectedLanguage, data);
        console.log('Translation file loaded successfully');
        this.translate.get([ 'vin', 'serverTime', 'packetTime', 'request', 'response', 'encryption', 'flagged', 'data', 'responsePacket']).subscribe((translations: any) => {
        
          console.log('Language:', this.translate.currentLang); // Log the current language
          console.log('Translations:', translations); // Log the translations object
          this.columnDefs = [
            { field: 'vin', headerName : translations['vin'], tooltipField: 'vin'},
            { field: 'serverTime', headerName : translations['serverTime'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'serverTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'serverTime', type : 'date' }},
            { field: 'packetTime', headerName : translations['packetTime'], valueFormatter : this.utilService.gridDateFormat, tooltipField: 'packetTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'packetTime', type : 'date' }},
            { field: 'request', headerName : translations['request'], tooltipField: 'request', filter : CheckboxFilterComponent, filterParams :  { toppings: this.requestToppings}},
            { field: 'response', headerName : translations['response'], tooltipField: 'response', width:110},
            { field: 'encryption', headerName: translations['encryption'], tooltipField: 'encryption', width:110},
            { field: 'flagged', headerName : translations['flagged'], tooltipField: 'flagged', width:90},
            { field: 'data', headerName: translations['data'], valueFormatter: this.utilService.base64ToHex, tooltipField: 'data', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'data', type:'decoding' }},
            { field: 'responsePacket', headerName : translations['responsePacket'], valueFormatter: this.utilService.base64ToHex, tooltipField: 'responsePacket', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'responsePacket', type:'decoding' }},
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
    this.gridHeight = this.serverLogGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getGbpacket()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.serverLogGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
    if(this.gridApi){
      this.gridApi.sizeColumnsToFit()
    }
  }

  getGbpacket(){
    this.searchFilter.request = []

    for (const [key, value] of Object.entries(this.requestToppings.value)) {
      if(value){
        this.searchFilter.request.push(key.substr(2))
      }
    }

    if(this.beginDate){
      this.searchFilter.begin = this.beginDate.toISOString()
    }else{
      this.searchFilter.begin = undefined
    }

    if(this.endDate){
      this.searchFilter.end = this.endDate.toISOString()
    }else{
      this.searchFilter.end = undefined
    }

    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    /*this.searchFilter.asc = []
    this.searchFilter.asc.push('SERVER_TIME')*/
    this.searchFilter.desc = []
    this.searchFilter.desc.push('SERVER_TIME')

    this.gbpacketService.getGbpacket(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.gbpacket = res.body
      let pagination = {
        count : this.gbpacket.count,
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
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onGridRowDoubleClicked(e : any){
    console.log(e)

    const dialogRef = this.dialog.open( DetailServerLogComponent, {
      data:{
        serverLog : e.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });
  }

  onBtExport() {
    this.gbpacketService.getGbpacketExport(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.exportDownload('server_log.zip',res.body[0].data)
    },error=>{
      console.log(error)
    })

    /*this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.gbpacketService.getGbpacket(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("Server Log", this.gridApi ,res.body.entities)
    },error=>{
      console.log(error)
    })*/
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }

  clearEndDate(){
    this.endDate = undefined
  }

  clearBeginDate(){
    this.beginDate = undefined
  }
}
