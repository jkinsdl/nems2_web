import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { PushinfosService } from 'src/app/service/pushinfos.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';
import {Router} from '@angular/router';


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
    private utilService : UtilService,
    private router: Router,
    private pushinfosService : PushinfosService
  ) { }

  parameter : any ={
    userName: "",
    phoneNumber: "",
    eMail: "",
    aliTextureId: "",
    aliVoiceId: ""
  }

  ngOnInit(): void {
    if(this.data.pushinfo){
      console.log(this.data.pushinfo)
      this.parameter.userName = this.data.pushinfo.userName
      this.parameter.phoneNumber = this.data.pushinfo.phoneNumber
      this.parameter.eMail = this.data.pushinfo.eMail
      this.parameter.aliTextureId = this.data.pushinfo.aliTextureId
      this.parameter.aliVoiceId = this.data.pushinfo.aliVoiceId
    }
  }

  addAlarm(){

    if(this.parameter.userName == ""){
      this.utilService.alertPopup("Push Alarm", "Please enter your username", this.constant.ALERT_WARNING)
      return
    }

    for (const [key, value] of Object.entries(this.parameter)) {
      if(value == null || value == undefined || value === ""){
        delete this.parameter[key]
      }
    }

    this.pushinfosService.postPushinfos(this.parameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401 && error.error === "Unauthorized"){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Push Alarm", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
  }

  modifyAlarm(){

    if(this.parameter.userName == ""){
      this.utilService.alertPopup("Push Alarm", "Please enter your username", this.constant.ALERT_WARNING)
      return
    }

    for (const [key, value] of Object.entries(this.parameter)) {
      if(value == null || value == undefined || value === ""){
        delete this.parameter[key]
      }
    }

    this.pushinfosService.putPushinfosPushinfoId(this.data.pushinfo.pushinfoId, this.parameter).subscribe(res=>{
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401 && error.error === "Unauthorized"){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Push Alarm", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
  }

  close(){
    this.dialogRef.close()
  }

}
