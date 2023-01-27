import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import * as forge from 'node-forge';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forge = require('node-forge');

  constructor(
    private router: Router,
    private authService : AuthService
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

    this.authService.getPublickKey().subscribe(
      res=>{
        console.log(res)
        let publicKeyRsa = this.forge.pki.publicKeyFromPem(res.body.publicKey);
        let text  = publicKeyRsa.encrypt(this.pw,'RSAES-PKCS1-V1_5')

        let parameter = {
          email : this.id,
          password : forge.util.encode64(text)
        }
        this.authService.checkLogin(parameter).subscribe(
          res2=>{
            console.log(res2)

            if(res2.status == 200){
              this.router.navigateByUrl('/main/dashboard').then(
                nav => {
                  console.log(nav);
                },
                err => {
                  console.log(err);
                });
            }
        },error =>{
          console.log(error)
        })
      },error =>{
        console.log(error)
      }
    )
  }
}
