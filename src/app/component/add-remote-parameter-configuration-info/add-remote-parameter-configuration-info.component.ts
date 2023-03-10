import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-remote-parameter-configuration-info',
  templateUrl: './add-remote-parameter-configuration-info.component.html',
  styleUrls: ['./add-remote-parameter-configuration-info.component.css']
})
export class AddRemoteParameterConfigurationInfoComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddRemoteParameterConfigurationInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private devicemanagersService : DevicemanagerService,
    private utilService : UtilService
  ) { }

  vinText : string = ""

  ngOnInit(): void {
    this.getDevicemanagersVehicles()
  }

  getDevicemanagersVehicles(){
    this.devicemanagersService.getDevicemanagersVehicles(new SearchFilter()).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }


  addConfigurationInfo(){

    let body = {
      vin : this.vinText
    }

    this.devicemanagersService.putDevicemanagersParametersConfigureNameVehicles(this.data.configureName,body).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      this.utilService.alertPopup("Remote Control Configure", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
    })
  }


  close(){
    this.dialogRef.close()
  }

}
