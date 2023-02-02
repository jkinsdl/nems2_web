import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';
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
    private utilService : UtilService
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

  ngOnInit(): void {
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

    this.dialogRef.close(this.firmware)
  }

  close(){
    this.dialogRef.close()
  }

}
