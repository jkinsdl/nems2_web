import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
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
    private utilService : UtilService,
    private devicemanagerService : DevicemanagerService
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

    let configureName = this.configureName
    let body = this.configureData

    console.log(configureName)
    console.log(body)

    for (const [key, value] of Object.entries(body)) {
      if(value == null || value == undefined || value === ""){
        delete body[key]
      }
    }


    this.devicemanagerService.putDevicemanagersParameterVehicle(configureName,body).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      this.utilService.alertPopup("Vehicle Model", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
    })

  }

  modifyConfiguration(){
    if(this.configureName == ""){
      this.utilService.alertPopup("Parameter Configuration ", "Please enter configure name.",this.constant.ALERT_CONFIRMATION)
      return
    }

    let configureName = this.configureName
    let body = this.configureData
    body.updatedUserId = JSON.parse(localStorage.getItem('user')).userId

    for (const [key, value] of Object.entries(body)) {
      if(value == null || value == undefined || value === ""){
        delete body[key]
      }
    }

    this.devicemanagerService.putDevicemanagersParameterVehicle(configureName,body).subscribe(res=>{
      console.log(res)

      this.dialogRef.close(true)
    },error=>{
      console.log(error)
    })
  }

  close(){
    this.dialogRef.close()
  }

}
