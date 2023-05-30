import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)

  constructor(
    public router: Router,

    private translate: TranslateService,
    private http: HttpClient


  ) { }

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
        
      });
    });
  }

     //MINE//
     isDropdownOpen = false;

     toggleDropdown():void{
       this.isDropdownOpen = !this.isDropdownOpen;
     }
   
    //  changeLanguage(language:string): void{
    //    this.language = language;
    //  } 
   
    onLanguageChange(event: any) {
     const language = event.target.value;
     this.translate.use(language).subscribe(() => {
       // Translation changed successfully
     });
   }

}
