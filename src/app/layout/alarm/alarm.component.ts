import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CheckboxFilterComponent } from 'src/app/component/checkbox-filter/checkbox-filter.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { ModifyAlarmComponent } from 'src/app/component/modify-alarm/modify-alarm.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
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

  constructor(
    private vehiclewarningService : VehiclewarningService,
    private utilService : UtilService,
    private uiService: UiService,
    private dialog: MatDialog,
    private vehiclemanagerService : VehiclemanagerService,
    private _formBuilder: FormBuilder
  ) { }


  isOpenWarningTypeFilter : boolean = false;
  warningTypeToppings = this._formBuilder.group({
    NORMAL : false,
    TEMP_DIFF : false,
    BATTERY_HIGH_TEMP : false,
    POWER_BATTERY_OVER_VOLTAGE : false,
    POWER_BATTERY_UNDER_VOLTAGE : false,
    SOC_LOW : false,
    SINGLE_BATTERY_OVER_VOLTAGE : false,
    SINGLE_BATTERY_UNDER_VOLTAGE : false,
    SOC_TOO_HIGH : false,
    SOC_JUMP : false,
    POWER_BATTERY_MISS_MATCH : false,
    POOR_BATTERY_UNIFORMILY : false,
    INSULATION : false,
    DCDC_TEMP : false,
    BREAK_SYSTEM : false,
    DCDC_STATUS : false,
    MOTOR_CONTROLLER_TEMP : false,
    HIGH_VOLTAGE_INTERLOCK_STATUS : false,
    MOTOR_TEMP : false,
    STORAGE_OVER_CHARGE : false
  });

  isOpenWarningLevelFilter : boolean = false;
  warningLevelToppings = this._formBuilder.group({
    NORMAL : false,
    MINOR : false,
    MAJOR : false,
    CRITICAL : false,
    ABNORMAL : false,
    INVAILD : false,
  });


  stateToppings = this._formBuilder.group({
    UNKNOWN : false,
    OPEN : false,
    PROGRESSING : false,
    RESOLVED : false,
    CLOSED : false,
    ERROR : false,
  });


  columnDefs: ColDef[] = [
    { field: 'vin',headerName: "VIN", tooltipField: 'vin'},
    { field: 'createTime',headerName: "Create Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'createTime' }},
    { field: 'lastPacketTime',headerName: "Last Packet Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'lastPacketTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'lastPacketTime' }},
    //{ field: 'releasedTime',headerName: "Released Time", valueFormatter : this.utilService.gridDateFormat, tooltipField: 'releasedTime', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'releasedTime' }},
    { field: 'state',headerName: "State", tooltipField: 'state', filter : CheckboxFilterComponent, filterParams :  { toppings: this.stateToppings}},
    //{ field: 'maxWarning',headerName: "Max Warning", tooltipField: 'maxWarning'},
    //{ field: 'warningFlag',headerName: "Warning Flag", tooltipField: 'warningFlag'},
    //{ field: 'region',headerName: "Region", tooltipField: 'region'},
    //{ field: 'comment',headerName: "Comment", tooltipField: 'comment'},
    { field: 'warningLevel',headerName: "Warning Level", tooltipField: 'warningLevel', filter : CheckboxFilterComponent, filterParams :  { toppings: this.warningLevelToppings}},
    { field: 'warningType',headerName: "Warning Type", tooltipField: 'warningType', filter : CheckboxFilterComponent, filterParams :  { toppings: this.warningTypeToppings}},
    //{ field: 'warningCode',headerName: "Warning Code", tooltipField: 'warningCode'},
    //{ field: 'code',headerName: "Code", tooltipField: 'code'},
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



  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
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
    },1)
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getPageSize()
    })


  }

  alarmModify(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( ModifyAlarmComponent, {
        data : {
          alarm : this.gridApi.getSelectedRows()[0]
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){

          console.log(result)

          let parameter = {
            state : result.warningIssue.state,
          }

          this.vehiclewarningService.putVehiclewarningsIssueId(result.warningIssue.issueId, parameter).subscribe(res=>{
            console.log(res)
            this.getVehiclewarnings()
          },error=>{
            console.log(error)
          })

          //this.getVehiclewarnings()

        }
      });
    }
  }

  alarmDelete(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Alarm",
          alertContents : "Do you want to delete the data ? (VIN : " + this.gridApi.getSelectedRows()[0].vin+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.vehiclewarningService.deleteVehiclewarningsIssueId(this.gridApi.getSelectedRows()[0].issueId).subscribe(res=>{
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
  }

  getPageSize(){
    this.gridHeight = this.alarmGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getVehiclewarnings()
  }

  onResize(event : any){
    this.getPageSize()
  }

  getVehiclewarnings(){
    this.searchFilter.limit = this.pageSize
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.warningType = []
    for (const [key, value] of Object.entries(this.warningTypeToppings.value)) {
      if(value){
        this.searchFilter.warningType.push(key)
      }
    }

    this.searchFilter.warningLevel = []
    for (const [key, value] of Object.entries(this.warningLevelToppings.value)) {
      if(value){
        this.searchFilter.warningLevel.push(key)
      }
    }

    this.searchFilter.state = []
    for (const [key, value] of Object.entries(this.stateToppings.value)) {
      if(value){
        this.searchFilter.state.push(key)
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
    },error=>{
      console.log(error)
    })
  }

  selectAlarm(){
    if(this.gridApi.getSelectedRows().length > 0){
      this.selectionAlarm = this.gridApi.getSelectedRows()[0]
      console.log(this.selectionAlarm)

      this.vehiclemanagerService.getVehiclemanagerStaticinfoVin(this.selectionAlarm.vin).subscribe(res=>{
        console.log(res)
        this.selectVehicle = res.body
      },error=>{
        console.log(error)
      })
    }

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
    this.getVehiclewarnings()
  }

  clearEndDate(){
    this.endDate = undefined
  }

  clearBeginDate(){
    this.beginDate = undefined
  }
}
