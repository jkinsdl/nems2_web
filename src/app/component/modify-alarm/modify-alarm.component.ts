import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';

@Component({
  selector: 'app-modify-alarm',
  templateUrl: './modify-alarm.component.html',
  styleUrls: ['./modify-alarm.component.css']
})
export class ModifyAlarmComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ModifyAlarmComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private vehiclewarningService : VehiclewarningService
  ) { }

  alarm : any = {
    comments : [],
    warningIssue : {
      createTime : "",
      issueId : "",
      lastPacketTime : "",
      state : "",
      vehicle : {},
      vin : "",
      warningLevel : "",
      warningType : ""
    }
  }

  commentsText : string = ""

  ngOnInit(): void {
    console.log(this.data)
    this.getVehiclewarningsIssueId()
  }

  getVehiclewarningsIssueId(){
    this.vehiclewarningService.getVehiclewarningsIssueId(this.data.alarm.issueId).subscribe(res=>{
      console.log(res)
      this.alarm = res.body
    },error=>{
      console.log(error)
    })
  }

  close(){
    this.dialogRef.close()
  }

  modifyAlarm(){
    this.dialogRef.close(this.alarm)
  }

  commentAdd(){
    if(this.commentsText != ""){
      let parameter = {
        comment : this.commentsText
      }
      this.vehiclewarningService.postVehiclewarningsIssueIdComment(this.data.alarm.issueId,parameter).subscribe(res=>{
        console.log(res)
        this.commentsText = ""
        this.getVehiclewarningsIssueId()
      },error=>{
        console.log(error)
      })
    }
  }

  commentRemove(comment : any){
    this.vehiclewarningService.deleteVehiclewarningsIssueIdCommentMessageId(this.data.alarm.issueId,comment.messageId).subscribe(res=>{
      console.log(res)
      this.getVehiclewarningsIssueId()
    },error=>{
      console.log(error)
    })
  }

}
