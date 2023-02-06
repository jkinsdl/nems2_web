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

  forwardingParameter : any = {
    serverName: "string",
    domain: "string",
    port: 0,
    platformId: "string",
    platformPw: "string",
    lastLogin: "2023-02-06T02:05:43.640Z",
    lastLogout: "2023-02-06T02:05:43.640Z",
    connectionStatus: "UNKNOWN",
    command: "NONE",
    noAckMode: "string",
    forceLoginVehicle: true,
    filterLocationInfo: true,
    encryptionMode: "PLAIN",
    encryptionKey: "string"
  }

  ngOnInit(): void {

  }

  close(){
    this.dialogRef.close()
  }

}
