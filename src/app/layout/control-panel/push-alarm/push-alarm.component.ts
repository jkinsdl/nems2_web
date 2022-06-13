import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddPushAlarmComponent } from 'src/app/component/add-push-alarm/add-push-alarm.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
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
  ) { }

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'name' },
    { field: 'phone_number', headerName: 'phone number'},
    { field: 'e_Mail', headerName : 'e-Mail'},
    { field: 'ali_cloud_texture_id', headerName : 'AliCloud texture ID'},
    { field: 'ali_cloud_voice_id', headerName : 'AliCloud Voice ID'},
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
  public rowSelection = 'multiple';
  ngOnInit(): void {
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

}
