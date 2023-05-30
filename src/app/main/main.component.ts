import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UiService } from '../service/ui.service';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import { RealtimedataService } from '../service/realtimedata.service';
import { VehiclewarningService } from '../service/vehiclewarning.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  //stateOptions: { label: string; value: string; }[];


  constructor(
    public router: Router,
    private uiService :UiService,
    private userService : UserService,
    private realtimedataService : RealtimedataService,
    private vehiclewarningsService : VehiclewarningService,

    private translate: TranslateService,
    private http: HttpClient
  ) {

    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.setSubTitle()
      }
  });
  }

  translateText(key: string): string {
    return this.translate.instant(key);
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

  currntLanguage = 'en';

  ngOnInit(): void {
    this.selectedLanguage = 'en'; // Set the default language
    this.translate.setDefaultLang('en'); // Set the default language

    // Load the translation file for the selected language
    const languageToLoad = this.selectedLanguage;
    const translationFile = `../assets/i18n/dashboard/${languageToLoad}.json`;

    this.translate.use(languageToLoad).subscribe(() => {
      this.http.get<any>(translationFile).subscribe((data) => {
        this.translate.setTranslation(languageToLoad, data);
        console.log('Translation file loaded successfully');
        this.setSubTitle();
      });
    });

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

    // this.selectedLanguage = 'en'; //MINE
    // this.translate.setDefaultLang('en'); // Set the default language

    // // Load the translation file for Chinese
    // this.translate.use('zh-CN').subscribe(() => {
    //   this.http.get<any>('./assets/i18n/dashboard/zh-CN.json').subscribe((data) => {
    //     this.translate.setTranslation('zh-CN', data);
    //     console.log('Translation file loaded successfully');
    //   });
    // });



  }

  //MINE//
  isDropdownOpen = false;

  toggleDropdown():void{
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  changeLanguage(language:string): void{
    this.language = language;
  }

 onLanguageChange() {
  const language = this.currntLanguage;
  this.uiService.setCurrentLanguage(language)
  this.translate.use(language).subscribe(() => {
    // Translation changed successfully
    this.setSubTitle();
  });
}

  //MINE//

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
      //this.subTitle = "DASHBOARD"
      this.translate.get("DASHBOARD").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("monitoring") > -1){
      this.translate.get("REALTIME MONITORING").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("status") > -1){
      this.translate.get("REALTIME STATUS").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("statistics") > -1){
      this.translate.get("STATISTICS").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("failure") > -1){
      this.subTitle = "FAILURE"
    }else if(this.router.url.indexOf("alarm") > -1){
      this.translate.get("ALARM").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("history") > -1){
      this.subTitle = "ALARM HISTORY"
    }else if(this.router.url.indexOf("abnormalLocationVehicle") > -1){
      this.subTitle = "ABNORMAL LOCATION VEHICLE"
    }else if(this.router.url.indexOf("dataForwarding") > -1){
      this.subTitle = "DATA FORWARDING"
    }else if(this.router.url.indexOf("userAccount") > -1){
      this.translate.get("USER ACCOUNT").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("vehicle") > -1){
      this.translate.get("VEHICLE SETTINGS").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("publicPlatform") > -1){
      this.translate.get("PUBLIC PLATFORM").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("serverLogs") > -1){
      this.translate.get("SERVER LOG").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("otaInformation") > -1){
      this.translate.get("OTA INFORMATION").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("remoteControl") > -1){
      this.translate.get("REMOTE CONTROL").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("terminal") > -1){
      this.translate.get("TERMINAL").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("otaManagement") > -1){
      this.translate.get("OTA MANAGEMENT").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("pushAlarm") > -1){
      this.translate.get("PUSH ALARM").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
    }else if(this.router.url.indexOf("detectError") > -1){
      this.translate.get("DETECT ERROR").subscribe((translatedText: string) => {
        this.subTitle = translatedText;
      });
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
