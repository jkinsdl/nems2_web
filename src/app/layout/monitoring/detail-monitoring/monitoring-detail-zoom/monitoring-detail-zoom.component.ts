import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-monitoring-detail-zoom',
  templateUrl: './monitoring-detail-zoom.component.html',
  styleUrls: ['./monitoring-detail-zoom.component.css']
})
export class MonitoringDetailZoomComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  zoomOut(){
    this._location.back();
  }

}
