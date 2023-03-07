import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddPushAlarmComponent } from 'src/app/component/add-push-alarm/add-push-alarm.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { NotificationService } from 'src/app/service/notification.service';
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
    private uiService: UiService
  ) { }

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'name', tooltipField: 'name' },
    { field: 'phone_number', headerName: 'phone number', tooltipField: 'phone_number'},
    { field: 'e_Mail', headerName : 'e-Mail', tooltipField: 'e_Mail'},
    { field: 'ali_cloud_texture_id', headerName : 'AliCloud texture ID', tooltipField: 'ali_cloud_texture_id'},
    { field: 'ali_cloud_voice_id', headerName : 'AliCloud Voice ID', tooltipField: 'ali_cloud_voice_id'},
  ];

  rowData = [
      {
        name: 'name',
        phone_number: 'phone_number',
        e_Mail: 'e_Mail',
        ali_cloud_texture_id: 'ali_cloud_texture_id',
        ali_cloud_voice_id: 'ali_cloud_voice_id'
    },
    {
      name: 'name',
      phone_number: 'phone_number',
      e_Mail: 'e_Mail',
      ali_cloud_texture_id: 'ali_cloud_texture_id',
      ali_cloud_voice_id: 'ali_cloud_voice_id'
  },
  {
    name: 'name',
    phone_number: 'phone_number',
    e_Mail: 'e_Mail',
    ali_cloud_texture_id: 'ali_cloud_texture_id',
    ali_cloud_voice_id: 'ali_cloud_voice_id'
  }];

  gridApi!: GridApi;

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
    this.getNotifications()
    this.getNotificationsRejections()
    this.getNotificationsTemplates()
  }

  getPageSize(){
    this.gridHeight = this.pushAlarmGrid.nativeElement.offsetHeight
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
  }

  onResize(event : any){
    if(this.gridHeight != this.pushAlarmGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
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

      }
    });
  }

  modifyAlarm(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddPushAlarmComponent, {
        data:{
          type:this.constant.MODIFY_TYPE
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){

        }
      });
    }
  }

  deleteAlarm(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "Delete Push Alarm",
          alertContents : "Do you want to delete the alarm ? (name : " + this.gridApi.getSelectedRows()[0].name+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
        }
      });
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  onBtExport() {
    this.utilService.gridDataToExcelData("Push Alarm", this.gridApi ,this.rowData)
  }

}
