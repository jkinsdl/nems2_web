import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-monitoring',
  templateUrl: './detail-monitoring.component.html',
  styleUrls: ['./detail-monitoring.component.css']
})
export class DetailMonitoringComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  zoomIn(url : string){
    this.router.navigateByUrl('/nems/monitoring/detail/zoom/'+url).then(
      nav => {
        console.log(nav);
      },
      err => {
        console.log(err);
      });
  }

}
