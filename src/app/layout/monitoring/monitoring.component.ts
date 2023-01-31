import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchFilter } from 'src/app/object/searchFilter';
import { RealtimedataService } from 'src/app/service/realtimedata.service';
import { UiService } from 'src/app/service/ui.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

  constructor(   private router: Router,
    private realtimedataService : RealtimedataService,
    private uiSerivce : UiService) { }

  currentPage : number = 1;

  startDate : any
  endDate :any

  mapsBtn$ : Subscription

  ngOnInit(): void {

    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());

    this.getVehicledataVehiclelist()

    this.mapsBtn$ = this.uiSerivce.mapsBtn$.subscribe(result=>{
      console.log(result)
      this.moveDetaileMonitoring(1)
    })

  }

  getVehicledataVehiclelist(){
    this.realtimedataService.getVehicledataVehiclelist(new SearchFilter()).subscribe(
      res=>{
        console.log(res)
      }, error=>{
        console.log(error)
      })
  }

  moveDetaileMonitoring(index : number ){
    this.router.navigateByUrl('/main/monitoring/detail').then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

  changePage(page : number){
    this.currentPage = page;
  }

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
    }
  }

  nextPage(){
    if(this.currentPage < 3){
      this.currentPage++;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.mapsBtn$)this.mapsBtn$.unsubscribe()
  }

}
