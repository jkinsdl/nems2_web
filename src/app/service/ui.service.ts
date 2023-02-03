import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  menuModeSubject = new Subject<number>();
  menuMode$ = this.menuModeSubject.asObservable();

  mapsBtnSubject = new Subject();
  mapsBtn$ = this.mapsBtnSubject.asObservable()

  listBtnSubject = new Subject();
  listBtn$ = this.listBtnSubject.asObservable()

  alertMessageSubject = new Subject();
  alertMessage$ = this.alertMessageSubject.asObservable()

  setMenuMode(mode : number){
    this.menuModeSubject.next(mode)
  }

  clickMapsBtn(){
    this.mapsBtnSubject.next(null)
  }

  clickListBtn(){
    this.listBtnSubject.next(null)
  }

  setAlertMessage(message : string){
    this.alertMessageSubject.next(message)
  }



}
