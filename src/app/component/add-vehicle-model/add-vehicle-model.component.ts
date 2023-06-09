import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-vehicle-model',
  templateUrl: './add-vehicle-model.component.html',
  styleUrls: ['./add-vehicle-model.component.css']
})
export class AddVehicleModelComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddVehicleModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService,
    private vehiclemanagerService : VehiclemanagerService,
    private router: Router

  ) { }

  addVehicleModelParameter : any = { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.vehicleModel){
      this.getVehiclemanagerModelModelName(this.data.vehicleModel.modelName)
    }
  }

  getVehiclemanagerModelModelName(modelName : string){
    this.vehiclemanagerService.getVehiclemanagerModelModelName(modelName).subscribe(res=>{
      console.log(res)
      this.addVehicleModelParameter = res.body
    },error=>{
      console.log(error)
    })
  }


  addVehicleModel(){
    console.log(this.addVehicleModelParameter)
    if(this.addVehicleModelParameter.modelName == ""){
      this.utilService.alertPopup("Vehicle Model", "Please enter the model name.", this.constant.ALERT_WARNING)
      return
    }

    for (const [key, value] of Object.entries(this.addVehicleModelParameter)) {
      if(value == null || value == undefined || value === ""){
        delete this.addVehicleModelParameter[key]
      }
    }

    this.vehiclemanagerService.postVehiclemanagerModel(this.addVehicleModelParameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Vehicle Model", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
  }

  modifyVehicleModel(){
    console.log(this.addVehicleModelParameter)
    if(this.addVehicleModelParameter.modelName == ""){
      this.utilService.alertPopup("Vehicle Model", "Please enter the model name.", this.constant.ALERT_WARNING)
      return
    }

    for (const [key, value] of Object.entries(this.addVehicleModelParameter)) {
      if(value == null || value == undefined || value === ""){
        delete this.addVehicleModelParameter[key]
      }
    }

    this.vehiclemanagerService.putVehiclemanagerModelModelName(this.addVehicleModelParameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Vehicle Model", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
  }

  close(){
    this.dialogRef.close()
  }

}
