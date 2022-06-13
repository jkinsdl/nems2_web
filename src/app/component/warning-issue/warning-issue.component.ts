import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-warning-issue',
  templateUrl: './warning-issue.component.html',
  styleUrls: ['./warning-issue.component.css']
})
export class WarningIssueComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<WarningIssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}
