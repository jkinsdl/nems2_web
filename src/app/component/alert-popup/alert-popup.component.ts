import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  title : string = "";
  contents : string = ""
  alertType : number
  popupType : number


  ngOnInit(): void {
    console.log(this.data)
    this.title = this.data.alertTitle
    this.contents = this.data.alertContents
    this.alertType = this.data.alertType
    this.popupType = this.data.popupType

  }

  ok(){
    this.dialogRef.close(true)
  }

  close(){
    this.dialogRef.close()
  }

}
