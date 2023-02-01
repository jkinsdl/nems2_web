import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SearchFilter } from 'src/app/object/searchFilter';
import { VehiclewarningService } from 'src/app/service/vehiclewarning.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-datect-error',
  templateUrl: './datect-error.component.html',
  styleUrls: ['./datect-error.component.css']
})
export class DatectErrorComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

}
