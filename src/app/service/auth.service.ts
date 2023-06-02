import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

//import { Observable, BehaviorSubject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // private tokenExpirationTimer: any;
  // private tokenExpirationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
  ) { }
  private Url = environment.httpText + environment.apiServer + "/api";
  //private Url = environment.httpText + environment.apiServer + ":" + environment.apiPort + "/api";
  //private Url = environment.httpText + "nems.suredatalab.kr/api";

  getPublickKey(){
    var url = `${this.Url}/auth`;
    return this.http.get<any>(url, { observe: "response" })
  }

  checkLogin(user : any){
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
    var url = `${this.Url}/token`;

    return this.http.get<any>(url, { observe: "response" })
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
}
