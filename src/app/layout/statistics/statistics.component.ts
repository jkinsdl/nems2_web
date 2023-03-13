import { NgxMatDatetimePicker, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StatisticsService } from 'src/app/service/statistics.service';

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

  date : any
  currentDate : Date = new Date()
  constructor(
    public router: Router,
    private statisticsService : StatisticsService
  ) { }

  ngOnInit(): void {
    this.date = new Date()
    this.date.setDate(1)
    this.statisticsService.setStatisticsDate({_i : {date : 1, month : this.date.getMonth(), year: this.date.getFullYear()}})
  }

  setMonthAndYear(normalizedMonthAndYear: any, datepicker: NgxMatDatetimePicker<any>) {
    console.log(normalizedMonthAndYear)
    this.date = normalizedMonthAndYear

    this.statisticsService.setStatisticsDate(this.date)

    datepicker.close();
  }

}

