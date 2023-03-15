import { Component, OnInit } from '@angular/core';
import { ILoadingCellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-toggle-cell-renderer',
  templateUrl: './toggle-cell-renderer.component.html',
  styleUrls: ['./toggle-cell-renderer.component.css']
})
export class ToggleCellRendererComponent implements ILoadingCellRendererAngularComp {
  params: any;
  isChecked : boolean = false
  agInit(params: any): void {
    this.params = params;
    this.isChecked = this.params.data.command
  }

  toggleField(){

    this.params.toggle(this.params.data, this.isChecked);
  }

}
