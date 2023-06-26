import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StatisticsService } from '../../service/statistics.service';



@Injectable()
export class DashboardResolver implements Resolve<any> {
  constructor(private statisticsService: StatisticsService) {}

  resolve(): Observable<any> {
    return this.statisticsService.getStatisticsVehiclesSummary();
  }
}

