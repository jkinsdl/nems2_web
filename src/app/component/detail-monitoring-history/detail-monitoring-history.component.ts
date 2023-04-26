import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-detail-monitoring-history',
  templateUrl: './detail-monitoring-history.component.html',
  styleUrls: ['./detail-monitoring-history.component.css']
})
export class DetailMonitoringHistoryComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DetailMonitoringHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  close(){
    this.dialogRef.close()
  }


}
