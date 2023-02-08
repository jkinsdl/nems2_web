import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-battery-detail',
  templateUrl: './battery-detail.component.html',
  styleUrls: ['./battery-detail.component.css']
})
export class BatteryDetailComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<BatteryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }


}
