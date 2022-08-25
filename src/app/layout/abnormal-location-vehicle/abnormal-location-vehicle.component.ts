import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abnormal-location-vehicle',
  templateUrl: './abnormal-location-vehicle.component.html',
  styleUrls: ['./abnormal-location-vehicle.component.css']
})
export class AbnormalLocationVehicleComponent implements OnInit {

  constructor(
    public router: Router,
    ) { }

  ngOnInit(): void {
  }
}
