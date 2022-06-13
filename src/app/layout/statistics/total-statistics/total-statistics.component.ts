import { Component, OnInit } from '@angular/core';
import { StatisticsPlan } from 'src/app/object/statistics-plan';
import { MatDialog } from '@angular/material/dialog';
import { CreateStatisticsPlanComponent } from 'src/app/component/create-statistics-plan/create-statistics-plan.component';
import { PlayStatisticsPlanComponent } from 'src/app/component/play-statistics-plan/play-statistics-plan.component';
import { UtilService } from 'src/app/service/util.service';
import { StatisticsWorkingQueue } from 'src/app/object/statistics-working-queue';
@Component({
  selector: 'app-total-statistics',
  templateUrl: './total-statistics.component.html',
  styleUrls: ['./total-statistics.component.css']
})
export class TotalStatisticsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private utilService : UtilService
  ) { }

  statisticsPlanList : StatisticsPlan[] = []

  statisticsWorkingQueueList : StatisticsWorkingQueue[] = []

  ngOnInit(): void {

    let statisticsPlan : StatisticsPlan = new StatisticsPlan;
    statisticsPlan.model = "Dummy"
    statisticsPlan.manual = "Manual"
    statisticsPlan.region = "Korea"
    statisticsPlan.purpose = "All"
    statisticsPlan.period = "Daily"

    this.statisticsPlanList.push(statisticsPlan)

    this.statisticsWorkingQueueList.push({
      status : 'Waiting',
      date : this.utilService.setDateFormat(new Date()),
      statisticsPlan : statisticsPlan
    })
  }

  playStatisticsPlan(statisticsPlan : StatisticsPlan){
    const dialogRef = this.dialog.open( PlayStatisticsPlanComponent, {
      data : statisticsPlan
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result){
        if(result.start){
          this.statisticsWorkingQueueList.push({
            status : 'Waiting',
            date : this.utilService.setDateFormat(result.start),
            statisticsPlan : statisticsPlan
          })
        }
        if(result.end){
          this.statisticsWorkingQueueList.push({
            status : 'Waiting',
            date : this.utilService.setDateFormat(result.end),
            statisticsPlan : statisticsPlan
          })
        }
      }
    });
  }

  deleteStatisticsPlan(statisticsPlan : StatisticsPlan){
    console.log("delete")
  }

  deleteStatisticsWorkingQueue(statisticsWorkingQueue : StatisticsWorkingQueue){

  }

  createStatisticsPlan(){
    const dialogRef = this.dialog.open( CreateStatisticsPlanComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.statisticsPlanList.push(result)
      }
    });
  }

  selectStatistics(statisticsPlan : StatisticsPlan){
    console.log(statisticsPlan)
  }

}
