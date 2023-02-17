import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/service/util.service';

@Pipe({
  name: 'dateformat'
})
export class DateformatPipe implements PipeTransform {

  constructor(
    private utilService: UtilService
  ) { }

  transform(isoDate : string): unknown {
    let parameter : any = {
      value : isoDate
    }
    let result : string = this.utilService.gridDateFormat(parameter)


    return result;
  }

}
