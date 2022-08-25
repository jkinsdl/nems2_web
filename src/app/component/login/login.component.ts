import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  id : string = "";
  pw : string = "";

  idPlaceholderText = 'Please enter ID';
  passwordPlaceholderText = 'Please enter Password';

  isIdError : boolean = false;
  isPasswordError : boolean = false;

  isIdErrorMessage : string = "Please enter your ID"
  isPasswordErrorMessage : string = "Please enter a password"

  ngOnInit(): void {
  }

  checkUser(){
    if(this.id == ""){
      this.isIdError = true;
      return;
    }else {
      this.isIdError = false
    }

    if(this.pw == ""){
      this.isPasswordError = true;
      this.isPasswordErrorMessage = "Please enter a password"
      return;
    }else {
      this.isPasswordError = false
    }

    if(false){
      this.isPasswordError = true;
      this.isPasswordErrorMessage = "Please check your ID and password"
      return;
    }else {
      this.isPasswordError = false
    }

    this.router.navigateByUrl('/main/dashboard').then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });


  }


}
