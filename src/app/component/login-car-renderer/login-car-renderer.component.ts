import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-login-car-renderer',
  templateUrl: './login-car-renderer.component.html',
  styleUrls: ['./login-car-renderer.component.css']
})
export class LoginCarRendererComponent implements ICellRendererAngularComp {
  public params!: any;

  agInit(params: any): void {
    this.params = params;
    console.log(this.params)
  }

  refresh() {
    return false;
  }

}
