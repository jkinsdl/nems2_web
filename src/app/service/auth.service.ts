import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { tap } from 'rxjs/operators'; // Import the tap operator
import {Router} from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenExpirationTimer: any;
 

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  private Url = environment.httpText + environment.apiServer + "/api";
  

  getPublickKey(){
    var url = `${this.Url}/auth`;
    return this.http.get<any>(url, { observe: "response" })
  }

  checkLogin(user : any){
    console.log("checkLogin")
    var url = `${this.Url}/auth`;
    let parameter : any = {
      email : user.email,
      secret : user.password
    }

    return this.http.post<any>(url, parameter, httpOptions)
  }

  getLoginUrl(){
    var url = `http://nems.suredatalab.kr/api/login?autoRedirect=no`;
    return this.http.get<any>(url, { observe: "response" })
  }

  getToken(){ // 토큰 요청
    const url = `${this.Url}/token`;
    return this.http.get<any>(url, { observe: 'response' }).pipe(
      tap((response) => {
        console.log('Response headers:', response.headers);
        const expirationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const expiryTime = new Date(Date.now() + expirationDuration).toLocaleString();
        console.log('Token will expire at:', expiryTime);
        this.setLogoutTimer(expirationDuration);
      })
    );
  }

  deleteToken(){ // Sign-out
    var url = `${this.Url}/token`;
    return this.http.delete<any>(url, { observe: "response" })
  }

  putToken(){ //토큰 갱신
    var url = `${this.Url}/token`;
    return this.http.put<any>(url, { observe: "response" })
  }

  // setTokenExpirationTimer(expiresIn: number): void {
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout(); // Call the logout method when the token expires
  //   }, expiresIn * 1000);
  // }

  // clearTokenExpirationTimer(): void {
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //     this.tokenExpirationTimer = null;
  //   }
  // }

  // logout(): void {
  //   this.clearTokenExpirationTimer();
  //   console.log('Automatic logout called');
  // }

  setLogoutTimer(expirationDuration: number) {
    this.clearLogoutTimer();

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  logout() {
    // localStorage.removeItem('token');
    localStorage.removeItem('token');
    console.log('User logged out.');
    

    // Redirect to the login page
    this.router.navigate(['/component/login']);
  }
}

