import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private vehiclemanagersService : VehiclemanagerService
  ) { }

  addVehiclemanagerStaticinfoParameter : any = {
    vin: "",
    iccid: "",
    nemsSn: "",
    modelName: "",
    vehicleModel: null,
    zipCode: "",
    region: "",
    registrationPlate : "",
    purpose: "",
    engineNo: "",
    motorNo: "",
    batteryCode: "",
    sOffDate: "",
    registDate: "",
    histories: [
      {
        vin: "",
        createTime: "",
        changeField: "",
        prevValue: "",
        value: "",
        message: ""
      }
    ]
  }

  modelList : any[] = []

  ngOnInit(): void {
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

  addVehicle(){
    console.log(this.addVehiclemanagerStaticinfoParameter)
  }

  modifyVehicle(){
    console.log(this.addVehiclemanagerStaticinfoParameter)
  }

  changeModel(){
    this.addVehiclemanagerStaticinfoParameter.modelName = this.addVehiclemanagerStaticinfoParameter.vehicleModel.modelName
  }

  close(){
    this.dialogRef.close()
  }

}
