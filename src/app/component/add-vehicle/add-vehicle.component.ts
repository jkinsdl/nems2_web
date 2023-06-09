import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RegionmanagersService } from 'src/app/service/regionmanagers.service';
import { UtilService } from 'src/app/service/util.service';
import { VehiclemanagerService } from 'src/app/service/vehiclemanager.service';
import { CommonConstant } from 'src/app/util/common-constant';
import { Router } from '@angular/router';

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
    private regionmanagersService : RegionmanagersService,
    private vehiclemanagerService : VehiclemanagerService,
    private router: Router
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

  modifyHistory : any[] = []

  sOffDateText : string = ""

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
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  getRegionmanagersPcode(pcode : string){
    this.regionmanagersService.getRegionmanagersPcode(pcode).subscribe(res=>{
      console.log(res)
      this.selectProvince = res.body.province
      this.setProvince(this.selectProvince)
      this.selectCity = res.body.city
      this.setCity(this.selectCity)
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
      this.modifyHistory = res.body.modifyHistory
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
      if (error.status === 401) {
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
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

    if(this.addVehiclemanagerStaticinfoParameter.sOffDate){
      let date : Date

      if(this.addVehiclemanagerStaticinfoParameter.sOffDate._d == undefined){
        date = new Date(this.addVehiclemanagerStaticinfoParameter.sOffDate)
      }else {
        date = new Date(this.addVehiclemanagerStaticinfoParameter.sOffDate._d)
      }

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      console.log(date)
      this.addVehiclemanagerStaticinfoParameter.sOffDate = date.toISOString()
    }

    if(this.addVehiclemanagerStaticinfoParameter.registDat){
      this.addVehiclemanagerStaticinfoParameter.registDate = this.addVehiclemanagerStaticinfoParameter.registDate._d == undefined ? new Date(this.addVehiclemanagerStaticinfoParameter.registDate).toISOString() : new Date(this.addVehiclemanagerStaticinfoParameter.registDate._d).toISOString()
    }

    this.vehiclemanagerService.postVehiclemanagerStaticinfo(this.addVehiclemanagerStaticinfoParameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Vehicle Settings", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
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

    if(this.addVehiclemanagerStaticinfoParameter.sOffDate){

      let date : Date

      if(this.addVehiclemanagerStaticinfoParameter.sOffDate._d == undefined){
        date = new Date(this.addVehiclemanagerStaticinfoParameter.sOffDate)
      }else {
        date = new Date(this.addVehiclemanagerStaticinfoParameter.sOffDate._d)
      }

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      console.log(date)
      this.addVehiclemanagerStaticinfoParameter.sOffDate = date.toISOString()
    }

    if(this.addVehiclemanagerStaticinfoParameter.registDate){
      this.addVehiclemanagerStaticinfoParameter.registDate = this.addVehiclemanagerStaticinfoParameter.registDate._d == undefined ? new Date(this.addVehiclemanagerStaticinfoParameter.registDate).toISOString() : new Date(this.addVehiclemanagerStaticinfoParameter.registDate._d).toISOString()
    }

    this.vehiclemanagerService.putVehiclemanagerStaticinfoVin(this.addVehiclemanagerStaticinfoParameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Vehicle Settings", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })
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

  removeSOffDate(){
    delete this.addVehiclemanagerStaticinfoParameter.sOffDate
  }

  removeregistDate(){
    this.addVehiclemanagerStaticinfoParameter.registDate = null
  }

  changeSOffDate(e : any){
    let parameter = {
      value : this.addVehiclemanagerStaticinfoParameter.sOffDate._d
    }
    this.sOffDateText = this.utilService.dateFormatDate(parameter)
  }
}
