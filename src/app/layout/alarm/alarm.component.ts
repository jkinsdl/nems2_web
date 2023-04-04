import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';
import { CommonConstant } from 'src/app/util/common-constant';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  @ViewChild('alarmGrid', { read: ElementRef }) alarmGrid : ElementRef;

  router$ : Subscription
  isOnAfterViewInit = false
  constructor(
    private vehiclewarningService : VehiclewarningService,
    private utilService : UtilService,
    private uiService: UiService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private realtimeSerivce : RealtimedataService,
    public router: Router,
  ) {
    this.router$ = router.events.subscribe((val) => {
      if(val instanceof NavigationEnd && val.url.indexOf('alarm') > -1){

        console.log(val)
        console.log(this.actRoute.snapshot.paramMap.get('issueId'))
        console.log(this.actRoute.snapshot.paramMap.get('warningLevel'))
        this.warningLevelToppings.controls['_1MINOR'].setValue(false)
        this.warningLevelToppings.controls['_2MAJOR'].setValue(false)
        this.warningLevelToppings.controls['_3CRITICAL'].setValue(false)
        this.warningLevelToppings.controls['_4ABNORMAL'].setValue(false)
        this.warningLevelToppings.controls['_5INVAILD'].setValue(false)
        if(val.url.indexOf("CRITICAL") > -1){
          this.warningLevelToppings.controls['_3CRITICAL'].setValue(true)
        }else if(val.url.indexOf("MAJOR") > -1){
          this.warningLevelToppings.controls['_2MAJOR'].setValue(true)
        }else if(val.url.indexOf("MINOR") > -1){
          this.warningLevelToppings.controls['_1MINOR'].setValue(true)
        }

        this.stateToppings.controls['_1OPEN'].setValue(false)
        this.stateToppings.controls['_2PROGRESS'].setValue(false)
        this.stateToppings.controls['_3RESOLVED'].setValue(false)
        this.stateToppings.controls['_4CLOSED'].setValue(false)
        this.stateToppings.controls['_5ERROR'].setValue(false)

        if(this.actRoute.snapshot.paramMap.get('issueId') && this.actRoute.snapshot.paramMap.get('issueId') != 'null'){
          this.stateToppings.controls['_1OPEN'].setValue(true)
          this.stateToppings.controls['_2PROGRESS'].setValue(true)
          this.stateToppings.controls['_5ERROR'].setValue(true)
        }

        if(this.isOnAfterViewInit){
          this.getPageSize()
        }
      }
    });
  }


  isOpenWarningTypeFilter : boolean = false;
  warningTypeToppings = this._formBuilder.group({
    _aTEMP_DIFF : false,
    _bBATTERY_HIGH_TEMP : false,
    _cPOWER_BATTERY_OVER_VOLTAGE : false,
    _dPOWER_BATTERY_UNDER_VOLTAGE : false,
    _eSOC_LOW : false,
    _fSINGLE_BATTERY_OVER_VOLTAGE : false,
    _gSINGLE_BATTERY_UNDER_VOLTAGE : false,
    _hSOC_TOO_HIGH : false,
    _iSOC_JUMP : false,
    _jPOWER_BATTERY_MISS_MATCH : false,
    _kPOOR_BATTERY_UNIFORMILY : false,
    _lINSULATION : false,
    _mDCDC_TEMP : false,
    _nBREAK_SYSTEM : false,
    _oDCDC_STATUS : false,
    _pMOTOR_CONTROLLER_TEMP : false,
    _qHIGH_VOLTAGE_INTERLOCK_STATUS : false,
    _rMOTOR_TEMP : false,
    _sSTORAGE_OVER_CHARGE : false
  });

  isOpenWarningLevelFilter : boolean = false;
  warningLevelToppings = this._formBuilder.group({
    _1MINOR : false,
    _2MAJOR : false,
    _3CRITICAL : false,
    _4ABNORMAL : false,
    _5INVAILD : false,
  });

  stateToppings : any = this._formBuilder.group({
    _1OPEN : false,
    _2PROGRESS : false,
    _3RESOLVED : false,
    _4CLOSED : false,
    _5ERROR : false,
  });

  columnDefs: ColDef[] = [
    { field: 'vin',headerName: "VIN", tooltipField: 'vin', width:170},
    { field: 'createTime',headerName: "Create Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'createTime', type : 'date' }, width:170},
    { field: 'lastPacketTime',headerName: "Last Packet Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastPacketTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastPacketTime', type : 'date' }, width:170},
    //{ field: 'releasedTime',headerName: "Released Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'releasedTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'releasedTime' }},
    { field: 'state',headerName: "State", tooltipField: 'state', filter : CheckboxFilterComponent, filterParams :  { toppings: this.stateToppings}, width:120},
    //{ field: 'maxWarning',headerName: "Max Warning", tooltipField: 'maxWarning'},
    //{ field: 'warningFlag',headerName: "Warning Flag", tooltipField: 'warningFlag'},
    //{ field: 'region',headerName: "Region", tooltipField: 'region'},
    //{ field: 'comment',headerName: "Comment", tooltipField: 'comment'},
    { field: 'warningLevel',headerName: "Warning Level", tooltipField: 'warningLevel', filter : CheckboxFilterComponent, filterParams :  { toppings: this.warningLevelToppings}, width:110},
    { field: 'warningType',headerName: "Warning Type", tooltipField: 'warningType', filter : CheckboxFilterComponent, filterParams :  { toppings: this.warningTypeToppings}},
    //{ field: 'warningCode',headerName: "Warning Code", tooltipField: 'warningCode'},
    //{ field: 'code',headerName: "Code", tooltipField: 'code'},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      onlyRemove : true,
      delete : (field: any) => {
        this.alarmDelete(field)
      },
    }, width:80},
  ];

  vehiclewarning : any = {
    totalCount : 0,
    entities : []
  }

  gridApi!: GridApi;
  gridColumnApi : any

  frameworkComponents : any

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 35.8617;
  lng = 104.1954;

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  selectionAlarm : any = {
    maxWarning : '',
    region : '',
    vin : '',
    warningFlag : '',
    createTime : ''
  }

  selectVehicle : any = {
    modifyHistory : [],
    vehicle : {
      batteryCode : "",
      engineNo : "",
      iccid : "",
      modelName : "",
      motorNo : "",
      nemsSn : "",
      pcode : 0,
      purpose : "",
      region : "",
      registDate : "",
      registrationPlate : "",
      sOffDate : "",
      vin : ""
    }
  }

  beginDate : Date = null
  endDate : Date = null


  commentsText : string = ""

  ngAfterViewInit() {
    this.isOnAfterViewInit = true
    this.getPageSize()
  }

  ngOnDestroy(): void {
    if(this.page$)this.page$.unsubscribe()
    if(this.router$)this.router$.unsubscribe()
  }

  ngOnInit(): void {
    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 4,
        center: [this.lng, this.lat]
      });
      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.on('load', () => {
        this.map.addSource('realtimedataLocation',{
          type: 'geojson'
        })
        this.map.addLayer({
          id: 'realtimedata-location-clusters',
          type: 'circle',
          source: 'realtimedataLocation',
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#fff'
          }
        });
      })
    },1)
    this.page$ = this.uiService.page$.subscribe((page : number)=>{

      this.currentPage = page
      this.getPageSize()
    })
  }

  alarmDelete(field: any){
    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Alarm",
        alertContents : "Do you want to delete the data ? (VIN : " + field.vin+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vehiclewarningService.deleteVehiclewarningsIssueId(field.issueId).subscribe(res=>{
          console.log(res)
          this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;

          this.selectionAlarm = {
            maxWarning : '',
            region : '',
            vin : '',
            warningFlag : '',
            createTime : ''
          }

          this.selectVehicle = {
            modifyHistory : [],
            vehicle : {
              batteryCode : "",
              engineNo : "",
              iccid : "",
              modelName : "",
              motorNo : "",
              nemsSn : "",
              pcode : 0,
              purpose : "",
              region : "",
              registDate : "",
              registrationPlate : "",
              sOffDate : "",
              vin : ""
            }
          }

        },error=>{
          console.log(error)
        })
      }
    });
  }

  getPageSize(){
      this.gridHeight = this.alarmGrid.nativeElement.offsetHeight;
      this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
      this.getVehiclewarnings()
  }

  onResize(event : any){
    if(this.gridHeight != this.alarmGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    if(this.gridApi){
      this.gridApi.sizeColumnsToFit()
    }

  }

  getVehiclewarnings(){
    this.searchFilter.limit = this.pageSize
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.warningType = []
    this.searchFilter.desc = []
    this.searchFilter.desc.push('CREATE_TIME')
    for (const [key, value] of Object.entries(this.warningTypeToppings.value)) {
      if(value){
        this.searchFilter.warningType.push(key.substr(2))
      }
    }

    this.searchFilter.warningLevel = []
    for (const [key, value] of Object.entries(this.warningLevelToppings.value)) {
      if(value){
        this.searchFilter.warningLevel.push(key.substr(2))
      }
    }

    this.searchFilter.state = []
    for (const [key, value] of Object.entries(this.stateToppings.value)) {
      if(value){
        this.searchFilter.state.push(key.substr(2))
      }
    }

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


    console.log(this.searchFilter)

    this.vehiclewarningService.getVehiclewarnings(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.vehiclewarning = res.body
      let pagination = {
        count : this.vehiclewarning.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)

      if( this.actRoute.snapshot.paramMap.get('issueId') ){

        setTimeout(()=>{
          this.gridApi.forEachNode(node=> node.data.issueId == this.actRoute.snapshot.paramMap.get('issueId') ? node.setSelected(true) : 0)
        },1)

      }

    },error=>{
      console.log(error)
    })
  }

  selectAlarm(){

    this.commentsText = ""

    if(this.gridApi.getSelectedRows().length > 0){
      this.selectionAlarm = this.gridApi.getSelectedRows()[0]
      console.log(this.selectionAlarm)

      /*this.vehiclemanagerService.getVehiclemanagerStaticinfoVin(this.selectionAlarm.vin).subscribe(res=>{
        console.log(res)
        this.selectVehicle = res.body
      },error=>{
        console.log(error)
      })*/

      this.vehiclewarningService.getVehiclewarningsIssueId(this.selectionAlarm.issueId).subscribe(res=>{
        console.log(res)
        this.selectVehicle = res.body.warningIssue

        let aDayAgo = new Date()
        aDayAgo.setDate(new Date().getDate()-1)

        /*this.userService.getUsersUserId(res.body.comments[0].userId).subscribe(res2=>{
          console.log(res2)
        })*/

        this.selectionAlarm.comments = res.body.comments.map((x:any) => ({
          ...x,
          isNewIcon:  new Date(x.createAt).getTime() > aDayAgo.getTime()
         }));

         console.log(this.selectionAlarm.comments)
      },error=>{
        console.log(error)
      })

      let f = new SearchFilter()
      f.vin = this.selectionAlarm.vin
      f.time = this.selectionAlarm.createTime
      /*f.vin = "2051508135510957F"
      f.time = "2023-02-16T04:11:46.085Z"*/


      this.realtimeSerivce.getRealtimedataInfoVin(f).subscribe(res=>{
        console.log(res)
        let featuresList : any[] = []
        featuresList.push({
          "type": "Feature",
          "properties": {
            "vin" : res.body.vin
          },
          "geometry": {
            "type": "Point",
              "coordinates": [res.body.location.longitude, res.body.location.latitude]
          },
        })

        let source = (this.map.getSource("realtimedataLocation") as GeoJSONSource).setData({
          "type": "FeatureCollection",
          "features": featuresList
        });

        this.map.flyTo({
          center: [res.body.location.longitude,res.body.location.latitude],
          duration: 1500,
          zoom: 10
        });

      },error=>{
        console.log()
      })


    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.searchFilter.limit = undefined
    this.searchFilter.offset = undefined
    this.vehiclewarningService.getVehiclewarnings(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("Alarm", this.gridApi ,res.body.warnings)
    },error=>{
      console.log(error)
    })
  }

  openWarningTypeFilter(){
    this.isOpenWarningTypeFilter = true
  }

  openWarningLevelFilter(){
    this.isOpenWarningLevelFilter = true
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

  applyComment(){

    let parameter = {
      comment : this.commentsText
    }

    this.vehiclewarningService.postVehiclewarningsIssueIdComment(this.selectionAlarm.issueId,parameter).subscribe(res=>{
      console.log(res)
      this.selectAlarm()
    },error=>{
      console.log(error)
    })
  }

  correctionState(){
    let parameter = {
      state : this.selectionAlarm.state
    }

    this.vehiclewarningService.putVehiclewarningsIssueId(this.selectionAlarm.issueId, parameter).subscribe(res=>{
      console.log(res)
      this.selectAlarm()
      //this.getVehiclewarnings()
    },error=>{
      console.log(error)
    })
  }
}
