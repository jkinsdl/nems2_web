import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  ) { }

  ngOnInit(): void {

  }

  close(){
    this.dialogRef.close()
  }

}
