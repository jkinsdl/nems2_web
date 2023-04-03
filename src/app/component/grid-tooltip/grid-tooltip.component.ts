import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-grid-tooltip',
  templateUrl: './grid-tooltip.component.html',
  styleUrls: ['./grid-tooltip.component.css']
})
export class GridTooltipComponent implements ITooltipAngularComp {
  public data!: any;
  public date!:string
  public decoding! : string

  constructor(private utilService : UtilService,){}

  agInit(params: { fildName: string, type : string } & ITooltipParams): void {
    this.data = params.api!.getDisplayedRowAtIndex(params.rowIndex!)!.data;


    if(params.type == 'date'){
      this.date = this.data[params.fildName]
    }else if(params.type == 'decoding'){
      let p = {value : this.data[params.fildName]}
      this.decoding = this.utilService.base64ToHex(p)
    }

  }

}
