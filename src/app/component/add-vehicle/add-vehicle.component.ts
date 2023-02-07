import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UtilService } from 'src/app/service/util.service';
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
    private vehiclemanagersService : VehiclemanagerService,
    private utilService : UtilService
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
    purpose: "PERSONAL",
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

    if(this.addVehiclemanagerStaticinfoParameter.vin == ""){

    }

    if(this.addVehiclemanagerStaticinfoParameter.iccid == ""){

    }

    if(this.addVehiclemanagerStaticinfoParameter.nemsSn == ""){

    }

    if(this.addVehiclemanagerStaticinfoParameter.modelName == ""){

    }

  }

  modifyVehicle(){
    console.log(this.addVehiclemanagerStaticinfoParameter)
  }

  changeModel(event : any){
    for(let i = 0; i < this.modelList.length; i++){
      if(event == this.modelList[i].modelName){
        this.addVehiclemanagerStaticinfoParameter.vehicleModel = this.modelList[i]
        break;
      }
    }
  }

  close(){
    this.dialogRef.close()
  }

}
