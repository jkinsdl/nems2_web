import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UiService } from '../service/ui.service';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import { RealtimedataService } from '../service/realtimedata.service';
import { VehiclewarningService } from '../service/vehiclewarning.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    public router: Router,
    private uiService :UiService,
    private userService : UserService,
    private realtimedataService : RealtimedataService,
    private vehiclewarningsService : VehiclewarningService
  ) {
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.setSubTitle()
      }
  });
  }

  language : string = "en"

  subTitle : string = ""

  menuMode : number = 1;

  alertMessage : string = ""

  alertMessage$ : Subscription

  messageOn : boolean = false

  currentLoginUser : any = {
    username : '',
    authorityId : ''
  }

  warningcount : any = {
    critical : 0,
    major : 0,
    minor : 0
  }

  alarmInterval : any

  ngOnInit(): void {
    this.getUsersProfile()
    this.alertMessage$ = this.uiService.alertMessage$.subscribe((message:string) =>{
      this.alertMessage = message;
      this.messageOn = true
      setTimeout(()=>{
        this.messageOn = false
      },5000)
    })

    //this.alarmInterval = interval(3000).pipe().subscribe(x => this.getRealtimedataWarningcount());
    this.alarmInterval = interval(3000).pipe().subscribe(x => this.getVehiclewarningsStatisticsCount());
  }

  getVehiclewarningsStatisticsCount(){
    this.vehiclewarningsService.getVehiclewarningsStatisticsCount().subscribe(res=>{
      this.warningcount = res.body
      this.realtimedataService.alarmCountSubject.next(res.body)
    },error=>{
      console.log(error)
    })
  }

  getRealtimedataWarningcount(){

    this.realtimedataService.getRealtimedataWarningcount().subscribe(res=>{
      //console.log(res)
      this.warningcount = res.body
      this.realtimedataService.alarmCountSubject.next(res.body)
    },error=>{
      console.log(error)
    })
  }


  getUsersProfile(){
    this.userService.getUsersProfile().subscribe(res=>{
      console.log(res)
      localStorage.setItem('user', JSON.stringify(res.body));
      this.currentLoginUser = res.body
    },error=>{
      console.log(error)
      this.signOut()
    })
  }



  signOut(){
    localStorage.removeItem('user');
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

  setSubTitle(){
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

  alertMassageOpen(){

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.alarmInterval.unsubscribe()
  }

}
