import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

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
    private vehiclemanagerService : VehiclemanagerService
  ) { }

  addVehicleModelParameter : any = {
    modelName: "",
    driveMotorKind: "",
    maxSpeed: "",
    pureElectricDistance: "",
    gearRatio: "",
    warningPreValue: "",
    fuelType: "",
    fuelLabel: "",
    maxPower: "",
    maxTorque: "",
    batteryType: "",
    batteryTotalEnergy: "",
    batteryCoolingSystem: "",
    motorCoolingSystem: "",
    ratedVoltage: "",
    motorMaxCurrent: "",
    motorType: "",
    motorPeakPower: "",
    motorMaxSpeed: "",
    motorPeakTorque: "",
    motorMaxTorque: "",
    powerRatio: "",
  }

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
    this.dialogRef.close(this.addVehicleModelParameter)
  }

  modifyVehicleModel(){
    console.log(this.addVehicleModelParameter)
    if(this.addVehicleModelParameter.modelName == ""){
      this.utilService.alertPopup("Vehicle Model", "Please enter the model name.", this.constant.ALERT_WARNING)
      return
    }
    this.dialogRef.close(this.addVehicleModelParameter)
  }

  close(){
    this.dialogRef.close()
  }

}
