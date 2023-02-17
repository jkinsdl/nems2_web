import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-tooltip',
  templateUrl: './grid-tooltip.component.html',
  styleUrls: ['./grid-tooltip.component.css']
})
export class GridTooltipComponent implements ITooltipAngularComp {
  public data!: any;
  public date!:string
  agInit(params: { fildName: string } & ITooltipParams): void {
    this.data = params.api!.getDisplayedRowAtIndex(params.rowIndex!)!.data;

    this.date = this.data[params.fildName]

  }

}
