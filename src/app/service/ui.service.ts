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

  pageSubject = new Subject();
  page$ = this.pageSubject.asObservable()

  page2Subject = new Subject();
  page2$ = this.page2Subject.asObservable()

  paginationSubject = new Subject()
  pagination$ = this.paginationSubject.asObservable()

  pagination2Subject = new Subject()
  pagination2$ = this.pagination2Subject.asObservable()

  getGridPageSize(gridHeight : number){
    return Math.floor((gridHeight - 50)/43)
  }

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

  chagnePage(page : number){
    this.pageSubject.next(page)
  }

  chagnePage2(page : number){
    this.page2Subject.next(page)
  }

  setPagination(pagination : any){
    this.paginationSubject.next(pagination)
  }

  setPagination2(pagination : any){
    this.pagination2Subject.next(pagination)
  }

}
