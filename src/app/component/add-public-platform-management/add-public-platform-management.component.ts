import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UtilService } from 'src/app/service/util.service';
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
    private utilService: UtilService,
    private forwardingService : ForwardingService
  ) { }

  forwardingParameter : any = {
    serverName: "",
    domain: "",
    port: "",
    platformId: "",
    platformPw: "",
    startTs: undefined,
    endTs: undefined,
    noAck: "",
    forceLoginVehicle: "",
    filterLocationInfo : "",
    encryptionMode : "",
    encryptionKey : ""
  }

  ngOnInit(): void {
    console.log(this.data)

    if(this.data.type == this.constant.MODIFY_TYPE){
      this.getForwardingServerName(this.data.forwarding.serverName)
    }
  }

  getForwardingServerName(serverName : string){
    this.forwardingService.getForwardingServerName(serverName).subscribe(res=>{
      console.log(res)
      this.forwardingParameter = res.body
    },error=>{
      console.log(error)
    })
  }

  addForwarding(){
    console.log(this.forwardingParameter)

    if(this.forwardingParameter.serverName == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Server Name.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.domain == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the domain.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.port == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the port.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.platformId == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Platform ID.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.platformPw == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Platform password.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.startTs){
      this.forwardingParameter.startTs = new Date(this.forwardingParameter.startTs).toISOString()
    }

    if(this.forwardingParameter.endTs){
      this.forwardingParameter.endTs = new Date(this.forwardingParameter.endTs).toISOString()
    }


    this.dialogRef.close(this.forwardingParameter)
  }

  modifyForwarding(){
    console.log(this.forwardingParameter)

    if(this.forwardingParameter.serverName == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Server Name.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.domain == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the domain.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.port == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the port.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.platformId == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Platform ID.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.platformPw == "" ){
      this.utilService.alertPopup("Public Platform Management", "Please enter the Platform password.",this.constant.ALERT_WARNING)
      return
    }

    if(this.forwardingParameter.startTs){
      this.forwardingParameter.startTs = new Date(this.forwardingParameter.startTs).toISOString()
    }

    if(this.forwardingParameter.endTs){
      this.forwardingParameter.endTs = new Date(this.forwardingParameter.endTs).toISOString()
    }

    this.dialogRef.close(this.forwardingParameter)
  }

  close(){
    this.dialogRef.close()
  }

}
