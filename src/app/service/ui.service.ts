import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  menuModeSubject = new Subject<number>();
  menuMode$ = this.menuModeSubject.asObservable();

  setMenuMode(mode : number){
    this.menuModeSubject.next(mode)
  }

}
