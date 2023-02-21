import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddPushAlarmComponent } from 'src/app/component/add-push-alarm/add-push-alarm.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-push-alarm',
  templateUrl: './push-alarm.component.html',
  styleUrls: ['./push-alarm.component.css']
})
export class PushAlarmComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    private dialog: MatDialog,
    private notificationService : NotificationService
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
  ngOnInit(): void {
    this.getNotifications()
    this.getNotificationsRejections()
    this.getNotificationsTemplates()

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
        let parameter = {
          templateId : "template",
          targetId : "target",
          variable : {}
        }
        this.notificationService.postNotifications(parameter).subscribe(res=>{
          console.log(res)
        },error=>{
          console.log(error)
        })
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

}
