import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-public-platform-management',
  templateUrl: './add-public-platform-management.component.html',
  styleUrls: ['./add-public-platform-management.component.css']
})
export class AddPublicPlatformManagementComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPublicPlatformManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}
