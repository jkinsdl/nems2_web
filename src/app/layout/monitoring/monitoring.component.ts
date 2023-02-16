import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
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

  columnDefs: ColDef[] = [
    { field: 'isLogin',  headerName: 'Login'},
    { field: 'vin', headerName: 'VIN'},
    { field: 'regNumber', headerName : 'Reg. number'},
    { field: 'nemsSn', headerName : 'NEMS S/N' },
    { field: 'lastUpdate', headerName : 'Last Updated' },
    { field: 'accumulatedMile', headerName : 'Accumulated Mile(km)' },
    { field: 'packetCount', headerName : 'Packet Count' },
    { field: 'model', headerName : 'model' },
    { field: 'region', headerName : 'region' },
    { field: 'purpose', headerName : 'Purpose' },
    { field: 'warningLevel', headerName : 'Warning' },
    { field: 'soc', headerName : 'soc(%)' },
  ];

  vehicleInfo : any [] = []

  rowSelection = 'multiple';
  gridApi!: GridApi;

  filter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.startDate = new Date(new Date().getTime() -1*1000*60*60*24);
    this.endDate = new Date(new Date().getTime());

    this.getRealtimedataVehiclelist()
  }

  getVehicleRow(event : any){
    console.log(event.data)

    this.router.navigateByUrl('/main/monitoring/detail/'+event.data.vin).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });

  }

  getRealtimedataVehiclelist(){
    this.realtimedataService.getRealtimedataVehiclelist(this.filter).subscribe(
      res=>{
        console.log(res)
        this.vehicleInfo = res.body.vehicleBrief
      }, error=>{
        console.log(error)
      })
  }

  moveDetaileMonitoring(){
    this.router.navigateByUrl('/main/monitoring/detail/'+null).then(
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
