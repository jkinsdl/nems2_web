import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../service/ui.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    public router: Router,
    private uiService :UiService
  ) { }

  language : string = "en"

  subTitle : string = ""

  menuMode : number = 1;

  ngOnInit(): void {
    if(this.router.url.indexOf("dashboard") > -1){
      this.subTitle = "DASHBOARD"
    }else if(this.router.url.indexOf("monitoring") > -1){
      this.subTitle = "REALTIME MONITORING"
    }else if(this.router.url.indexOf("status") > -1){
      this.subTitle = "REALTIME STATUS"
    }else if(this.router.url.indexOf("statistics") > -1){
      this.subTitle = "STATISTICS"
    }else if(this.router.url.indexOf("failure") > -1){
      this.subTitle = "FAILURE"
    }else if(this.router.url.indexOf("alarm") > -1){
      this.subTitle = "ALARM"
    }else if(this.router.url.indexOf("history") > -1){
      this.subTitle = "ALARM HISTORY"
    }else if(this.router.url.indexOf("abnormalLocationVehicle") > -1){
      this.subTitle = "ABNORMAL LOCATION VEHICLE"
    }else if(this.router.url.indexOf("dataForwarding") > -1){
      this.subTitle = "DATA FORWARDING"
    }


  }

  signOut(){
    this.router.navigateByUrl('/login').then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  changeMenu(title : string){
    this.subTitle = title
  }

  changeMenuMode(){
    if(this.menuMode == 1){
      this.menuMode = 2
    }else {
      this.menuMode = 1
    }

    this.uiService.setMenuMode(this.menuMode)

  }

  clickMaps(){
    this.uiService.clickMapsBtn()
  }

  clickList(){
    this.uiService.clickListBtn()
  }

}
