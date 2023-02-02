import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-upload-otamanagement',
  templateUrl: './upload-otamanagement.component.html',
  styleUrls: ['./upload-otamanagement.component.css']
})
export class UploadOTAManagementComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<UploadOTAManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  uploadOTAManagement(){
    this.dialogRef.close(true)
  }

  close(){
    this.dialogRef.close()
  }

}
