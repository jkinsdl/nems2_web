import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-public-platform-mapping',
  templateUrl: './add-public-platform-mapping.component.html',
  styleUrls: ['./add-public-platform-mapping.component.css']
})
export class AddPublicPlatformMappingComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPublicPlatformMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  datePicker : any
  ngOnInit(): void {
    this.datePicker = new Date()
  }

  close(){
    this.dialogRef.close()
  }
}
