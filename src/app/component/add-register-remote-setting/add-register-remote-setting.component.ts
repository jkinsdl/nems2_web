import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-register-remote-setting',
  templateUrl: './add-register-remote-setting.component.html',
  styleUrls: ['./add-register-remote-setting.component.css']
})
export class AddRegisterRemoteSettingComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddRegisterRemoteSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService
  ) { }

  configureName : string = ""

  configureData : any = {
    carLocalSavePeriod: "",
    normalSubmitPeriod: "",
    warningSubmitPeriod: "",
    managePlatformName: "",
    managePlatformPort: "",
    hwVersion: "",
    fwVersion: "",
    carHeartBeatPeriod: "",
    carResponseTimeout: "",
    platformResponseTimeout: "",
    nextLoginInterval: "",
    publicPlatformName: "",
    publicPlatformPort: "",
    monitoring: "",
  }

  ngOnInit(): void {
    if(this.data.configure){
      this.configureName = this.data.configure.configureName
      this.configureData.carLocalSavePeriod = this.data.configure.carLocalSavePeriod
      this.configureData.normalSubmitPeriod = this.data.configure.normalSubmitPeriod
      this.configureData.warningSubmitPeriod = this.data.configure.warningSubmitPeriod
      this.configureData.managePlatformName = this.data.configure.managePlatformName
      this.configureData.managePlatformPort = this.data.configure.managePlatformPort
      this.configureData.hwVersion = this.data.configure.hwVersion
      this.configureData.fwVersion = this.data.configure.fwVersion
      this.configureData.carHeartBeatPeriod = this.data.configure.carHeartBeatPeriod
      this.configureData.carResponseTimeout = this.data.configure.carResponseTimeout
      this.configureData.platformResponseTimeout = this.data.configure.platformResponseTimeout
      this.configureData.nextLoginInterval = this.data.configure.nextLoginInterval
      this.configureData.publicPlatformName = this.data.configure.publicPlatformName
      this.configureData.publicPlatformPort = this.data.configure.publicPlatformPort
      this.configureData.monitoring = this.data.configure.monitoring
    }
  }

  addConfiguration(){

    if(this.configureName == ""){
      this.utilService.alertPopup("Parameter Configuration ", "Please enter configure name.",this.constant.ALERT_CONFIRMATION)
      return
    }

    let result = {
      configureName : this.configureName,
      body : this.configureData
    }

    this.dialogRef.close(result)

  }

  modifyConfiguration(){
    if(this.configureName == ""){
      this.utilService.alertPopup("Parameter Configuration ", "Please enter configure name.",this.constant.ALERT_CONFIRMATION)
      return
    }

    let result = {
      configureName : this.configureName,
      body : this.configureData
    }

    this.dialogRef.close(result)
  }

  close(){
    this.dialogRef.close()
  }

}
