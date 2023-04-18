import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddPushAlarmComponent } from 'src/app/component/add-push-alarm/add-push-alarm.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { NotificationService } from 'src/app/service/notification.service';
import { PushinfosService } from 'src/app/service/pushinfos.service';
import { UiService } from 'src/app/service/ui.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-push-alarm',
  templateUrl: './push-alarm.component.html',
  styleUrls: ['./push-alarm.component.css']
})
export class PushAlarmComponent implements OnInit {

  @ViewChild('pushAlarmGrid', { read: ElementRef }) pushAlarmGrid : ElementRef;

  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private notificationService : NotificationService,
    private utilService : UtilService,
    private uiService: UiService,
    private pushinfosService : PushinfosService

  ) { }

  columnDefs: ColDef[] = [
    { field: 'pushinfoId', headerName: 'pushinfoId', tooltipField: 'pushinfoId', hide:true },
    { field: 'userName', headerName : 'userName', tooltipField: 'userName'},
    { field: 'eMail', headerName : 'eMail', tooltipField: 'eMail'},
    { field: 'phoneNumber', headerName : 'phoneNumber', tooltipField: 'phoneNumber'},
    { field: 'aliTextureId', headerName: 'aliTextureId', tooltipField: 'aliTextureId'},
    { field: 'aliVoiceId', headerName : 'aliVoiceId', tooltipField: 'aliVoiceId'},
    { field: 'createdAt', headerName : 'createdAt', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'createdAt', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'createdAt', type : 'date' }},
    { field: 'createdUserId', headerName : 'createdUserId', tooltipField: 'createdUserId', hide:true},
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyAlarm(field)
      },
      delete : (field: any) => {
        this.deleteAlarm(field)
      },
    }, width:120},
  ];

  pushinfos : any = {
    count : 0,
    entities : []
  }

  gridApi!: GridApi;

  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  filter : string = "userName"
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
    //this.getNotifications()
    //this.getNotificationsRejections()
    //this.getNotificationsTemplates()
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getPushinfos()
    })
  }

  getPushinfos(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.pushinfosService.getPushinfos(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.pushinfos = res.body

      let pagination = {
        count : this.pushinfos.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }

      this.uiService.setPagination(pagination)


    },error=>{
      console.log(error)
    })
  }

  getPageSize(){
    this.gridHeight = this.pushAlarmGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    if(this.searchFilter.limit != this.pageSize){
      this.getPushinfos()
    }
  }

  onResize(event : any){
    if(this.gridHeight != this.pushAlarmGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }

    this.gridApi.sizeColumnsToFit()

  }

  getNotificationsTemplates(){
    this.notificationService.getNotificationsTemplates().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  getNotificationsRejections(){
    this.notificationService.getNotificationsRejections().subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }


  getNotifications(){
    this.notificationService.getNotifications(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  addAlarm(){
    const dialogRef = this.dialog.open( AddPushAlarmComponent, {
      data:{
        type:this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getPushinfos()
      }
    });
  }

  modifyAlarm(field: any){
    const dialogRef = this.dialog.open( AddPushAlarmComponent, {
      data:{
        type:this.constant.MODIFY_TYPE,
        pushinfo : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getPushinfos()
      }
    });
  }

  deleteAlarm(field: any){

    console.log(field)

    const dialogRef = this.dialog.open( AlertPopupComponent, {
      data:{
        alertTitle : "Delete Push Alarm",
        alertContents : "Do you want to delete the alarm ? (aliTextureId : " + field.aliTextureId+ ")",
        alertType : this.constant.ALERT_WARNING,
        popupType : this.constant.POPUP_CHOICE,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.pushinfosService.deletePushinfosPushinfoId(field.pushinfoId).subscribe(res=>{
          this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;

        })

      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.utilService.gridDataToExcelData("Push Alarm", this.gridApi ,this.pushinfos.entities)
  }

  setSearch(){

    if(this.searchText != ""){
      if(this.filter == 'userName'){
        this.searchFilter.userName = this.searchText
        this.searchFilter.phoneNumber = undefined
        this.searchFilter.eMail = undefined
        this.searchFilter.aliTextureId = undefined
        this.searchFilter.aliVoiceId = undefined
      }else if(this.filter == 'phoneNumber'){
        this.searchFilter.userName = undefined
        this.searchFilter.phoneNumber = this.searchText
        this.searchFilter.eMail = undefined
        this.searchFilter.aliTextureId = undefined
        this.searchFilter.aliVoiceId = undefined
      }else if(this.filter == 'eMail'){
        this.searchFilter.userName = undefined
        this.searchFilter.phoneNumber = undefined
        this.searchFilter.eMail = this.searchText
        this.searchFilter.aliTextureId = undefined
        this.searchFilter.aliVoiceId = undefined
      }else if(this.filter == 'aliTextureId'){
        this.searchFilter.userName = undefined
        this.searchFilter.phoneNumber = undefined
        this.searchFilter.eMail = undefined
        this.searchFilter.aliTextureId = this.searchText
        this.searchFilter.aliVoiceId = undefined
      }else if(this.filter == 'aliVoiceId'){
        this.searchFilter.userName = undefined
        this.searchFilter.phoneNumber = undefined
        this.searchFilter.eMail = undefined
        this.searchFilter.aliTextureId = undefined
        this.searchFilter.aliVoiceId = this.searchText
      }
    }else{
      this.searchFilter.userName = undefined
      this.searchFilter.phoneNumber = undefined
      this.searchFilter.eMail = undefined
      this.searchFilter.aliTextureId = undefined
      this.searchFilter.aliVoiceId = undefined
    }

    this.uiService.setCurrentPage(1);
  }

}
