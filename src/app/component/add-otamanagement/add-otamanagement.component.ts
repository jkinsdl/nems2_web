import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-otamanagement',
  templateUrl: './add-otamanagement.component.html',
  styleUrls: ['./add-otamanagement.component.css']
})
export class AddOTAManagementComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddOTAManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService,
    private vehiclemanagersService : VehiclemanagerService,
    private devicemanageService : DevicemanagerService
  ) { }

  firmware : any = {
    meta : {
      firmwareName : "",
      modelName : "",
      hwVersion : "",
      fwVersion : "",
    },
    contents : ""
  }

  selectFileName : string = ""

  modelList : any[] = []

  ngOnInit(): void {

    console.log(this.data)

    if(this.data.model){
      this.firmware.meta.modelName = this.data.model.modelName
    }

    this.getVehiclemanagerModel()
  }

  getVehiclemanagerModel(){
    this.vehiclemanagersService.getVehiclemanagerModel(new SearchFilter).subscribe(res=>{
      console.log(res)
      this.modelList = res.body.modelList
    },error=>{
      console.log(error)
    })
  }

  addOTAManagement(){

    if(this.firmware.meta.firmwareName == ""){
      this.utilService.alertPopup("Firmware Setting","Please enter the firmware name.",this.constant.ALERT_CONFIRMATION)
      return
    }

    if(this.firmware.meta.hwVersion == ""){
      this.utilService.alertPopup("Firmware Setting","Please enter the H/W Version.",this.constant.ALERT_CONFIRMATION)
      return
    }

    if(this.firmware.meta.fwVersion == ""){
      this.utilService.alertPopup("Firmware Setting","Please enter the F/W Version.",this.constant.ALERT_CONFIRMATION)
      return
    }

    if(this.firmware.meta.modelName == ""){
      this.utilService.alertPopup("Firmware Setting","Please enter the model name.",this.constant.ALERT_CONFIRMATION)
      return
    }

    let body : any[] =[]
    body=[
      {
          meta: this.firmware.meta
      },
      {
          contents: this.firmware.contents
      }
    ]
    this.devicemanageService.postDevicemanagersFirmware(body).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      this.utilService.alertPopup("OTA Management", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
    })
  }

  close(){
    this.dialogRef.close()
  }

  async fileChang(e : any){
    console.log(e.target.files[0])

    this.selectFileName = e.target.files[0].name

    let base64 = await this.utilService.getBase64(e.target.files[0])

    this.firmware.contents = base64

  }

}
