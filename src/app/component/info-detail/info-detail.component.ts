import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.css']
})
export class InfoDetailComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<InfoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService
  ) { }

  titleType : string = ""
  keyValueList : any[] = []

  ngOnInit(): void {
    console.log(this.data)
    let rowData : any
    if(this.data.type == 'car'){
      this.titleType = "CAR"
      rowData = this.data.info.car
    }else if(this.data.type == 'extreme_value'){
      this.titleType = "EXTREME VALUE"
      rowData = this.data.info.extremeValue
    }else if(this.data.type == 'location'){
      this.titleType = "LOCATION"
      rowData = this.data.info.location
    }else if(this.data.type == 'motors'){
      this.titleType = "MOTORS"
      rowData = this.data.info.motors
    }else if(this.data.type == 'power_battery_infos'){
      this.titleType = "POWER BATTERY INFOS"
      rowData = this.data.info.powerBatteryInfos[0]
    }else if(this.data.type == 'power_battery_temperatures'){
      this.titleType = "POWER BATTERY TEMPERATURES"
      rowData = this.data.info.powerBatteryTemperatures[0]
    }else if(this.data.type == 'warning'){
      this.titleType = "WARNING"
      rowData = this.data.info.warning
    }

    if(this.data.type != 'motors'){
      for (const [key, value] of Object.entries(rowData)) {
        if(key != "cellAmperes" && key != "sensorTemps"){
          let k = key
          let v = value
          if(key == "time"){
            v = this.utilService.setDateFormat(new Date(value.toString()));
          }
          this.keyValueList.push({
            key : k,
            value : v,
          })
        }
      }
    }else{

      for(let i = 0 ; i < rowData.length; i++ ){

        if(i == 0){
          for (const [key, value] of Object.entries(rowData[i])) {
            if(key != "cellAmperes" && key != "sensorTemps"){
              let k = key
              let v = value
              if(key == "time"){
                v = this.utilService.setDateFormat(new Date(value.toString()));
              }
              this.keyValueList.push({
                key : k,
                value : v,
              })
            }
          }
        }else {
          for (const [key, value] of Object.entries(rowData[i])) {

            if(key != "cellAmperes" && key != "sensorTemps"){
              let v = value
              if(key == "time"){
                v = this.utilService.setDateFormat(new Date(value.toString()));
              }

              for(let j = 0; j < this.keyValueList.length; j++){
                if(key == this.keyValueList[j].key){
                  this.keyValueList[j]["value"+i] = v;
                }
              }
            }
          }
        }
      }

      console.log(this.keyValueList)

    }



  }

  close(){
    this.dialogRef.close()
  }
}
