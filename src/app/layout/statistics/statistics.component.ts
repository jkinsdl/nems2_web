import { NgxMatDatetimePicker, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StatisticsService } from 'src/app/service/statistics.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM',
  },
  display: {
    dateInput: 'YYYY-MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class StatisticsComponent implements OnInit {
  selectedLanguage: string; // Property to track the selected language(MINE)
  stateOptions: { label: string; value: string; }[];

  date : any
  currentDate : Date = new Date()
  constructor(
    public router: Router,
    private statisticsService : StatisticsService,

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

    this.date = new Date()
    this.date.setDate(1)
    this.statisticsService.setStatisticsDate({_i : {date : 1, month : this.date.getMonth(), year: this.date.getFullYear()}})
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
  

  setMonthAndYear(normalizedMonthAndYear: any, datepicker: NgxMatDatetimePicker<any>) {
    console.log(normalizedMonthAndYear)
    this.date = normalizedMonthAndYear

    this.statisticsService.setStatisticsDate(this.date)

    datepicker.close();
  }

}

