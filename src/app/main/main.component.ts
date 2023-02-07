import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../service/ui.service';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    public router: Router,
    private uiService :UiService,
    private userService : UserService
  ) { }

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

  ngOnInit(): void {
    this.getUsersProfile()
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

    this.alertMessage$ = this.uiService.alertMessage$.subscribe((message:string) =>{
      this.alertMessage = message;
      this.messageOn = true
      setTimeout(()=>{
        this.messageOn = false
      },5000)
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

}
