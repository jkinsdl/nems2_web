import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  language : string = "en"

  subTitle : string = ""

  ngOnInit(): void {
    this.subTitle = "DASHBOARD"
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

}
