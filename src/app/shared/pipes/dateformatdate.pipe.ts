import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/service/util.service';

@Pipe({
  name: 'dateformatdate'
})
export class DateformatdatePipe implements PipeTransform {

  constructor(
    private utilService: UtilService
  ) { }

  transform(isoDate : string): unknown {
    let parameter : any = {
      value : isoDate
    }
    let result : string = this.utilService.dateFormatDate(parameter)


    return result;
  }

}
