import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-otamanagement',
  templateUrl: './add-otamanagement.component.html',
  styleUrls: ['./add-otamanagement.component.css']
})
export class AddOTAManagementComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddOTAManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  addOTAManagement(){
    this.dialogRef.close(true)
  }

  close(){
    this.dialogRef.close()
  }

}
