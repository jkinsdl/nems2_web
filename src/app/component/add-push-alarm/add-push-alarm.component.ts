import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-push-alarm',
  templateUrl: './add-push-alarm.component.html',
  styleUrls: ['./add-push-alarm.component.css']
})
export class AddPushAlarmComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPushAlarmComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private notificationService : NotificationService,
    private utilService : UtilService
  ) { }

  ngOnInit(): void {

  }

  addAlarm(){

    let parameter = {
      templateId : "template",
      targetId : "target",
      variable : {}
    }
    this.notificationService.postNotifications(parameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)

      this.utilService.alertPopup("Vehicle Model", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)

    })


  }

  modifyAlarm(){
    this.dialogRef.close(true)
  }

  close(){
    this.dialogRef.close()
  }

}
