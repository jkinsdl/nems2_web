import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-detail-server-log',
  templateUrl: './detail-server-log.component.html',
  styleUrls: ['./detail-server-log.component.css']
})
export class DetailServerLogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService
  ) { }

  serverLogData : any = {}

  ngOnInit(): void {

    this.serverLogData = JSON.parse(JSON.stringify(this.data.serverLog))
    console.log(this.serverLogData)

    for (const [key, value] of Object.entries(this.serverLogData)) {
      if(key == "packetTime" || key == "serverTime"){
        this.serverLogData[key] = this.utilService.setDateFormat(new Date(value.toString()));
      }else if(key == "data" || key == "responsePacket"){
        let p = {value : this.serverLogData[key]}
        this.serverLogData[key] = this.utilService.base64ToHex(p)
      }
    }

    console.log(this.data)
  }

  close(){
    this.dialogRef.close()
  }

}
