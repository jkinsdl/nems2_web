import { Component } from '@angular/core';
import { ILoadingCellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-btn-cell-renderer',
  templateUrl: './btn-cell-renderer.component.html',
  styleUrls: ['./btn-cell-renderer.component.css']
})
export class BtnCellRendererComponent implements ILoadingCellRendererAngularComp {
  params: any;

  agInit(params: { onlyRemove: boolean } & any): void {
    console.log(params.onlyRemove)
    this.params = params;
  }

  modifyField(){
    this.params.modify(this.params.data);
  }

  deleteField(){
    this.params.delete(this.params.data);
  }

}
