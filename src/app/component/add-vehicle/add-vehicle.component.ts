import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RegionmanagersService } from 'src/app/service/regionmanagers.service';
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
    private utilService : UtilService,
    private regionmanagersService : RegionmanagersService
  ) { }

  addVehiclemanagerStaticinfoParameter : any = {
    vin: "",
    iccid: "",
    nemsSn: "",
    modelName: "",
    vehicleModel: null,
    pcode: "",
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

  provinceList : any[] =[]
  selectProvince : any

  cityList : any[] = []
  selectCity : any
  ngOnInit(): void {
    console.log(this.data)
    this.getRegionmanagers()
    this.getVehiclemanagerModel()
    if(this.data.type == this.constant.MODIFY_TYPE){
      this.getVehiclemanagerStaticinfoVin(this.data.vehicle.vin)

    }

  }

  getRegionmanagers(){
    this.regionmanagersService.getRegionmanagers(new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.provinceList = res.body.regions
    },error=>{
      console.log(error)
    })
  }

  getRegionmanagersPcode(pcode : string){
    this.regionmanagersService.getRegionmanagersPcode(pcode).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  setProvince(event : any){
    this.selectCity = undefined
    this.addVehiclemanagerStaticinfoParameter.pcode = undefined
    this.addVehiclemanagerStaticinfoParameter.region = undefined
    let f = new SearchFilter()
    for(let i = 0 ; i < this.provinceList.length; i++){
      if(event == this.provinceList[i].province){

      }
    }

    f.province = event

    this.regionmanagersService.getRegionmanagers(f).subscribe(res=>{
      console.log(res)
      this.cityList = res.body.regions
    },error=>{
      console.log(error)
    })
  }

  setCity(event : any){
    for(let i = 0 ; i <this.cityList.length; i++){
      if(event == this.cityList[i].city){
        this.addVehiclemanagerStaticinfoParameter.pcode = this.cityList[i].pcode
        this.addVehiclemanagerStaticinfoParameter.region = this.cityList[i].city
        break
      }
    }

  }

  getVehiclemanagerStaticinfoVin(vin : string){
    this.vehiclemanagersService.getVehiclemanagerStaticinfoVin(vin).subscribe(res=>{
      console.log(res)
      this.addVehiclemanagerStaticinfoParameter = res.body.vehicle

      this.getRegionmanagersPcode(this.addVehiclemanagerStaticinfoParameter.pcode)

    },error=>{
      console.log(error)
    })
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
      this.utilService.alertPopup("Vehicle","Please enter vin",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.iccid == ""){
      this.utilService.alertPopup("Vehicle","Please enter iccid",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.nemsSn == ""){
      this.utilService.alertPopup("Vehicle","Please enter nems S/N",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.modelName == ""){
      this.utilService.alertPopup("Vehicle","Please select Model Name",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.province == ""){
      this.utilService.alertPopup("Vehicle","Please select province",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.region == "" || this.addVehiclemanagerStaticinfoParameter.region == undefined){
      this.utilService.alertPopup("Vehicle","Please select region",this.constant.ALERT_WARNING)
      return
    }

    this.dialogRef.close(this.addVehiclemanagerStaticinfoParameter)
  }

  modifyVehicle(){
    console.log(this.addVehiclemanagerStaticinfoParameter)

    if(this.addVehiclemanagerStaticinfoParameter.iccid == ""){
      this.utilService.alertPopup("Vehicle","Please enter iccid",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.nemsSn == ""){
      this.utilService.alertPopup("Vehicle","Please enter nems S/N",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.modelName == ""){
      this.utilService.alertPopup("Vehicle","Please select Model Name",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.province == ""){
      this.utilService.alertPopup("Vehicle","Please select province",this.constant.ALERT_WARNING)
      return
    }

    if(this.addVehiclemanagerStaticinfoParameter.region == "" || this.addVehiclemanagerStaticinfoParameter.region == undefined){
      this.utilService.alertPopup("Vehicle","Please select region",this.constant.ALERT_WARNING)
      return
    }

    this.dialogRef.close(this.addVehiclemanagerStaticinfoParameter)

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
